import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const KitchenDialog = ({ open, onCancel, onConfirm }) => {
   const theme = useTheme();
   const colors = tokens(theme.palette.mode);
   const { language } = useLanguage();
  const t = translations[language];
   
  
  return (
    <Dialog open={open}>
      <DialogTitle>{t["Confirmation"]}</DialogTitle>
      <DialogContent>{t["AlertMessage"]}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={onConfirm}
          autoFocus
          style={{ fontSize: "0.9rem" }}
        >
          {t["Send"]}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={onCancel}
          style={{ fontSize: "0.9rem" }}
        >
         {t["Stay"]}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default KitchenDialog;
