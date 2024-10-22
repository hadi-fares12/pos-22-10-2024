import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import InvDet from "./InvDet";


const InvDetailsModal = ({
  isOpen,
  setOpenIvDetailsModal,
  companyName,
  setSelectedInv,
  selectedInv,
  url,
  selectedInvType,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const modalStyle = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: colors.whiteblack[100],
    //background: "#FFFEFC",
    //backgroundColor: "#fcfcfc",
    boxShadow: 24,
    //width: "100%",
    minWidth: "90%",
    height: "100%", // Set a minimum height for smaller screens
    //maxHeight: "90%", // Set a maximum height for smaller screens
    display: "flex",
    flexDirection: window.innerWidth < 650 ? "row" : "column",
  };
  const modalContainerStyle = {
    position: "relative",
    overflow: "hidden", // Hide overflow from the Drawer
    //backgroundColor: "rgba(252, 252, 252, 0.92)",
  };
  const largerModalStyle = {
    width: "90%",
    //maxWidth: 800,
  };
  const heightModalStyle = {
    width: "100%",
    minHeight: "60%", // Set the fixed height for smaller screens
    maxHeight: "80%", // Adjust the maximum height as needed
  };
  const iconButtonStyle = {
    // Other styles...
    display: "flex",
    color: colors.greenAccent[500],
    ...(window.innerWidth < 650
      ? {
          position: "absolute",
          top: "8px",
          right: "8px",
        }
      : {
          position: "relative",
        }),
    marginLeft: "auto", // Push the button to the right
    // Other styles...
  };

  const handleClose = () => {
    setOpenIvDetailsModal(false);
    setSelectedInv(false);
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          ...modalStyle,
          ...(window.innerWidth > 650 ? largerModalStyle : heightModalStyle),
          ...modalContainerStyle,
        }}
      >
        <Box sx={{ width: "5%", alignItems: "flex-end" }}>
          <IconButton
            color="inherit"
            onClick={handleClose}
            sx={iconButtonStyle}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <InvDet
          companyName={companyName}
          selectedInv={selectedInv}
          url={url}
          selectedInvType={selectedInvType}
        />
        {/* Other modal content */}
      </Box>
    </Modal>
  );
};

export default InvDetailsModal;
