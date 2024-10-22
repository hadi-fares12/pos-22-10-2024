import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import { tokens } from "../../theme";
import { handleSave } from "./SaveHandler.jsx";
import ClientDetails from "./ClientDetails.jsx";
import ConfirmationDialog from "../team/ConfirmationDialog.jsx";
import Keyboard from "../form/Keyboard.jsx";

const ClientDetailsModal = ({
  isOpen,
  setIsDetailsModalOpen,
  clientDetails,
  setClientDetails,
  clients,
  setClients,
  companyName,
  clientDetailsCopy,
  setClientDetailsCopy,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard, valMessage, setValMessage, tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // if (!clientDetails) {
  //   return null;
  // }
  const modalStyle = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: colors.whiteblack[100],
    //background: "#FFFEFC",
    //backgroundColor: "#fcfcfc",
    boxShadow: 24,
    pt: 0, // Set top padding to 2
    pr: 2, // Set right padding to 3
    pb: 2, // Set bottom padding to 3
    pl: 2, // Set left padding to 3
    //width: "100%",
    minWidth: "90%",
    minHeight: "90%", // Set a minimum height for smaller screens
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

  // Callback function to set unsaved changes status
  // const checkUnsavedChanges = (unsavedChanges) => {
  //   setHasUnsavedChanges(unsavedChanges);
  // };
  const onClose = () => {
    setIsDetailsModalOpen(false);
  };
  const handleClose = () => {
    if (unsavedChanges) {
      setShowConfirmation(true);
    } else {
      setShowConfirmation(false);
      onClose();
    }
  };
  const handleConfirmClose = async () => {
    handleSave(
      companyName,
      clientDetails,
      clientDetailsCopy,
      setSuccessMessage,
      setClientDetails,
      valMessage,
      url,
    );
    // Handle the save operation here
    // Once saved, set the state to indicate no unsaved changes
    setUnsavedChanges(false);
    setShowConfirmation(false); // Close the confirmation dialog
    onClose(); // Close the modal
  };
  const handleCancelClose = () => {
    setShowConfirmation(false); // Close the confirmation dialog
    onClose();
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
        <Box display="flex" justifyContent="space-between">
          <Box sx={{ p: "2%" }}>
            <Typography variant="h3" style={{ fontWeight: "1.1rem" }}>
              {clientDetails.AccName}
            </Typography>
          </Box>
          <Box>
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleClose}
              sx={iconButtonStyle}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1, // Allow the table to grow and take available space
            width: window.innerWidth < 650 ? "60%" : "100%",
            //maxHeight: "60%",
            height: "500px",
            //overflowY: "auto",
          }}
        >
          <ClientDetails
            clientDetails={clientDetails}
            setClientDetails={setClientDetails}
            setClients={setClients}
            companyName={companyName}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            clientDetailsCopy={clientDetailsCopy}
            setClientDetailsCopy={setClientDetailsCopy}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            url={url}
            valMessage={valMessage}
            setValMessage={setValMessage}
            activeField={activeField}
            setActiveField={setActiveField}
            showKeyboard={showKeyboard}
            setShowKeyboard={setShowKeyboard}
            tickKey={tickKey}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setTickKey={setTickKey}

            // handleUserDetailsCopyChange={handleUserDetailsCopyChange}
          />

          <ConfirmationDialog
            open={showConfirmation} // Controls whether the dialog is open or not
            onCancel={handleCancelClose} // Function to handle dialog closure (cancel)
            onConfirm={handleConfirmClose} // Function to handle confirmation
          />
        </Box>
        {/* Other modal content */}
      </Box>
    </Modal>
  );
};

export default ClientDetailsModal;
