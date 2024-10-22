import React, { useState, useEffect } from "react";
import {
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button, Box, Select, MenuItem, Grid
} from "@mui/material";
import Modal from "@mui/material/Modal";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { format } from "date-fns";
import COHDetails from "./COHDetails";
import InvTotalDialog from "../InvTotalDialog";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const CashConfirm = ({
  open,
  onCancel,
  onConfirm,
  url,
  username,
  companyName, selectedOption, setSelectedOption, totalInv, setTotalInv, allowedUser, setAllowedUser
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filterUser, setFilterUser] = useState([]);
  
  const [totalUser, setTotalUser] = useState("");
  const [numInv, setNumInv] = useState("");
  const [openCOHDetails, setOpenCOHDetails] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [openTotalDetail, setOpenTotalDetail] = useState(false);
  const [grossTotal, setGrossTotal] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [srvValue, setSrvValue] = useState("");
  const [discValue, setDiscValue] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [totalTax, setTotalTax] = useState("");
  const [selectedInvType, setSelectedInvType] = useState("");
  const [srv, setSrv] = useState("");
  const [disc, setDisc] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const handleDoubleClick = () => {
    setOpenTotalDetail(true);
  }
  

  const handleRowClick = (params) => {
    setOpenCOHDetails(true);
    setSelectedItem(params.row.InvNo);
    setSelectedInvType(params.row.InvType);
  };

  const handleChange = (event) => {
    const selectedUser = event.target.value;
    setSelectedOption(selectedUser);

    if (selectedUser === "All") {
      setRows(originalData); // Reset to full data if 'All' is selected
      setTotalInv(calculateTotalFinal(totalUser));
      setNumInv(calculateTotalNumber(totalUser));
      setTotalQty(calculateTotalQty(totalUser));
      setGrossTotal(calculateGrossTotal(totalUser));
      setSrvValue(calculateSrvValue(totalUser));
      setDiscValue(calculateDiscValue(totalUser));
      setTotalDiscount(calculateTotalDiscount(totalUser));
      setTotalTax(calculateTotalTax(totalUser));
      setDisc(calculateTotalDisc(totalUser));
      setSrv(calculateTotalSrv(totalUser));
    } else {
      const filteredData = originalData.filter(
        (item) => item.User === selectedUser
      );
      const userShift = totalUser.find((shift) => shift.User === selectedUser);
      setTotalInv(userShift ? userShift.totalFinal : 0);
      setRows(filteredData); // Filter data based on the selected user
      setNumInv(userShift ? userShift.TotalInvoices : 0);
      setGrossTotal(userShift ? userShift.GrossTotal : 0);
      setTotalQty(userShift ? userShift.TotalQty : 0);
      setSrvValue(userShift ? userShift.serviceValue : 0);
      setDiscValue(userShift ? userShift.discountValue : 0);
      setTotalDiscount(
        userShift ? userShift.TotalDiscount : 0
      );
      setTotalTax(userShift ? userShift.totalTax : 0);
      setSrv(userShift ? userShift.srv : 0);
      setDisc(userShift ? userShift.disc : 0);
    }
  };

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

  const currentDate = new Date();
  const formattedDate = format(currentDate, "dd.MM.yyyy");
  const disDate = format(currentDate, "dd/MM/yyyy")
  useEffect(() => {
    const fetchData = async () => {
      
      try {
        const getCOHRead = await fetch(`${url}/pos/getCOHRead/${companyName}/${username}`);
        const readResp = await getCOHRead.json();
        setAllowedUser(readResp);
        setSelectedOption(allowedUser);
         const calc = await fetch(
           `${url}/pos/calculateUserShifts/${companyName}/${formattedDate}/${allowedUser}`
         );
         const invoices = await calc.json();
         setTotalUser(invoices);
         setNumInv(calculateTotalNumber(invoices));
         setTotalInv(calculateTotalFinal(invoices));
         setGrossTotal(calculateGrossTotal(invoices));
         setTotalQty(calculateTotalQty(invoices));
         setSrvValue(calculateSrvValue(invoices));
         setDiscValue(calculateDiscValue(invoices));
         setTotalDiscount(calculateTotalDiscount(invoices));
         setTotalTax(calculateTotalTax(invoices));
         setDisc(calculateTotalDisc(invoices));
         setSrv(calculateTotalSrv(invoices));
         const response = await fetch(
           `${url}/pos/reportUserShift/${companyName}/${formattedDate}/${allowedUser}`
         );
         const data = await response.json();
         setRows(data);
         setOriginalData(data); 
         const uniqueUsers = [...new Set(data.map((item) => item.User))];
        if (allowedUser === "All") {
          setFilterUser(uniqueUsers);
        } else {

          const filteredUsers = uniqueUsers.filter((user) =>
            allowedUser.includes(user)
          );
          setFilterUser(filteredUsers);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, url, companyName, allowedUser]);

  const calculateTotalNumber = (data) => {
    return data.reduce((sum, item) => sum + item.TotalInvoices, 0);
  };
  const calculateTotalFinal = (data) => {
    return data.reduce((sum, item) => sum + item.totalFinal, 0);
  };
   const calculateGrossTotal = (data) => {
     return data.reduce((sum, item) => sum + item.GrossTotal, 0);
  };
   const calculateTotalQty = (data) => {
     return data.reduce((sum, item) => sum + item.TotalQty, 0);
  };
 
   const calculateTotalDiscount = (data) => {
     return data.reduce((sum, item) => sum + item.TotalDiscount, 0);
  };
   const calculateDiscValue = (data) => {
     return data.reduce((sum, item) => sum + item.discountValue, 0);
   };
  const calculateSrvValue = (data) => {
    return data.reduce((sum, item) => sum + item.serviceValue, 0);
  }
  const calculateTotalTax = (data) => {
    return data.reduce((sum, item) => sum + item.totalTax, 0);
  }
  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const calculateTotalDisc = (data) => {
    return data.reduce((sum, item) => sum + item.ee, 0);
  };
  const calculateTotalSrv = (data) => {
    return data.reduce((sum, item) => sum + item.dd, 0);
  };

  const renderTotalFinalCell = (params) => {
    const value = parseFloat(params.value);
    return (
      <Typography>{!isNaN(value) ? value.toFixed(3) : params.value}</Typography>
    );
  };
  

  const columns = [
    {
      field: "User",
      headerName: t["User"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
      flex: 1,
    },
    {
      field: "InvType",
      headerName: t["InvType"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
      flex: 1,
    },
    {
      field: "InvNo",
      headerName: t["InvNo"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "AccountNo",
      headerName: t["AccountNo"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "Date", 
      headerName: t["Date"], 
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "Time",
      headerName: t["Time"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell",
    },
    {
      field: "totalFinal",
      headerName: t["Total"],
      //flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTotalFinalCell,
      headerClassName: "header-cell",
    },
  ];
  const getRowClassName = (params) => {
    const currentDate = new Date(); // Get the current date 
    const formattedCurrentDate = format(currentDate, 'dd/MM/yyyy');
    // Compare dates in the same format
    return params.row.Date !== formattedCurrentDate ? 'highlight-row' : '';
  };

  return (
    <Modal open={open} onClose={onCancel}>
      <Box sx={style}>
        <COHDetails
          open={openCOHDetails}
          companyName={companyName}
          url={url}
          setOpenCOHDetails={setOpenCOHDetails}
          selectedItem={selectedItem}
          selectedInvType={selectedInvType}
        ></COHDetails>

        <Box
          sx={{
            height: "10%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            "@media (max-width: 1200px)": {
   height:'17%'
    
  },
          }}
        >
          <Box
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{ fontWeight: "500", width: "30%" }}
            >
              {t["EndShift"]}
            </Typography>
            <Box
              sx={{
                height: "80%",
                width: "20%",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Button
                variant="contained"
                color="secondary"
                onClick={onConfirm}
                autoFocus
                style={{
                  fontSize: "1.1rem",
                  marginRight: "10px",
                }}
              >
                {t["Yes"]}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={onCancel}
                style={{ fontSize: "1.1rem" }}
              >
                {t["No"]}
              </Button>
            </Box>
            <Typography variant="h3" component="h1" sx={{ fontWeight: "500" }}>
              {disDate}
            </Typography>
            <Button
              component="h1"
              variant="contained"
              color="secondary"
              style={{ fontSize: "1.1rem", height: "80%" }}
              onDoubleClick={handleDoubleClick}
            >
              {t["TotalInvoices"]}&nbsp;&nbsp;{Number(totalInv).toFixed(3)}
            </Button>
            <InvTotalDialog
              openTotalDetail={openTotalDetail}
              setOpenTotalDetail={setOpenTotalDetail}
              totalQty={totalQty}
              grossTotal={grossTotal}
              srv={srv}
              srvValue={srvValue}
              disc={disc}
              discValue={discValue}
              totalDiscount={totalDiscount}
              totalTax={totalTax}
              totalInv={totalInv}
            ></InvTotalDialog>
            {/* <Typography variant="h3" component="h1" sx={{ fontWeight: "500" }}>
              Total Number {numInv}
            </Typography> */}
          </Box>

          <Box sx={{ width: "10%", marginLeft: "auto" }}>
            <Select
              value={selectedOption}
              onChange={handleChange}
              sx={{ width: "100%", textAlign: "center","@media (max-width: 1200px)": {
    height:'100%'
    
  }, }}
            >
              {allowedUser === "All" && <MenuItem value="All">
                All
              </MenuItem>}
              {filterUser.map((user) => (
                <MenuItem key={user} value={user}>
                  {user}
                </MenuItem>
              ))}
            </Select>
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
            rows={rows}
            columns={columns}
            getRowId={(row) => row.InvNo}
            initialState={{
              ...rows.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 30]}
            onRowClick={(params) => {
              handleRowClick(params);
            }}
            getRowClassName={getRowClassName}
            sx={{
              '& .highlight-row': {
                backgroundColor: '#ec6767 !important',
                color: 'white',
              },
            }}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default CashConfirm;
