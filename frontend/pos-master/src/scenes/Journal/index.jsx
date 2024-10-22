import { Box, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import InvDetailsModal from "./InvDetailsModal";
import { format } from "path-browserify";
import { format as dateFnsFormat } from "date-fns";
import InvTotalDialog from "../InvTotalDialog";
import DatagridTable from "../DatagridTable";
import InvKindDialog from "../InvKindDialog";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import "jspdf-autotable";
import jsPDF from "jspdf";

const Journal = ({ companyName, url}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);
  const [inv, setInv] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [openInvDetailsModal, setOpenIvDetailsModal] = useState(false);
  const [selectedInv, setSelectedInv] = useState("");
  const [grossTotal, setGrossTotal] = useState("");
  const [totalQty, setTotalQty] = useState("");
  const [srvValue, setSrvValue] = useState("");
  const [discValue, setDiscValue] = useState("");
  const [totalDiscount, setTotalDiscount] = useState("");
  const [totalTax, setTotalTax] = useState("");
  const [selectedInvType, setSelectedInvType] = useState("");
  const [srv, setSrv] = useState("");
  const [disc, setDisc] = useState("");
  const [totalInv, setTotalInv] = useState("");
  const [openTotalDetail, setOpenTotalDetail] = useState(false);
  const [formattedStartDate, setFormattedStartDate] = useState("");
  const [formattedEndDate, setFormattedEndDate] = useState("");
  const [formattedStartTime, setFormattedStartTime] = useState("");
  const [formattedEndTime, setFormattedEndTime] = useState("");
  const [countDelivery, setCountDelivery] = useState("");
  const [countTable, setCountTable] = useState("");
  const [countTakeaway, setCountTakeaway] = useState("");
  const [openInvKind, setOpenInvKind] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];
  const [branchData, setBranchData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [invTypeData, setInvTypeData] = useState([]);
  const [selectedOptionBranch, setSelectedOptionBranch] = useState("Branches");
  const [selectedOptionUser, setSelectedOptionUser] = useState("Users");
  const [selectedOptionSA, setSelectedOptionSA] = useState("InvType");
  const [vat, setVat] = useState("");

  const handleBranchUpdate = (updatedValue) => {
    setSelectedOptionBranch(updatedValue);
  }
  
  const handleUserUpdate = (updatedValue) => {
    setSelectedOptionUser(updatedValue)
  }

  const handleSAUpdate = (updatedValue) => {
    setSelectedOptionSA(updatedValue);
  };

  const handleDoubleClickInvKind = () => {
    setOpenInvKind(true);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setFormattedStartDate(date.format("DD/MM/YYYY"));
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    setFormattedEndDate(date.format("DD/MM/YYYY"));
  };

  const handleStartTimeChange = (time) => {
    setStartTime(time);
    setFormattedStartTime(time.format("HH:mm"));
  };

  const handleEndTimeChange = (time) => {
    setEndTime(time);
    setFormattedEndTime(time.format("HH:mm"));
  };

  const handleRowClick = (params) => {
    setOpenIvDetailsModal(true);
    setSelectedInv(params.row.InvNo); 
    setSelectedInvType(params.row.InvType)
  };

  useEffect(() => {
    const fetchBUS = async () => {
      const branchResponse = await fetch(
            `${url}/pos/branch/${companyName}`
      );
      if (branchResponse.ok) {
        const br = await branchResponse.json();
        setBranchData(br);
      }

      const userResponse = await fetch(`${url}/pos/users/${companyName}`);
      if (userResponse.ok) {
        const user = await userResponse.json();
        setUsersData(user);
      }

      const invType = await fetch(`${url}/pos/distInvType/${companyName}`)
      if (invType.ok) {
        const invT = await invType.json();
        setInvTypeData(invT);
      }

    }
    fetchBUS();
  },[]);

  useEffect(() => {
    const currentDate = new Date();
    const formattedTime = dateFnsFormat(currentDate, "HH:mm:ss");
    const formattedDate = dateFnsFormat(currentDate, "dd/MM/yyyy");
    const fetchHisFiltered = async () => {
      const requestBody = {
        currDate: formattedDate,
        currTime: formattedTime,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        selectedOptionBranch: selectedOptionBranch,
        selectedOptionUser: selectedOptionUser,
        selectedOptionSA: selectedOptionSA
      };
      const invKind = await fetch(`${url}/pos/getInvKind/${companyName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (invKind.ok) {
        const invKindResponse = await invKind.json();

        let countDelivery = 0;
        let countTakeaway = 0;
        let countTable = 0;

        invKindResponse.forEach((item) => {
          switch (item.InvKind) {
            case "DELIVERY":
              countDelivery = item.TotalInvoices;
              break;
            case "TAKEAWAY":
              countTakeaway = item.TotalInvoices;
              break;
            case "TABLE":
              countTable = item.TotalInvoices;
              break;
            default:
              break;
          }
        });

        setCountDelivery(countDelivery);
        setCountTakeaway(countTakeaway);
        setCountTable(countTable);
      }
      const response = await fetch(`${url}/pos/filterInvHis/${companyName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const filteredData = await response.json();
        setTotalInv(calculateTotalFinal(filteredData));
        setFilteredData(filteredData);
        setGrossTotal(calculateGrossTotal(filteredData));
        setTotalQty(calculateTotalQty(filteredData));
        setSrvValue(calculateSrvValue(filteredData));
        setDiscValue(calculateDiscValue(filteredData));
        setTotalDiscount(calculateTotalDiscount(filteredData));
        setTotalTax(calculateTotalTax(filteredData));
        setDisc(calculateTotalDisc(filteredData));
        setSrv(calculateTotalSrv(filteredData));
      }
    }
      fetchHisFiltered(); //setFilteredData(filtered);
    
  }, [startDate, endDate, startTime, endTime, selectedOptionBranch, selectedOptionSA, selectedOptionUser]);

  const handleDownloadPDF = () => {
    // Initialize jsPDF
    const doc = new jsPDF();

    // Define columns for the table
    const columns = [
      { header: "User", dataKey: "User" },
      { header: "Invoice Type", dataKey: "InvType" },
      { header: "Invoice Number", dataKey: "InvNo" },
      { header: "Branch", dataKey: "Branch" },
      { header: "Disc", dataKey: "Disc" },
      { header: "Date", dataKey: "Date" },
      { header: "Real Date", dataKey: "RealDate" },
      { header: "Time", dataKey: "Time" },
      { header: "Total", dataKey: "totalFinal" },
    ];

    // Extract data from filteredData state
    const data = filteredData.map((item) => ({
      User: item.User,
      InvType: item.InvType,
      InvNo: item.InvNo,
      Branch: item.Branch,
      Disc: item.Disc,
      Date: item.Date,
      RealDate: item.RealDate,
      Time: item.Time,
      //GrossTotal: item.GrossTotal.toFixed(3),
      //TotalQty: item.TotalQty,
      Srv: item.Srv,
      Disc: item.Disc,
      //TotalDiscount: item.TotalDiscount.toFixed(3),
      //TotalTax: item.TotalTax.toFixed(3),
      totalFinal: Number(item.totalFinal).toFixed(3),
    }));

    // Set title and styling for the PDF document
    const title = `Filtered Invoice History (${formattedStartDate} - ${formattedEndDate})`;
    doc.setFontSize(20);
    doc.text(title, 14, 20);

    // Generate PDF table using autoTable plugin
    doc.autoTable({
      columns,
      body: data,
      startY: 30, // Position from top (y-axis)
    });

    // Save the PDF file
    doc.save(
      `Filtered_Invoice_History_${formattedStartDate}_${formattedEndDate}.pdf`
    );
  };

  const renderTotalFinalCell = (params) => {
    const value = parseFloat(params.value);
    return (
      <Typography>{!isNaN(value) ? value.toFixed(3) : params.value}</Typography>
    );
  };

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
  };
  const calculateTotalTax = (data) => {
    return data.reduce((sum, item) => sum + item.totalTax, 0);
  };

  const calculateTotalDisc = (data) => {
    return data.reduce((sum, item) => sum + item.Disc, 0);
  };
  const calculateTotalSrv = (data) => {
    return data.reduce((sum, item) => sum + item.Srv, 0);
  };


  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const handleDoubleClick = () => {
    setOpenTotalDetail(true);
  };

  const columns = [
    {
      field: "User",
      headerName: t["User"],
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    {
      field: "InvType",
      headerName: t["InvType"],
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    {
      field: "InvNo",
      headerName: t["InvNo"],
      cellClassName: "name-column--cell",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 100,
      flex: "1",
    },

    {
      field: "Branch",
      headerName: t["Branch"],
      headerAlign: "left",
      align: "left",
      minWidth: 150,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
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
      field: "Srv",
      headerName: "Srv",
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
      minWidth: 100,
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
      minWidth: 100,
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
      field: "totalFinal",
      headerName: t["Total"],
      //flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 100,
      renderCell: renderTotalFinalCell,
      headerClassName: "header-cell",
    },
  ];

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        flexDirection: "column",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          height: "16%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          //width: "100%",
        }}
      >
        <Header sx={{ width: "15%" }} title={t["Invoices History"]} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "15%",
            justifyContent: "space-around",
            height: "100%",
          }}
        >
          <Button
            component="h1"
            variant="contained"
            color="secondary"
            style={{ fontSize: "1.1rem" }}
            onDoubleClick={handleDoubleClick}
          >
            {/* Total &nbsp;&nbsp; */}
            {Number(totalInv).toFixed(3)}
          </Button>
          <Button
            component="h1"
            variant="contained"
            color="secondary"
            style={{ fontSize: "1.1rem" }}
            onDoubleClick={handleDoubleClickInvKind}
          >
            InvKind
          </Button>
        </Box>

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
        <InvKindDialog
          openInvKind={openInvKind}
          countDelivery={countDelivery}
          countTable={countTable}
          countTakeaway={countTakeaway}
          setOpenInvKind={setOpenInvKind}
        ></InvKindDialog>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "30%",
              height: "100%",
              alignContent: "space-around",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100%",
              }}
            >
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={handleStartDateChange}
                format="DD/MM/YYYY"
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={handleEndDateChange}
                format="DD/MM/YYYY"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
                height: "100%",
              }}
            >
              <TimePicker
                // sx={{ width: "15%" }}
                label="Start Time"
                value={startDate}
                onChange={handleStartTimeChange}
              />
              <TimePicker
                //  sx={{ width: "15%" }}
                label="End Time"
                value={endDate}
                onChange={handleEndTimeChange}
              />
            </Box>
          </Box>
        </LocalizationProvider>
        <Box sx={{ display: "flex", flexDirection: "column", width: "15%", }}>
          <Select
            value={selectedOptionBranch}
            onChange={(e) => handleBranchUpdate(e.target.value)}
          >
            <MenuItem value="Branches">{t["Branches"]}</MenuItem>

            {branchData.map((branch) => (
              <MenuItem key={branch.Code} value={branch.Code}>
                {branch.Description}
              </MenuItem>
            ))}
          </Select>
          <Select
            value={selectedOptionUser}
            onChange={(e) => handleUserUpdate(e.target.value)}
          >
            <MenuItem value="Users">{t["Users"]}</MenuItem>
            {usersData.map((user) => (
              <MenuItem key={user.id} value={user.username}>
                {user.username}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "15%",
            justifyContent: "space-around",
            height: "100%",
          }}
        >
          <Select
            value={selectedOptionSA}
            onChange={(e) => handleSAUpdate(e.target.value)}
          >
            <MenuItem value="InvType">InvType</MenuItem>
            {invTypeData.map((sa) => (
              <MenuItem key={sa.SAType} value={sa.SAType}>
                {sa.SAType}
              </MenuItem>
            ))}
          </Select>
          <Button
            component="h1"
            variant="contained"
            color="secondary"
            style={{ fontSize: "1.1rem" }}
            onClick={handleDownloadPDF}
          >
           {t["Print"]}
          </Button>
        </Box>
      </Box>
      <DatagridTable
        handleRowClick={handleRowClick}
        rows={filteredData}
        columns={columns}
        getRowId={(row) => row.InvNo}
      ></DatagridTable>
      <InvDetailsModal
        isOpen={openInvDetailsModal}
        setOpenIvDetailsModal={setOpenIvDetailsModal}
        companyName={companyName}
        setSelectedInv={setSelectedInv}
        selectedInv={selectedInv}
        url={url}
        selectedInvType={selectedInvType}
      />
    </Box>
  );
};

export default Journal;
