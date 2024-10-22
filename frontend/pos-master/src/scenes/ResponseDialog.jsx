import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { tokens } from "../theme";
import { useTheme } from "@mui/material";
const ResponseDialog = ({ message, isOpen, onClose }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle variant="h3">{message} </DialogTitle>
      {/* <DialogContent>
        <Typography variant="h1">{message}</Typography>
      </DialogContent> */}
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: colors.greenAccent[500],
            color: colors.primary[500],
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ResponseDialog;
