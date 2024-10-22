import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import DailySalesDetails from "./DailySalesDetails";

const DailySalesModal = ({
  isOpen,
  setOpenSaleModal,
  companyName,
  setSelectedItem,
  selectedItem,
  url,
  selectedName,
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

  const handleClose = () => {
    setOpenSaleModal(false);
    setSelectedItem(false);
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
        <DailySalesDetails
          companyName={companyName}
          selectedItem={selectedItem}
          url={url}
          handleClose={handleClose}
          selectedName={selectedName}
        />
        {/* Other modal content */}
      </Box>
    </Modal>
  );
};

export default DailySalesModal;
