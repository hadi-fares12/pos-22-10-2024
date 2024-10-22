import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const SectionDialog = ({
  isOpen,
  onClose,
  onAdd,
  successMess,
  title,
  sectionName,
  sectionNo,
  setSectionName, 
  setSectionNo, setShowKeyboard, setActiveField, setInputValue
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const handleAdd = () => {
    // Perform any validation if needed
    // Call the onAddUser function with the new user details
    onAdd({ SectionNo: sectionNo, Name: sectionName });
    if(title === "Add Section"){
      setSectionNo("");
      setSectionName("");
    }
    // Close the dialog
    setTimeout(() => {
      // Close the dialog
      onClose();
    }, 3000);
  };

  const handleCancel = () => {
    // Reset userName to an empty string
    setSectionNo("");
    setSectionName("");
    // Close the dialog
    // Close the dialog
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxHeight="100%">
      <DialogTitle>
        <Typography variant="h1">{t[title]}</Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          padding: "20px",
        }}
      >
        <TextField
          autoFocus
          required
          margin="dense"
          label={t["Section No"]}
          value={sectionNo}
          onChange={(e) => setSectionNo(e.target.value)}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Section No");
          }}
        />
        <TextField
          label={t["Section Name"]}
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Section Name");
          }}
        />
        <Typography variant="body1">{successMess}</Typography>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleCancel}
          style={{ fontSize: "0.9rem" }}
        >
          {t["Cancel"]}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAdd}
          style={{ fontSize: "0.9rem" }}
        >
          {title === "Add Section" ? t["Create"] : t["Update"]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SectionDialog;
