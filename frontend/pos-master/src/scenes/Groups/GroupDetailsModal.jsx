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
import ConfirmationDialog from "../team/ConfirmationDialog.jsx";
import GroupDetails from "./GroupDetails.jsx";

const GroupDetailsModal = ({
  isOpen,
  setIsDetailsModalOpen,
  groupDetails,
  setGroupDetails,
  groups,
  setGroups,
  companyName,
  setOldItemNo,
  setNewItemNo,
  groupDetailsCopy,
  setGroupDetailsCopy,
  url,
  activeField,
   setActiveField,
   showKeyboard,
   setShowKeyboard,tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

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
   
    display: "flex",
    flexDirection: window.innerWidth < 650 ? "row" : "column",
  };
  const modalContainerStyle = {
    position: "relative",
    overflow: "hidden", // Hide overflow from the Drawer
    //backgroundColor: "rgba(252, 252, 252, 0.92)",
  };
  const largerModalStyle = {
      width: "35%",
      height:"50%"
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
      groupDetails,
      groupDetailsCopy,
      setSuccessMessage,
      setGroupDetails,
      setOldItemNo,
      setNewItemNo,
      url
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
          ...(window.innerWidth > 750 ? largerModalStyle : heightModalStyle),
          ...modalContainerStyle,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            height: "20%",
          }}
        >
          <Box sx={{ p: "2%" }}>
            <Typography variant="h3" style={{ fontWeight: "1.1rem" }}>
              {groupDetails.GroupName}
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
            width: "100%",
            height: "80%",
          }}
        >
          <GroupDetails
            groupDetails={groupDetails}
            setGroupDetails={setGroupDetails}
            setGroups={setGroups}
            companyName={companyName}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            groupDetailsCopy={groupDetailsCopy}
            setGroupDetailsCopy={setGroupDetailsCopy}
            setOldItemNo={setOldItemNo}
            setNewItemNo={setNewItemNo}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            url={url}
            activeField={activeField}
            setActiveField={setActiveField}
            showKeyboard={showKeyboard}
            setShowKeyboard={setShowKeyboard}
            tickKey={tickKey}
            inputValue={inputValue}
            setInputValue={setInputValue}
            setTickKey={setTickKey}
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

export default GroupDetailsModal;
