import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TableContainer from "@mui/material/TableContainer";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { handleSave } from "./SaveHandler.jsx";
import { useLanguage } from "../LanguageContext.js";
import translations from "../translations.js";

const GroupDetails = ({
  groupDetails,
  setGroupDetails,
  groups,
  setGroups,
  companyName,
  successMessage,
  setSuccessMessage,
  groupDetailsCopy,
  setGroupDetailsCopy,
  setOldItemNo,
  setNewItemNo,
  unsavedChanges,
  setUnsavedChanges,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard,tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const tableContainerStyle = {
    height: "80%",
    width: "100%",
  };

  const handleValueUpdate = (field, updatedValue) => {
    if (field === "GroupName" || field === "GroupNo") {
      setGroupDetailsCopy((prev) => ({
        ...prev,
        [field]: updatedValue,
      }));
      setTickKey(false);
    } else if (field === "Image") {
      const file = updatedValue.target.files[0];
      setGroupDetailsCopy((prev) => ({
        ...prev,
        [field]: file.name,
      }));
    }
  };

  useEffect(() => {
    if (tickKey) {
      handleValueUpdate(activeField, inputValue);
    }
  }, [tickKey]);
  
  useEffect(() => {
    if (JSON.stringify(groupDetailsCopy) !== JSON.stringify(groupDetails)) {
      setUnsavedChanges(true);
    } else {
      setUnsavedChanges(false);
    }
  }, [groupDetailsCopy, groupDetails, unsavedChanges]);

  return (
    <Box style={{ height: "100%", width: "100%" }}>
      <style>
        {`
          #file-input {
            display: none;
          }
        `}
      </style>
      <TableContainer style={tableContainerStyle}>
        <Table>
          <TableBody
            style={{
              display: "block",
              gap: "5px",
            }}
          >
            <TableRow>
              <TableCell>
                <Box>
                  <Typography variant="h4">{t["GroupNo"]}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <TextField
                  value={groupDetailsCopy.GroupNo}
                  onChange={(e) => handleValueUpdate("GroupNo", e.target.value)}
                  fullWidth
                  size="small"
                  variant="outlined"
                  inputProps={{
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                    readOnly: true,
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Box>
                  <Typography variant="h4">{t["GroupName"]}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <TextField
                  value={groupDetailsCopy.GroupName}
                  onChange={(e) =>
                    handleValueUpdate("GroupName", e.target.value)
                  }
                  fullWidth
                  size="small"
                  variant="outlined"
                  onDoubleClick={() => {
                    setInputValue("");
                    setShowKeyboard(true);
                  }}
                  onFocus={() => {
                    setActiveField("GroupName");
                  }}
                />
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Box>
                  <Typography variant="h4">{t["Image"]}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <div>
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => handleValueUpdate("Image", e)}
                    id="inputFile"
                  />
                  {/* Render the value only if it's a string */}
                  {typeof groupDetailsCopy.Image === "string" && (
                    <Typography variant="h4">
                      {groupDetailsCopy.Image}
                    </Typography>
                  )}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          heigh: "20%",
          width: "90%",
          justifyContent: "space-between",
          display: "flex",
          flexDirection: "row",
        }}
      >
        {successMessage && (
          <Box sx={{ width: "95%", marginTop: "auto" }}>
            <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
              {successMessage}
            </Typography>
          </Box>
        )}
        {unsavedChanges && (
          <Box sx={{ width: "5%", marginLeft: "auto", marginTop: "auto" }}>
            <Button
              variant="contained"
              color="secondary"
              style={{
                //background: colors.greenAccent[600],
                fontSize: "1.1rem",
              }}
              onClick={() =>
                handleSave(
                  companyName,
                  groupDetails,
                  groupDetailsCopy,
                  setSuccessMessage,
                  setGroupDetails,
                  setOldItemNo,
                  setNewItemNo,
                  url
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
};

export default GroupDetails;
