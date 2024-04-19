import { useState, useEffect } from "react";
import { Typography, Card, CardContent } from "@mui/material";
import ResizableDrawer from "./ResizableDrawer";
import GridPropsMenu from "./GridPropsMenu";
import TypesEditorMenu from "./TypesEditorMenu";
import CommitGridMenu from "./CommitGridMenu";
import EditorMap from "./EditorMap";
import gridCreator from "./gridCreator";

export default function EditorMenu() {
  const [typesTable, setTypesTable] = useState([]);
  const [selectedType, setSelectedType] = useState({}); // [type, setType
  const [gridProps, setGridProps] = useState({});
  const [createdGrid, setCreatedGrid] = useState({});

  // create a grid only if gridProps and typesTable are not empty and only when they change
  useEffect(() => {
    if (Object.keys(gridProps).length > 0 && typesTable.length > 0) {
      let grid = gridCreator(gridProps, typesTable);
      setCreatedGrid(grid);
    }
  }, [gridProps, typesTable]);

  return (
    <>
      {/* if createdGrid is not empty, pass it to the EditorMap component */}
      {Object.keys(createdGrid).length > 0 && (
        <EditorMap
          createdGrid={createdGrid}
          gridProps={gridProps}
          selectedType={selectedType}
        />
      )}

      <ResizableDrawer direction={"left"}>
        <Card variant="outlined" sx={{ width: "100%" }}>
          <CardContent>
            {/* some gap above */}

            <Typography sx={{ marginBottom: 2, marginTop: 5 }} variant="h2">
              CityScope Grid Maker
            </Typography>
            <Typography sx={{ marginBottom: 3, marginTop: 3 }}>
              This editor can create and `commit` spatial layouts (`grids`) as a
              baseline for CityScope projects. Use the menus and map to edit
              girds, types, and props, and commit them to cityIO.
            </Typography>
            <GridPropsMenu setGridProps={setGridProps} />
            <TypesEditorMenu
              setTypesTable={setTypesTable}
              setSelectedType={setSelectedType}
            />
            <CommitGridMenu
              gridProps={gridProps}
              typesList={typesTable}
              generatedGrid={createdGrid}
            />
          </CardContent>
        </Card>
      </ResizableDrawer>
    </>
  );
}
