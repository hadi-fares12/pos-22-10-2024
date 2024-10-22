import { Box, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const InvDet = ({ companyName, selectedInv, url, selectedInvType }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);
  const [inv, setInv] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [invDet, setInvDet] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    fetch(`${url}/pos/getInvHistoryDetails/${companyName}/${selectedInv}`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure that data is an object with the 'initialState' property
        if (Array.isArray(data)) {
          setInvDet(data);
        } else {
          console.error("Invalid data format received:", data);
        }
      })
      .catch((error) => console.error("Error fetching users", error));
  }, []);

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const columns = [
    {
      field: "ItemName",
      headerName: t["ItemName"],
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    // {
    //   field: "GroupName",
    //   headerName: t["GroupName"],
    //   headerAlign: "left",
    //   align: "left",
    //   minWidth: 100,
    //   renderCell: renderTextCell,
    //   headerClassName: "header-cell", // Apply the custom style to the header
    //   flex: "1",
    // },

    {
      field: "Disc",
      headerName: t["Disc"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "Tax",
      headerName: t["Tax"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "UPrice",
      headerName: t["UPrice"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "Qty",
      headerName: t["Qty"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "Date",
      headerName: t["Date"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "Time",
      headerName: t["Time"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "RealDate",
      headerName: t["RealDate"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },
    {
      field: "totalItem",
      headerName: t["Total"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box>
        <Header title={`${selectedInvType} ${selectedInv}`} />
      </Box>
      <DatagridTable
        rows={invDet.map((row, index) => ({ ...row, id: index }))}
        columns={columns}
        getRowId={(row) => row.id}
      />
    </Box>
  );
};

export default InvDet;
