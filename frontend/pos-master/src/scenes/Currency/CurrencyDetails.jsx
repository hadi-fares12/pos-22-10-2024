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

export default function CurrencyDetails(props) {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const [successMessage, setSuccessMessage] = useState("");

  // Function to handle value update
  const handleValueUpdate = (index, field, updatedValue) => {
    props.setCurrencyDetailsCopy((prev) => {
      const updatedDetails = prev.map((detail, i) => {
        if (i === index) {
          // Create a new object to ensure immutability
          return {
            ...detail,
            [field]: updatedValue,
          };
        }
        return detail;
      });
      return updatedDetails;
    });
    props.setTickKey(false);
  };


  const handleSave = async () => {
    console.log("currency", JSON.stringify(props.currencyDetailsCopy));
    const saveResponse = await fetch(
      `${props.url}/pos/updateCurrency/${props.companyName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language
        },
        body: JSON.stringify(props.currencyDetailsCopy),
      }
    );
    const mesData = await saveResponse.json();

    if (saveResponse.ok) {
      props.setCurrencyDetails(props.currencyDetailsCopy);
      setSuccessMessage(mesData.message);
    }
  };

  useEffect(() => {
    if (props.tickKey) {
      const [field, index] = props.activeField.split("-");
      handleValueUpdate(parseInt(index, 10), field, props.inputValue);
  }  
  }, [props.tickKey]);

  useEffect(() => {
    if (
      JSON.stringify(props.currencyDetailsCopy) !==
      JSON.stringify(props.currencyDetails)
    ) {
      

      props.setUnsavedChanges(true);
    } else {
      
      props.setUnsavedChanges(false);
    }
  }, [props.currencyDetailsCopy]);

  const rows = props.currencyDetailsCopy.map(
    (detail, index) => (
      (
        <TableRow key={index}>
          <TableCell>
            <Typography variant="h4">{t["ID"]}{detail.id}</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="h4">{t["Name"]}</Typography>
          </TableCell>
          <TableCell>
            <Box sx={{ width: "300px" }}>
              <TextField
                fullWidth
                value={detail.name}
                onChange={(e) =>
                  handleValueUpdate(index, "name", e.target.value)
                }
                onDoubleClick={() => {
                  props.setInputValue("");
                  props.setShowKeyboard(true);
                }}
                onFocus={() => {
              props.setActiveField(`name-${index}`);
                }}
              />
            </Box>
          </TableCell>
          <TableCell>
            <Typography variant="h4">{t["Code"]}</Typography>
          </TableCell>
          <TableCell>
            <Box sx={{ width: "300px" }}>
              <TextField
                fullWidth
                value={detail.Code}
                onChange={(e) =>
                  handleValueUpdate(index, "Code", e.target.value)
                }
                onDoubleClick={() => {
                  props.setInputValue("");
                  props.setShowKeyboard(true);
                }}
                onFocus={() => {
              props.setActiveField(`Code-${index}`);
                }}
              />
            </Box>
          </TableCell>
        </TableRow>
      )
    )
  );

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
          {successMessage && (
            <Typography variant="h3" style={{ color: colors.greenAccent[500] }}>
              {successMessage}
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
