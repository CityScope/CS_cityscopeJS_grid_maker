import EditorBrush from "./EditorBrush";
import { useEffect, useState, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { GeoJsonLayer } from "deck.gl";
import { hexToRgb, testHex } from "../../utils/utils";
import { BitmapLayer } from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function EditorMap(props) {
  const createGrid = props.createdGrid;
  const gridProps = props.gridProps;
  const selectedType = props.selectedType;

  const [grid, setGrid] = useState(createGrid);

  useEffect(() => {
    setGrid(createGrid);
  }, [createGrid]);

  // get the selected type from the store
  const deckGLref = useRef(null);
  const pickingRadius = 40;
  const [keyDownState, setKeyDownState] = useState();
  const [mousePos, setMousePos] = useState();
  const [mouseDown, setMouseDown] = useState();
  const [draggingWhileEditing, setDraggingWhileEditing] = useState(false);

  // set view state
  const [viewState, setViewState] = useState({
    latitude: gridProps.latitude,
    longitude: gridProps.longitude,
    zoom: 15,
    pitch: 0,
    bearing: 0,
    orthographic: true,
  });

  // update view state when view state changes
  const onViewStateChange = ({ viewState }) => {
    setViewState(viewState);
  };

  useEffect(() => {
    // convert the gridProps.latitude and gridProps.longitude to numbers
    gridProps.latitude = parseFloat(gridProps.latitude);
    gridProps.longitude = parseFloat(gridProps.longitude);

    // Update view state when latitude or longitude props change
    setViewState((prevState) => ({
      ...prevState,
      latitude: gridProps.latitude,
      longitude: gridProps.longitude,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridProps.latitude, gridProps.longitude]);

  // fix deck view rotate
  useEffect(() => {
    const deckWrapper = document.getElementById("deckgl-wrapper");
    if (deckWrapper) {
      deckWrapper.addEventListener("contextmenu", (evt) =>
        evt.preventDefault()
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const multipleObjPicked = (event) => {
    /**
     * Description. uses deck api to
     * collect objects in a region
     * @argument{object} event picking event
     */
    const dim = pickingRadius;
    const x = event.x - dim / 2;
    const y = event.y - dim / 2;
    let multipleObj = deckGLref.current.pickObjects({
      x: x,
      y: y,
      width: dim,
      height: dim,
    });
    return multipleObj;
  };

  /**
   * Description. allow only to pick cells that are
   *  not of CityScope TUI & that are intractable
   * so to not overlap TUI activity
   */
  const handleGridCellEditing = (event) => {
    // if selectedType is an object without length then return
    if (!selectedType || !selectedType.color) return;
    const { height, name, color, interactive } = selectedType;
    const multiSelectedObj = multipleObjPicked(event);
    multiSelectedObj.forEach((pickedObject, index) => {
      // create a copy of the object
      const thisCellProps = { ...pickedObject.object.properties };
      // modify the copy properties to match the selected type
      thisCellProps.color = testHex(color) ? hexToRgb(color) : color;
      thisCellProps.height = height;
      thisCellProps.name = name;
      thisCellProps.interactive = interactive;
      //  assign the modified copy to the grid object
      grid.features[pickedObject.index].properties = thisCellProps;
      // set the grid object to the state
      setGrid({ ...grid });
    });
  };

  /**
   * Description.
   * draw target area around mouse
   */
  const renderEditorBrush = () => {
    return (
      selectedType &&
      selectedType.color && (
        <EditorBrush
          mousePos={mousePos}
          selectedType={selectedType}
          divSize={pickingRadius}
          mouseDown={mouseDown}
        />
      )
    );
  };

  const handleKeyUp = () => {
    setKeyDownState(null);
  };

  const handleKeyDown = (e) => {
    // avoid common clicks
    setKeyDownState(e.nativeEvent.key);
  };

  /**
   * renders deck gl layers
   */
  const renderLayers = () => {
    const layers = [
      new TileLayer({
        data:
          `https://api.mapbox.com/styles/v1/relnox/cjlu6w5sc1dy12rmn4kl2zljn/tiles/256/{z}/{x}/{y}?access_token=` +
          process.env.REACT_APP_MAPBOX_TOKEN +
          "&attribution=false&logo=false&fresh=true",
        minZoom: 0,
        maxZoom: 21,
        tileSize: 256,
        // opacity: 0.25,

        renderSubLayers: (props) => {
          const {
            bbox: { west, south, east, north },
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
          });
        },
      }),

      new GeoJsonLayer({
        id: "GRID",
        opacity: 0.6,
        stroked: false,
        filled: true,
        wireframe: true,
        visible: true,
        pickable: true,
        data: grid,
        extruded: true,
        lineWidthScale: 5,
        lineWidthMinPixels: 1,
        getElevation: (d) => d.properties.height[1],
        getFillColor: (d) => d.properties.color,
        onClick: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift")
            handleGridCellEditing(event);
        },
        onDrag: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift")
            handleGridCellEditing(event);
        },
        onDragStart: (event, cellInfo) => {
          if (!cellInfo.rightButton && keyDownState !== "Shift") {
            setDraggingWhileEditing(true);
          }
        },
        onDragEnd: () => {
          setDraggingWhileEditing(false);
        },
        updateTriggers: {
          getFillColor: grid,
          getElevation: grid,
        },
        // animate the update of the grid
        transitions: {
          getFillColor: 100,
          getElevation: 100,
        },
      }),
    ];
    return layers;
  };

  return (
    <div
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onMouseMove={(e) => setMousePos(e.nativeEvent)}
      onMouseUp={() => {
        // ! when mouse is up, dispatch the grid to the store
        //! so it will be sent to the server when committing
        //! dispatch(updateGridMaker(grid));
        setMouseDown(false);
      }}
      onMouseDown={() => setMouseDown(true)}
    >
      {renderEditorBrush()}

      <DeckGL
        ref={deckGLref}
        viewState={viewState}
        onViewStateChange={onViewStateChange}
        layers={renderLayers()}
        controller={{
          dragPan: !draggingWhileEditing,
          dragRotate: !draggingWhileEditing,
          keyboard: false,
        }}
      ></DeckGL>
    </div>
  );
}
