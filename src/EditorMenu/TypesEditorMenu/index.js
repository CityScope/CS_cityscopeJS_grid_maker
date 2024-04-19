import * as React from "react";
import { useEffect } from "react";
import { Button, List, ListItem, Typography } from "@mui/material";
import { GridEditorSettings } from "../../settings/settings";
import { createTypesArray } from "./utils";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";

const settings = GridEditorSettings;

function EditToolbar(props) {
  const { setRows, rows } = props;

  const handleClick = () => {
    // copy the row above and add it to the end of the array
    const newRow = {
      ...rows[rows.length - 1],
      id: rows[rows.length - 1].id + 1,
      isNew: true,
    };
    setRows([...rows, newRow]);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Type
      </Button>
    </GridToolbarContainer>
  );
}

export default function TypesEditorMenu(props) {
  const setTypesTable = props.setTypesTable;
  const setSelectedType = props.setSelectedType;

  const [rows, setRows] = React.useState(
    createTypesArray(settings.GEOGRID.properties.types)
  );

  // whenever the rows change, update the typesTable in the parent component
  useEffect(() => {
    setTypesTable(rows);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows]);

  const [rowModesModel, setRowModesModel] = React.useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));

    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns = [
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
    {
      field: "name",
      headerName: "Type Name",
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      width: 100,
      editable: true,
    },
    {
      field: "interactive",
      headerName: "Interactive",
      type: "boolean",
      valueOptions: [true, false],
      editable: true,
    },
    {
      field: "color",
      headerName: "Color",
      type: "string",
      editable: true,
    },
    {
      field: "height[0]",
      headerName: "Height [0]",
      type: "number",
      editable: true,
    },
    {
      field: "height[1]",
      headerName: "Height [1]",
      type: "number",
      editable: true,
    },
    {
      field: "height[2]",
      headerName: "Height [2]",

      type: "number",
      editable: true,
    },

    {
      field: "LBCS",
      type: "string",
      editable: true,
    },
    {
      field: "NAICS",
      type: "string",
    },
  ];

  return (
    <List>
      <ListItem>
        <Typography variant="h4">Set Types Properties</Typography>
      </ListItem>
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowClick={(params) => {
          setSelectedType(params.row);
        }}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, rows },
        }}
      />
    </List>
  );
}
