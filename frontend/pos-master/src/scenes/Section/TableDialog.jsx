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
import { FormControl, FormControlLabel, Checkbox } from "@mui/material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const TableDialog = ({
  isOpen,
  onClose,
  onAdd,
  successMess,
  title,
  tableNo,
  tableWaiter,
  active,
  description,
  setTableNo,
  setTableWaiter,
  setActive,
  setDescription, setShowKeyboard, setActiveField, setInputValue 
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];

  const handleAdd = () => {
    // Perform any validation if needed
    // Call the onAddUser function with the new user details
    onAdd({
      TableNo: tableNo,
      TableWaiter: tableWaiter,
      Active: active,
      Description: description,
    });
    if(title === "Add Table"){
      setTableNo("");
      setTableWaiter("");
      setActive("");
      setDescription("");
    }
    // Close the dialog
    setTimeout(() => {
      // Close the dialog
      onClose();
    }, 3000);
  };

  const handleCancel = () => {
    setTableNo("");
    setTableWaiter("");
    setActive("");
    setDescription("");
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
          label={t["Table No"]}
          value={tableNo}
          onChange={(e) => setTableNo(e.target.value)}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Table No");
          }}
        />
        <TextField
          label={t["Table Waiter"]}
          value={tableWaiter}
          onChange={(e) => setTableWaiter(e.target.value)}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Table Waiter");
          }}
        />
        <FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={active === "Y"} // Assuming active is your state variable for the Active field
                onChange={(e) => setActive(e.target.checked ? "Y" : "N")} // Update the active state accordingly
                color="primary"
              />
            }
            label={t["Active"]}
          />
        </FormControl>
        <TextField
          label={t["Description"]}
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Description");
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
          {title === "Add Table" ? t["Create"] : t["Update"]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TableDialog;
