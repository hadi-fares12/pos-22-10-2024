import { useTheme, Typography, Box } from "@mui/material";
import { tokens } from "../../theme";
import DailySalesModal from "./DailySalesModal";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { format as dateFnsFormat } from "date-fns";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const DailySalesDetails = ({
  companyName,
  selectedItem,
  url,
  handleClose,
  selectedName,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [dailyDet, setDailyDet] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];


  const iconButtonStyle = {
    // Other styles...
    display: "flex",
    color: colors.greenAccent[500],
    ...(window.innerWidth < 650
      ? {
          position: "absolute",
          top: "8px",
          right: "8px",
        }
      : {
          position: "relative",
        }),
    marginLeft: "auto", // Push the button to the right
    // Other styles...
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedDate = dateFnsFormat(currentDate, "dd.MM.yyyy");
    fetch(
      `${url}/pos/getDailySalesDetails/${companyName}/${selectedItem}/${formattedDate}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Ensure that data is an object with the 'initialState' property

        if (Array.isArray(data)) {
          setDailyDet(data);
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
      field: "InvType",
      headerName: t["InvType"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    {
      field: "InvNo",
      headerName: t["InvNo"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    {
      field: "UPrice",
      headerName: t["UPrice"],
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 200,
      flex: "1",
    },
    {
      field: "Disc",
      headerName: t["Disc"],
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
    },
    {
      field: "Srv",
      headerName: "Srv",
      headerAlign: "left",
      align: "left",
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      minWidth: 200,
      flex: "1",
    },
    {
      field: "totalFinal",
      headerName: t["Total"],
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: "1",
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
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: "90%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <Header title={selectedName} />
        <IconButton color="inherit" onClick={handleClose} sx={iconButtonStyle}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DatagridTable
        rows={dailyDet.map((item, index) => ({
          id: index, // You need to provide a unique identifier for each row
          ...item, // Spread the original item properties
        }))}
        columns={columns}
      />
    </Box>
  );
};

export default DailySalesDetails;
