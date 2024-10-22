import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Select, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Checkbox from "@mui/material/Checkbox";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { MenuItem } from "@mui/material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
const StatSet = ({ companyName, url }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [stationDetails, setStationDetails] = useState({});
  const [stationDetailsCopy, setStationDetailsCopy] = useState({
    ...stationDetails,
  });
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const reportOptions = ["Report 1", "Report 2", "Report 3"]; // Example report options
  const [errorMess, setErrorMess] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const handleValueUpdate = (field, updatedValue) => {
    if (field === "QtyPrintInv" || field === "QtyPrintKT") {
      if (isNaN(updatedValue)) {
        setErrorMess("Only Numbers");
        setTimeout(() => {
          setErrorMess("");
        }, 2000);
        return; // Stop execution if updatedValue is not a number
      }
    }
     setErrorMess("");
    // Update stationDetailsCopy state
    setStationDetailsCopy((prev) => ({
      ...prev,
      [field]: updatedValue,
    }));
  };


  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        const response = await fetch(
          `${url}/pos/station/${companyName}`
        );
        if (response.ok) {
          const data = await response.json();
          setStationDetails(data);
          setStationDetailsCopy(data);
        } else {
          console.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    fetchStationDetails();
  }, []);

  const handleSave = async () => {
    const saveResponse = await fetch(
      `${url}/pos/updateStation/${companyName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stationDetailsCopy),
      }
    );
    console.log("wwwwwwwwwwwwww", stationDetailsCopy);
    const mesData = await saveResponse.json();

    if (saveResponse.ok) {
      setStationDetails(stationDetailsCopy);
      setSuccessMessage(mesData.message);
    }
  };
  useEffect(() => {
    if (JSON.stringify(stationDetailsCopy) !== JSON.stringify(stationDetails)) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [stationDetailsCopy]);
  console.log("uppppppppppppppppppppp", stationDetails);
  console.log("copppppppp", stationDetailsCopy);
  const rows = Object.keys(stationDetailsCopy).map((key, index) => (
    <TableRow
      key={key}
      style={{
        //width: window.innerWidth * 0.28,
        display: "flex",
        flexDirection: "row",
        //height: window.innerHeight * 0.1,
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    >
      <TableCell
        style={{
          width: "30%",
          height: "100%",
          whiteSpace: "pre-wrap",
          overflowWrap: "normal",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            maxHeight: "100%",
            width: "100%",
            alignItems: "start",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">{t[key]}</Typography>
        </Box>
      </TableCell>

      <TableCell
        style={{
          width: "70%",
          height: "100%",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "100%",
            width: "100%",
          }}
        >
          {key === "AllowPrintInv" || key === "AllowPrintKT" ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={stationDetailsCopy[key] === "Y"}
                  onChange={() =>
                    handleValueUpdate(
                      key,
                      stationDetailsCopy[key] === "Y" ? "N" : "Y"
                    )
                  }
                />
                <Typography variant="h4">Y</Typography>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={stationDetailsCopy[key] === "N"}
                  onChange={() =>
                    handleValueUpdate(
                      key,
                      stationDetailsCopy[key] === "N" ? "Y" : "N"
                    )
                  }
                />
                <Typography variant="h4">N</Typography>
              </div>
            </div>
          ) : key === "ReceiptName" ? (
            <Select
              value={stationDetailsCopy[key]}
              onChange={(e) => handleValueUpdate(key, e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            >
              {reportOptions.map((report, index) => (
                <MenuItem key={index} value={report}>
                  {report}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <TextField
              value={stationDetailsCopy[key]}
              onChange={(e) => handleValueUpdate(key, e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <Box style={{ height: "100%" }}>
      <TableContainer style={{ height: "90%", overflowY: "auto" }}>
        <Table>
          <TableBody>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)", // Adjust the number of columns
                gap: "5px",
              }}
            >
              {rows}
            </Box>
          </TableBody>
        </Table>
      </TableContainer>
      {errorMess && (
        <Typography variant="h3" style={{ color: colors.redAccent[500] }}>
          {errorMess}
        </Typography>
      )}

      {successMessage ? (
        <Box
          sx={{
            minHeight: "10%",
            width: "auto",
            justifyContent: "space-between",
            display: "flex",
            alignItems: "center", // Add this line to center vertically
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
              {successMessage}
            </Typography>
          </Box>
          {unsavedChanges && (
            <Box sx={{ minWidth: "5%" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  //background: colors.greenAccent[600],
                  fontSize: "1.1rem",
                }}
                onClick={handleSave}
              >
                 {t["save"]}
              </Button>
            </Box>
          )}
        </Box>
      ) : (
        unsavedChanges && (
          <Box sx={{ width: "10%", marginTop: 2, marginLeft: "auto" }}>
            <Button
              style={{
                fontSize: "1.1rem",
              }}
              variant="contained"
              color="secondary"
              onClick={handleSave}
            >
              {t["save"]}
            </Button>
          </Box>
        )
      )}
    </Box>
  );
};

export default StatSet;
