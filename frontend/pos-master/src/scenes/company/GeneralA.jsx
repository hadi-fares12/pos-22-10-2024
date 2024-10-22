import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Checkbox from "@mui/material/Checkbox";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  Select,
  MenuItem,
} from "@mui/material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const GeneralA = ({ companyName, url, activeField, setActiveField, showKeyboard, setShowKeyboard, companyDetails, setCompanyDetails, companyDetailsCopy, setCompanyDetailsCopy, error, setError}) => {
  
  const [successMessage, setSuccessMessage] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [curr, setCurr] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  const handleValueUpdate = (field, updatedValue) => {
    if (field === "EndTime") {
      const date = new Date(updatedValue);

      // Get the hours, minutes, and seconds from the date object
      const hours = date.getHours().toString().padStart(2, "0"); // Ensure 2-digit format
      const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2-digit format
      const seconds = date.getSeconds().toString().padStart(2, "0"); // Ensure 2-digit format

      // Construct the time string in "HH:mm:ss" format
      const timeString = `${hours}:${minutes}:${seconds}`;
      setCompanyDetailsCopy((prev) => ({
        ...prev,
        [field]: timeString,
      }));
    } else if (field === "FromDate" || field === "ToDate") {
        // Handle date fields
        setCompanyDetailsCopy((prev) => ({
          ...prev,
          [field]: updatedValue ? updatedValue.format('YYYY-MM-DD') : '',
        }));
    } else if (field === "Phone" || field === "Rate" || field === "VAT") {
      if (!isNaN(updatedValue)) {
        setCompanyDetailsCopy((prev) => ({
          ...prev,
          [field]: updatedValue,
        }));
        setError("");
      } else {
        setError(`${field} must be a number.`);
      }
    } else {
      setCompanyDetailsCopy((prev) => ({
        ...prev,
        [field]: updatedValue,
      }));
    }
  };

  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => {
        setError("");
      }, 2000); // Adjust the duration as needed (in milliseconds)
      return () => clearTimeout(timeout);
    }
  }, [error]);


  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await fetch(
          `${url}/pos/company/${companyName}`
        );
        if (response.ok) {
          const data = await response.json();
          setCompanyDetails(data.compOb);
          setCompanyDetailsCopy(data.compOb);
          setCurr(data.curOb)
        } else {
          console.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    fetchCompanyDetails();
  }, []);

  const handleSave = async () => {
    console.log("ccompaaaaaaaaaaaaaaaa", companyDetailsCopy);
    const saveResponse = await fetch(
      `${url}/pos/updateCompany/${companyName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language
        },
        body: JSON.stringify(companyDetailsCopy),
      }
    );
    const mesData = await saveResponse.json();

    if (saveResponse.ok) {
      setCompanyDetails(companyDetailsCopy);
      setSuccessMessage(mesData.message);
    }
  };
  useEffect(() => {
    if (JSON.stringify(companyDetailsCopy) !== JSON.stringify(companyDetails)) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [companyDetailsCopy]);
  const rows = Object.keys(companyDetailsCopy).map((key, index) => (
    <TableRow
      key={key}
      style={{
        //width: window.innerWidth * 0.28,
        display: "flex",
        flexDirection: "row",
        // height: window.innerHeight * 0.1,
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
          <Typography variant="h4">
            {translations[language][key] || key}
          </Typography>
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
          {key === "EndTime" ? (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                value={dayjs(`0000-00-00T${companyDetailsCopy[key]}`)}
                onChange={(newValue) => handleValueUpdate(key, newValue)}
                size="small"
                renderInput={(params) => <TextField size="small" {...params} />}
              />
            </LocalizationProvider>
             ) : key === "FromDate" || key === "ToDate" ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={dayjs(companyDetailsCopy[key])}
                  onChange={(newValue) => handleValueUpdate(key, newValue)}
                  renderInput={(params) => (
                    <TextField size="small" {...params} />
                  )}
                />
              </LocalizationProvider>
          ) : key == "Currency" ? (
            <Select
              value={companyDetailsCopy[key]}
              onChange={(e) => handleValueUpdate(key, e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
            >
              {curr.map((cur) => (
                <MenuItem key={cur.id} value={cur.id}>
                  {cur.name}
                </MenuItem>
              ))}
            </Select>
          ) : key === "Pay" ? (
            <Box
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
              }}
            >
              <Box style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={companyDetailsCopy[key]==="Y"}
                  onChange={() =>
                    handleValueUpdate(
                      key,
                      companyDetailsCopy[key] === "Y" ? "N" : "Y"
                    )
                  }
                />
                <Typography variant="h4">Y</Typography>
              </Box>

              <Box style={{ display: "flex", alignItems: "center" }}>
                <Checkbox
                  checked={companyDetailsCopy[key] ==="N"}
                  onChange={() =>
                    handleValueUpdate(
                      key,
                      companyDetailsCopy[key] === "N" ? "Y" : "N"
                    )
                  }
                />
                <Typography variant="h4">N</Typography>
              </Box>
            </Box>
          ) : (
            <TextField
              value={companyDetailsCopy[key]}
              onChange={(e) => handleValueUpdate(key, e.target.value)}
              fullWidth
              variant="outlined"
              size="small"
              onDoubleClick={() => {
                setShowKeyboard(true);
              }}
              onFocus={() => {
                setActiveField(key);
              }}
            />
          )}
        </div>
      </TableCell>
    </TableRow>
  ));

  return (
    <Box style={{ height: "100%" }}>
      <TableContainer style={{ height: "80%", overflowY: "auto" }}>
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
      {error && (
        <Box sx={{ height: "10%",}}>
          <Typography variant="h1" color="red">{error}</Typography>
        </Box>
      )}
      <Box
        sx={{
          minHeight: "10%",
          width: "100%",
          display: "flex",
          alignItems: "center", // Center vertically
        }}
      >
        <Box sx={{ width: "90%" }}>
          {successMessage && (
            <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
              {successMessage}
            </Typography>
          )}
        </Box>
        {unsavedChanges && (
          <Box sx={{ width: "10%" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: "1.1rem" }}
              onClick={handleSave}
            >
              {t["save"]}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

};

export default GeneralA;
