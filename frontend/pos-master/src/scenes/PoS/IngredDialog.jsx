import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";

const IngredDialog = ({ open, onCancel, nameCard, ingredCard }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Dialog open={open}>
      <DialogTitle sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
        {nameCard}
      </DialogTitle>
      <DialogContent>{ingredCard}</DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          onClick={onCancel}
          style={{ fontSize: "0.9rem" }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IngredDialog;
