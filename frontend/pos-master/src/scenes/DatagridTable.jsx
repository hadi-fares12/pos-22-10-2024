import React, { useState, useEffect } from "react";
import {

  Box,

} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";


export default function DatagridTable(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  return (
    <Box
      sx={{
        height: (location.pathname.includes("/journal")) ? "82%" : "90%",
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .name-column--cell": {
          color: colors.greenAccent[300],
        },
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: colors.greenAccent[500],
          color: colors.primary[500],
          borderBottom: "none",
          fontSize: "900",
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.primary[500],
        },
        // "& .MuiDataGrid-footerContainer": {
        //   borderTop: "none",
        //   backgroundColor: colors.primary[500],
        //   color: colors.grey[800],
        // },
        "& .MuiDataGrid-columnHeaderTitle": {
          fontSize: "20px",
        },
        "& .css-zylse7-MuiButtonBase-root-MuiIconButton-root": {
          backgroundColor: colors.primary[500],
          width: "100px",
          color: colors.greenAccent[500],
          margin: "2px",
        },
        "& .css-smjw5k-MuiTablePagination-displayedRows": {
          fontSize: "1rem",
          color: colors.primary[500],
        },
        "& .MuiTablePagination-selectLabel": {
          fontSize: "1rem",
          color: colors.primary[500],
        },
        "& .MuiTablePagination-input": {
          fontSize: "1rem",
          color: colors.primary[500],
        },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.greenAccent[500],
          color: colors.primary[500],
        },
      }}
    >
      <DataGrid
        style={{ height: "100%" }}
        rows={props.rows}
        columns={props.columns}
        getRowId={props.getRowId}
        initialState={{
          ...props.rows.initialState,
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        pageSizeOptions={[10, 20, 30]}
        onRowClick={props.handleRowClick}
        // onRowClick={(params) => {
        //   console.log("Params:", params);
        //   handleRowClick(params);
        // }}
      />
    </Box>
  );
}
