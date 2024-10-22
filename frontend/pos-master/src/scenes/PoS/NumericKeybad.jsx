import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const NumericKeypad = ({ open, onClose, onSubmit, type }) => {
  const [inputValue, setInputValue] = useState("");
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const handleButtonClick = (value) => {
    setInputValue((prevInput) => prevInput + value);
  };

  const handleClear = () => {
    setInputValue("");
  };

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  const handleOperator = (operator) => {
    setInputValue((prevInput) => prevInput + operator);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{type}</span>
        <IconButton onClick={onClose}>
          <ClearIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Number"
          variant="outlined"
          fullWidth
          value={inputValue}
          sx={{ margin: "10px 0", borderRadius: "20px" }}
        />
        <Grid container spacing={2}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((value) => (
            <Grid item xs={4} key={value}>
              <Button
                fullWidth
                onClick={() => handleButtonClick(value)}
                sx={{
                  fontSize: "0.9rem",
                  borderRadius: "20px",
                  border: `2px solid ${colors.greenAccent[500]}`,
                  color: colors.greenAccent[500],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[500],
                    color: colors.primary[500],
                  },
                  height: "60px",
                  fontSize: "1.2rem",
                }}
              >
                {value}
              </Button>
            </Grid>
          ))}
          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={() => handleButtonClick(".")}
              sx={{
                fontSize: "0.9rem",
                borderRadius: "20px",
                border: `2px solid ${colors.greenAccent[500]}`,
                color: colors.greenAccent[500],
                "&:hover": {
                  backgroundColor: colors.greenAccent[500],
                  color: colors.primary[500],
                },
                height: "60px",
                fontSize: "1.2rem",
              }}
            >
              .
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Button
              fullWidth
              onClick={() => handleOperator("-")}
              sx={{
                fontSize: "0.9rem",
                borderRadius: "20px",
                border: `2px solid ${colors.greenAccent[500]}`,
                color: colors.greenAccent[500],
                "&:hover": {
                  backgroundColor: colors.greenAccent[500],
                  color: colors.primary[500],
                },
                height: "60px",
                fontSize: "1.2rem",
              }}
            >
              -
            </Button>
          </Grid>
          <Grid
            container
            sx={{ justifyContent: "space-evenly", marginTop: "10px" }}
          >
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleClear}
                color="secondary"
                style={{
                  height: "60px",
                  fontSize: "1.2rem",
                  borderRadius: "20px",
                }}
              >
                {t["Clear"]}
              </Button>
            </Grid>
            <Grid item xs={4}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                color="secondary"
                style={{
                  height: "60px",
                  fontSize: "1.2rem",
                  borderRadius: "20px",
                }}
              >
               {t["Submit"]}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default NumericKeypad;
