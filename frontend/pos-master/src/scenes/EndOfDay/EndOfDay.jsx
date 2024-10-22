import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { height } from "@mui/system";
import { format } from "date-fns";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InvTotalDialog from "../InvTotalDialog";

const EndOfDay = ({
  open,
  onCancel,
  onConfirm,
  url,
  username,
  companyName, totalInv
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];
  // const [users, setUsers] = useState([]);
  const [users, setUsers] = useState(["All Users"]);
  const [selectedUser, setSelectedUser] = useState("All Users");
  const [openTotalDetail, setOpenTotalDetail] = useState(false);
  const [grossTotal, setGrossTotal] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [srvValue, setSrvValue] = useState("");
  const [discValue, setDiscValue] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [totalTax, setTotalTax] = useState("");
  const [srv, setSrv] = useState("");
  const [disc, setDisc] = useState("");
  const [totalUser, setTotalUser] = useState("");
  const [numInv, setNumInv] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [filterUser, setFilterUser] = useState([]);


  
  const handleDoubleClick = () => {
    setOpenTotalDetail(true);
  }
  


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


  
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const currentDate = new Date();
  //       const formattedDate = format(currentDate, "dd.MM.yyyy");
  //       const response = await fetch(
  //         `${url}/pos/eod/${companyName}/${formattedDate}`
  //       );
  //       const data = await response.json();
  //       setRows(data);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     }
  //   };

  //   if (open) {
  //     fetchData();
  //   }
  // }, [open]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentDate = new Date();
        const formattedDate = format(currentDate, "dd.MM.yyyy");
 
        // Fetch EndOfDayAccessUsers for the current user
        const accessResponse = await fetch(`${url}/pos/getEndOfDayAccessUsers/${companyName}/${username}`);
        const accessUsers = await accessResponse.json();
          
        const response = await fetch(`${url}/pos/eod/${companyName}/${formattedDate}`);
        const data = await response.json();
        setRows(data.eod_data);
        // setUsers(data.users);
         // Based on access users, set the users state
         if (accessUsers === 'All') {
          setUsers(data.users); // Show all users
        } else {
          setUsers(data.users.filter(user => user === accessUsers)); // Show specific user
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, companyName, url]);
  

  const filteredRows = selectedUser === "All Users"
    ? rows
    : rows.filter(row => row.User === selectedUser);

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };
  
  const columns = [
    {
      field: "User",
      headerName: t["User"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: 1,
    },
    {
      field: "InvType",
      headerName: t["InvType"],
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: 1,
    },
    {
      field: "InvNo",
      headerName: t["InvNo"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },

    {
      field: "Date",
      headerName: t["Date"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Time",
      headerName: t["Time"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Disc",
      headerName: t["Disc"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 50,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Srv",
      headerName: t["Srv"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 50,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Branch",
      headerName: t["Branch"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 150,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
  
    {
      field: "CashOnHand",
      headerName: t["COH"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
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
      <Box sx={{ height: "8%", display: 'flex', justifyContent: 'space-between', alignItems: 'center' ,"@media (max-width: 1200px)": {
    height: "10%", // Reduce font size for smaller screens
    
  },}}>
    <Typography variant="h3" component="h1" sx={{ fontWeight: "500" }}>
        {t["EndDay"]}
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
    <Box sx={{ width: "10%", marginLeft: "auto" }}>
    <Select
        value={selectedUser}
        onChange={(e) => setSelectedUser(e.target.value)}
        variant="outlined"
        sx={{ width: "100%", textAlign: "center" }}
    >
         {users.length > 1 && <MenuItem value="All Users">All Users</MenuItem>}
    {users.map((user, index) => (
      <MenuItem key={index} value={user}>{user}</MenuItem>
    ))}
    </Select>
    </Box>
</Box>

        {/* <Box sx={{ height: "8%" }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: "500" }}>
            {t["EndDay"]}
          </Typography>
        </Box>
        <Box sx={{ height: "8%", display: 'flex', alignItems: 'center' }}>
        <Select
    value={selectedUser}
    onChange={(e) => setSelectedUser(e.target.value)}
    variant="outlined"
>
    <MenuItem value="All Users">All Users</MenuItem>
    {users.map((user, index) => (
        <MenuItem key={index} value={user}>{user}</MenuItem>
    ))}
</Select>

        </Box> */}
        <Box sx={{ height: "82%", width: "100%" }}>
          <DataGrid
           rows={filteredRows}
            // rows={rows}
            columns={columns}
            getRowId={(row) => row.InvNo}
            initialState={{
              ...rows.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[10, 20, 30]}
            getRowClassName={getRowClassName}
            sx={{
              '& .highlight-row': {
                backgroundColor: '#ec6767 !important',
                color: 'white',
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            height: "8%",
            mt: "2%",
            "@media (max-width: 1200px)": {
             paddingBottom:'10px'
    
  },
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            // onClick={onConfirm}
            onClick={() => onConfirm(selectedUser)} // Pass selected user
            autoFocus
            style={{ fontSize: "0.9rem", marginRight: "8px" }}
          >
            {t["Yes"]}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={onCancel}
            style={{ fontSize: "0.9rem" }}
          >
            {t["No"]}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EndOfDay;
