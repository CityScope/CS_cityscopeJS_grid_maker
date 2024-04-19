import { useState, useEffect } from "react";
import { TextField, Typography, List, ListItem, Stack } from "@mui/material";
import { GridEditorSettings } from "../../settings/settings";
import Alert from "@mui/material/Alert";

export default function GridProps(props) {
  // get the setGridProps function from the parent component
  const setGridProps = props.setGridProps;
  // grid settings from the settings file
  const settings = GridEditorSettings;

  // set the initial form values to the settings file
  const [formValues, setFormValues] = useState({
    tableName: settings.GEOGRID.properties.header.tableName,
    latitude: settings.GEOGRID.properties.header.latitude,
    longitude: settings.GEOGRID.properties.header.longitude,
    tz: settings.GEOGRID.properties.header.tz,
    nrows: settings.GEOGRID.properties.header.nrows,
    ncols: settings.GEOGRID.properties.header.nrows,
    rotation: settings.GEOGRID.properties.header.rotation,
    cellSize: settings.GEOGRID.properties.header.cellSize,
    projection: settings.GEOGRID.properties.header.projection,
  });

  const handleFormUpdates = (event) => {
    const { id, value } = event.target;
    setFormValues({ ...formValues, [id]: value });
  };

  useEffect(() => {
    //update the grid props to the parent component
    setGridProps(formValues);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  //  get all data
  // https://stackoverflow.com/questions/56641235/react-how-to-get-values-from-material-ui-textfield-components
  return (
    <List>
      <ListItem>
        <Typography variant="h4">Set Grid Properties</Typography>
        {/* add a warning  */}
      </ListItem>
      <ListItem>
        <Alert variant="outlined"  severity="warning">
          Warning: changing these properties will generate a new grid!
        </Alert>
      </ListItem>
      <ListItem>
        <TextField
          inputProps={{ style: { fontSize: 30 } }} // font size of input text
          onChange={(event) => handleFormUpdates(event)}
          variant="outlined"
          fullWidth
          id="tableName"
          label="CityScope Project Name"
          defaultValue={formValues.tableName}
        />
      </ListItem>
      <ListItem>
        <Stack direction="row" spacing={1}>
          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="latitude"
            label="Latitude"
            defaultValue={formValues.latitude}
            type="number"
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="longitude"
            label="Longitude"
            defaultValue={formValues.longitude}
            type="number"
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="tz"
            label="Time Zone (GMT)"
            defaultValue={formValues.tz}
            type="number"
          />
        </Stack>
      </ListItem>
      <ListItem>
        <Stack direction="row" spacing={1}>
          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="nrows"
            label="Rows"
            defaultValue={formValues.nrows}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="ncols"
            label="Columns"
            defaultValue={formValues.ncols}
            type="number"
            InputProps={{
              inputProps: {
                max: 100,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="rotation"
            label="Rotation (deg)"
            defaultValue={formValues.rotation}
            type="number"
            InputProps={{
              inputProps: {
                max: 360,
                min: 0,
              },
            }}
          />

          <TextField
            onChange={(event) => handleFormUpdates(event)}
            variant="outlined"
            id="cellSize"
            label="Cell Size (m^2)"
            defaultValue={formValues.cellSize}
            type="number"
            InputProps={{
              inputProps: {
                max: 1000,
                min: 1,
              },
            }}
          />
        </Stack>
      </ListItem>
      <ListItem>
        <TextField
          size="small"
          onChange={(event) => handleFormUpdates(event)}
          variant="outlined"
          id="projection"
          label="Projection"
          defaultValue={formValues.projection}
          type="string"
          helperText="Default projection should work for most CityScope cases. Find specific projections at: https://epsg.io/"
        />
      </ListItem>
    </List>
  );
}
