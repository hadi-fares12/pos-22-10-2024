import React from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TextField,
  Checkbox,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import { handleSave } from "./SaveHandler";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function SalesCondition(props) {
  const { language } = useLanguage();
  const t = translations[language];
    const handleValueUpdate = (field, updatedValue) => {
      props.setUserDetailsCopy((prev) => ({
        ...prev,
        [field]: updatedValue,
      }));
    };

  useEffect(() => {
    // Set the callback function in the parent component
    if (
      JSON.stringify(props.userDetailsCopy) !==
      JSON.stringify(props.userDetails)
    ) {
      props.setUnsavedChanges(true);
    } else {
      props.setUnsavedChanges(false);
    }
  }, [props.userDetailsCopy, props.userDetails, props.unsavedChanges]);

  const relevantKeys = ["COH", "EOD","EndOfDayAccessUsers"];
  const filteredDetails = Object.entries(props.userDetailsCopy).filter(([key]) =>
    relevantKeys.includes(key)
  );
  const rows = filteredDetails.map(([key, value]) => (
    <TableRow
      key={key}
      style={{
        width: window.innerWidth * 0.28,
        display: "flex",
        flexDirection: "row",
        height: "100%",
        borderRadius: "4px",
        border: "1px solid #ccc",
      }}
    >
      <TableCell
        style={{
          width: "30%",
          height: "100%",
          whiteSpace: "pre-wrap", // Allow text wrapping
          overflowWrap: "normal", // Do not break words
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            maxHeight: "100%",
            width: "100%",
            alignItems: "start", // Align text to the start (left)
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
        {key === "EOD" ? (
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={value === "Y"}
                onChange={() =>
                  handleValueUpdate(key, value === "Y" ? "N" : "Y")
                }
              />
              <Typography variant="h4">Y</Typography>
            </Box>

            <Box style={{ display: "flex", alignItems: "center" }}>
              <Checkbox
                checked={value === "N"}
                onChange={() =>
                  handleValueUpdate(key, value === "N" ? "Y" : "N")
                }
              />
              <Typography variant="h4">N</Typography>
            </Box>
          </Box>
        ) : (
          <Select
            value={value}
            onChange={(e) => handleValueUpdate(key, e.target.value)}
            fullWidth
            variant="outlined"
            size="small"
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value={props.userDetails.username}>
              {props.userDetails.username}
            </MenuItem>
            {/* Add other options as needed */}
          </Select>
        )}
      </TableCell>
    </TableRow>
  ));

  return (
    <Box style={{ height: "100%" }}>
      <TableContainer style={{ height: "85%", overflowY: "auto" }}>
        <Table>
          <TableBody>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)", // Adjust the number of columns
                gap: "5px",
              }}
            >
              {rows}
            </Box>
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ height: "5%", marginTop: "auto" }}>
        {props.valMessage && (
          <Typography
            variant="body1"
            color="error"
            style={{
              fontSize: "1.1rem",
              fontWeight: "bold",
            }}
          >
            {props.valMessage}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          height: "10%",
          width: "100%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {props.successMessage && (
          <Box sx={{ width: "95%", marginTop: "auto" }}>
            <Typography variant="h3" style={{ color: "green" }}>
              {props.successMessage}
            </Typography>
          </Box>
        )}
        {props.unsavedChanges && (
          <Box sx={{ minWidth: "5%", marginLeft: "auto", marginTop: "auto" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{
                fontSize: "1.1rem",
              }}
              onClick={() =>
                handleSave(
                  props.companyName,
                  props.userDetails,
                  props.userDetailsCopy,
                  props.setUsers,
                  props.setSuccessMessage,
                  props.setUserDetails,
                  props.valMessage,
                  props.url
                )
              }
            >
              {t["save"]}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}
