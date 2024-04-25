import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { GridEditorSettings } from "../../settings/settings";
import { Typography, List, ListItem } from "@mui/material";
import Link from "@mui/material/Link";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

const reqResponseUI = (isError, payload) => {
  let resText = null;
  if (isError) {
    resText = (
      <Alert variant="outlined" severity="error">
        Error: {payload}
      </Alert>
    );
  } else {
    let cityscopeJSendpoint =
      "https://cityscope.media.mit.edu/CS_cityscopeJS/?cityscope=" + payload;
    // create the feedback text
    resText = (
      <Alert variant="outlined" severity="success">
        Grid deployed to{" "}
        <Link color="textSecondary" href={cityscopeJSendpoint}>
          {cityscopeJSendpoint}
        </Link>
      </Alert>
    );
  }

  return resText;
};

const makeGEOGRIDobject = (struct, typesList, geoJsonFeatures, gridProps) => {
  let GEOGRIDObject = { ...struct };

  // take types list and prepare to csJS format
  let newTypesList = {};
  typesList.forEach((oldType) => {
    newTypesList[oldType.name] = { ...oldType };
    //material-table creates strings for these items
    // so in first "Commit to cityIO", these must be turned into
    // Json objects. On Second commit, these are already objects,
    // hence the two conditions below
    newTypesList[oldType.name].LBCS =
      typeof oldType.LBCS === "string"
        ? JSON.parse(oldType.LBCS)
        : oldType.LBCS;
    newTypesList[oldType.name].NAICS =
      typeof oldType.NAICS === "string"
        ? JSON.parse(oldType.NAICS)
        : oldType.NAICS;
  });

  GEOGRIDObject.properties.types = newTypesList;
  // inject table props to grid
  GEOGRIDObject.properties.header = { ...gridProps };

  const toFloatArray = [
    "longitude",
    "latitude",
    "rotation",
    "nrows",
    "ncols",
    "cellSize",
  ];
  toFloatArray.forEach((element) => {
    GEOGRIDObject.properties.header[element] = parseFloat(
      GEOGRIDObject.properties.header[element]
    );
  });

  // lastly get the grid features
  GEOGRIDObject.features = geoJsonFeatures;
  return GEOGRIDObject;
};

const makeGEOGRIDDATAobject = (geoJsonFeatures) => {
  let GEOGRIDDATA_object = [];
  geoJsonFeatures.forEach((element) => {
    GEOGRIDDATA_object.push(element.properties);
  });
  return GEOGRIDDATA_object;
};

export default function CommitGridMenu(props) {
  const [loading, setLoading] = useState(false);
  const [reqResponse, setReqResponse] = useState();
  const gridProps = props.gridProps;
  const typesList = props.typesList;
  const generatedGrid = props.generatedGrid;
  const generatedGridBool =
    generatedGrid &&
    generatedGrid.features &&
    generatedGrid.features.length > 0;

  const postGridToCityIO = async () => {
    let GEOGRIDStructure = GridEditorSettings.GEOGRID;
    let geoJsonFeatures = generatedGrid.features;
    // take grid struct from settings
    let GEOGRIDObject = makeGEOGRIDobject(
      GEOGRIDStructure,
      typesList,
      geoJsonFeatures,
      gridProps
    );

    let GEOGRIDDATAObject = makeGEOGRIDDATAobject(geoJsonFeatures);
    let tableName = GEOGRIDObject.properties.header.tableName.toLowerCase();

    const new_table_grid = {
      GEOGRID: GEOGRIDObject,
      GEOGRIDDATA: GEOGRIDDATAObject,
    };

    const apiUrl = "https://cityio.media.mit.edu/cityio/api/table/";
    const url = apiUrl + tableName;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_table_grid),
      });

      if (!response.ok) {
        throw new Error("Error creating table");
      }
      const result = await response.json();
      setReqResponse(reqResponseUI(false, tableName));
      return result;
    } catch (error) {
      console.error("error", error.message);
      setReqResponse(reqResponseUI(true, error.message.toString()));
    }
  };

  return (
    <List>
      <ListItem>
        <Typography variant="h4">Upload Grid to cityIO</Typography>
      </ListItem>
      {reqResponse ? reqResponse : null}
      {generatedGridBool && (
        <>
          <LoadingButton
            onClick={() => {
              setReqResponse();
              setLoading(true);
              new Promise((resolve) => {
                setTimeout(() => {
                  setLoading(false);
                  postGridToCityIO();
                }, 1500);
                resolve();
              });
            }}
            loading={loading}
            fullWidth
            loadingPosition="start"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
          >
            Upload
          </LoadingButton>
        </>
      )}
    </List>
  );
}
