import React, { useState, useEffect } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { format } from "date-fns";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const COHDetails = ({
  open,
  companyName,
  url,
  setOpenCOHDetails,
  selectedItem,
  selectedInvType,
}) => {
  const [COH, setCOH] = useState([]);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    height: "95%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 2,
  };

  useEffect(() => {
    const fetchCOHDetails = async () => {
      try {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "dd.MM.yyyy");
        const response = await fetch(
          `${url}/pos/COHDetails/${companyName}/${formattedDate}/${selectedItem}`
        );
        const data = await response.json();
        const COHWithIds = data.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
        setCOH(COHWithIds);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (open) {
      fetchCOHDetails();
    }
  }, [open]);

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const handleClose = () => {
    setOpenCOHDetails(false);
  };
  const columns = [
    {
      field: "User",
      headerName: t["User"],
      minWidth: 150,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
      flex: 1,
    },
    {
      field: "ItemNo",
      headerName: t["ItemNo"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "ItemName",
      headerName: t["ItemName"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 300,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "Qty",
      headerName: t["Qty"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "UPrice",
      headerName: t["UPrice"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "Disc",
      headerName: t["Disc"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "Tax",
      headerName: t["Tax"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
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
    <Modal open={open}>
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h3" style={{ fontWeight: "1.1rem" }}>
              {selectedInvType} {selectedItem}
            </Typography>
          </Box>
          <Typography variant="h3" style={{ fontWeight: "1.1rem" }}>
            {}
          </Typography>
          <Box>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            height: "90%",
            width: "100%",
            "& .css-zylse7-MuiButtonBase-root-MuiIconButton-root.Mui-disabled":
              {
                backgroundColor: colors.greenAccent[500],
                width: "100px",
                color: colors.primary[500],
                margin: "2px",
              },
            "& .css-smjw5k-MuiTablePagination-displayedRows": {
              fontSize: "1rem",
            },
            "& .css-rtrcn9-MuiTablePagination-root .MuiTablePagination-selectLabel":
              {
                fontSize: "1rem",
              },
            "& .css-rtrcn9-MuiTablePagination-root .MuiTablePagination-input": {
              fontSize: "1rem",
            },
            "& .MuiDataGrid-columnHeaders": {
              //backgroundColor: colors.greenAccent[500],
              //color: colors.primary[500],
              //borderBottom: "none",
              fontSize: "900",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              fontSize: "20px",
            },
          }}
        >
          <DataGrid
            rows={COH}
            columns={columns}
        
            initialState={{
              ...COH.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 30]}
          />
        </Box>
      </Box>
    </Modal>
  );
};
export default COHDetails;