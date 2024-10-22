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
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

export default function BranchDetails(props) {
  const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  console.log("poppppp", props.branchDetailsCopy);
  const [err, setErr] = useState("");
  const [activeCode, setActiveCode] = useState("");
  const { language } = useLanguage();
  const t = translations[language];

  const [successMessage, setSuccessMessage] = useState("");

  const handleValueUpdate = (field, updatedValue, code) => {
    // Check if the code is a valid number
    if (field === "Code" && isNaN(updatedValue)) {
      setErr("Code should be a number");
      return;
    }

    // Check if the code is unique
    const isUniqueCode = props.branchDetailsCopy.every(
      (detail) => detail.Code === code || detail.Code !== updatedValue
    );
    if (!isUniqueCode) {
      setErr("Code must be unique");
      return;
    }

    // Update the branch details
    props.setBranchDetailsCopy((prev) => {
      const updatedDetails = prev.map((detail) => {
        if (detail.Code === code) {
          return {
            ...detail,
            [field]: updatedValue,
          };
        }
        return detail;
      });
      return updatedDetails;
    });

    setErr(""); // Clear any previous error messages
    props.setTickKey(false);

  };

  const handleSave = async () => {
    const saveResponse = await fetch(
      `${props.url}/pos/updateBranch/${props.companyName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language
        },
        body: JSON.stringify(props.branchDetailsCopy),
      }
    );
    const mesData = await saveResponse.json();

    if (saveResponse.ok) {
      props.setBranchDetails(props.branchDetailsCopy);
      setSuccessMessage(mesData.message);
    }
  };

  useEffect(() => {
    if (props.tickKey) {
      console.log("acccccccccccccc", activeCode);
        handleValueUpdate(props.activeField, props.inputValue, activeCode);
    }
  }, [props.tickKey]);

  useEffect(() => {
    if (
      JSON.stringify(props.branchDetailsCopy) !==
      JSON.stringify(props.branchDetails)
    ) {
      props.setUnsavedChanges(true);
    } else {
      props.setUnsavedChanges(false);
    }
  }, [props.branchDetailsCopy]);

  const rows = props.branchDetailsCopy.map((item, index) => (
    <TableRow key={item.Code}>
      <TableCell>
          <Typography variant="h4">{t["Code"]}</Typography>
          <TextField
            fullWidth
            value={item.Code}
            onChange={(e) =>
              handleValueUpdate("Code", e.target.value, item.Code)
            }
            onDoubleClick={() => {
              setActiveCode(item.Code);
              props.setInputValue("");
              props.setShowKeyboard(true);
            }}
            onFocus={() => {
              props.setActiveField("Code");
              setActiveCode(item.Code);
            }}
          />
      </TableCell>
      <TableCell>
          <Typography variant="h4">{t["Description"]}</Typography>
          <TextField
            fullWidth
            value={item.Description}
            onChange={(e) =>
              handleValueUpdate("Description", e.target.value, item.Code)
            }
            onDoubleClick={() => {
              setActiveCode(item.Code);
              props.setInputValue("");
              props.setShowKeyboard(true);
            }}
            onFocus={() => {
              props.setActiveField("Description");
              setActiveCode(item.Code);
            }}
          />
      </TableCell>
    </TableRow>
  ));
  return (
    <Box style={{ height: "100%" }}>
      <TableContainer style={{ height: "90%", overflowY: "auto" }}>
        <Table>
          <TableBody>{rows}</TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          minHeight: "10%",
          width: "100%",
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "90%" }}>
          {(successMessage || err )&& (
            <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
              {successMessage} {err}
            </Typography>
          )}
        </Box>
        {props.unsavedChanges && (
          <Box sx={{ width: "10%", marginLeft: "auto" }}>
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
}
