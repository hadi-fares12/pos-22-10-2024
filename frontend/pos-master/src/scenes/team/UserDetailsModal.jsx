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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import GeneralAccountingTable from "./GeneralAccountingTable";
import ConfirmationDialog from "./ConfirmationDialog";
import { handleSave } from "./SaveHandler";
import { margin } from "@mui/system";
import Button from "@mui/material/Button";
import Keyboard from "../form/Keyboard";
import SalesCondition from "./SalesConditions";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const StockInventoryTable = ({ userDetails, }) => (
  <Box>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell style={{ minWidth: "80px" }}>User Control:</TableCell>
          <TableCell style={{ minWidth: "120px" }}>
            {userDetails.user_control}
          </TableCell>
        </TableRow>
        {/* Add more rows specific to Stock Inventory */}
      </TableBody>
    </Table>
  </Box>
);


const UserDetailsModal = ({
  isOpen,
  setIsDetailsModalOpen,
  //setSelectedUserDetails,
  userDetails,
  setUserDetails,
  users,
  setUsers,
  companyName,
  userDetailsCopy,
  setUserDetailsCopy,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard,
  valMessage,
  setValMessage,
  tickKey,
  inputValue,
  setInputValue,
  setTickKey, branches

}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedOption, setSelectedOption] = useState("general");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const { language } = useLanguage();
  const t = translations[language];

  const getOptionLabel = (option) => {
    switch (option) {
      case "accounting":
        return t.accounting;
      case "stock-inventory":
        return t.stockInventory;
      case "invoices":
        return t.invoices;
      case "sales":
        return t.sales;
      case "tables":
        return t.tables;
      case "other":
        return t.other;
      default:
        return t.general;
    }
  };

  // const handleUserDetailsCopyChange = (newUserDetailsCopy) => {
  //   setUserDetailsCopyModel(newUserDetailsCopy);
  // };

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
    height: "90%", // Set a minimum height for smaller screens
    //maxHeight: "90%", // Set a maximum height for smaller screens
    display: "flex",
    flexDirection: window.innerWidth < 650 ? "row" : "column",

  // Media query for max-width 1200px
  "@media (max-width: 1200px)": {
    flexDirection: "column", // Stack content vertically on smaller screens
    minWidth: "100%", // Take up the full width on smaller screens
    height: "100%", // Full height
  },
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
     // Media query for max-width 1200px
  "@media (max-width: 1200px)": {
    top: "4px", // Adjust position for smaller screens
    right: "4px",
    padding: "4px", // Reduce padding for smaller screens
  },
    // Other styles...
  };

  // const appBarStyle = {
  //   bgcolor: colors.grey[600],
  //   borderRadius: "4px 4px 4px 4px",
  //   maxHeight: "30%"
  // };

  // const toolbarStyle = {
  //   display: "flex",
  //   justifyContent: "space-between",
  //   //padding: theme.spacing(1),
  //   "& .css-9ex7vj-MuiTypography-root": {
  //     fontSize: "1.1rem",
  //     fontWeight: "600",
  //   },

  // };

  // const appbarContentStyle = {
  //   display: "flex",
  //   // pr: "0px",
  //   // pl: "0px",
  //   // marginLeft: "0px",
  //   // marginRight: "0px",
  //   //gap: theme.spacing(1), // Adjust the gap between items
  //   //overflowX: "auto", // Enable horizontal scrolling
  // };

  const appbarContentStyle = {
    display: "flex",
    //gap: "1px",
    width: "100%",

    //backgroundColor: colors.greenAccent[600],
  };

  const appBarStyle = {
    background: colors.whiteblack[100],
    //background: "#fcfcfc",
    //background: "#F8FBF8",
    borderRadius: "0px",
    height: "15%",
    width: "100%",
    display: "flex",
    //justifyContent: "space-between",
    alignItems: "center", // Center the content vertically
    padding: "0px", // Remove padding
    "@media (max-width: 1200px)": {
      height: "12%", // Slightly reduce height for smaller screens
      padding: "0 8px", // Add some padding for smaller screens
    },
  
  };

  const listItemStyle = {
    height:"79%",
    width: "99%",
    flex: "1",
    display: "flex",
    marginbottom:'15px',
    //justifyContent: "center",
    alignItems: "center", // Center the content vertically
    //borderRight: `1px solid ${colors.greenAccent[400]}`,
    // "&:last-child": {
    //   borderRight: "none",
    // },
    // padding: "16px",
    // "& .MuiButtonBase-root": {
    //   fontSize: "1.7rem",
    //   fontWeight: "800",
    // },
    // "@media screen and (max-device-pixel-ratio: 1.)": {
    //   padding: "16px", // Adjust padding for 100% screen scaling
    // },
    "@media (max-width: 1200px)": {
    fontSize: "0.9rem", // Reduce font size for smaller screens
    
  },
  };

  const drawerContainerStyle = {
    // Adjust the width as needed
    //background: colors.primary[400],
    width: "30%",
    ".css-15b8vjn-MuiPaper-root-MuiDrawer-paper": {
      position: "relative",
      background: colors.primary[400],
    },
    ".css-12i7wg6-MuiPaper-root-MuiDrawer-paper": {
      background: colors.primary[400],
      position: "relative",
    },
  };

  const drawerListStyle = {
    background: colors.primary[400],
    "& .MuiListItem-root": {
      gap: theme.spacing(1), // Adjust the gap between items
      display: "flex",

      // justifyContent: "space-between",
      //position: "relative"
    },
  };

  // const handleDrawerOpen = () => {
  //   setIsDrawerOpen(true);
  // };

  const onClose = () => {
    setIsDetailsModalOpen(false);
    setSelectedOption("general");
    //setSelectedUserDetails(null);
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
      userDetails,
      userDetailsCopy,
      setUsers,
      setSuccessMessage,
      setUserDetails,
      valMessage,
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

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const renderSelectedTable = () => {
    switch (selectedOption) {
      case "general":
        return (
          <GeneralAccountingTable
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            setUsers={setUsers}
            companyName={companyName}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            userDetailsCopy={userDetailsCopy}
            setUserDetailsCopy={setUserDetailsCopy}
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
            setTickKey={setTickKey} branches={branches}
           
          />
        );
      case "stock-inventory":
        return <StockInventoryTable userDetails={userDetails} />;
      case "sales":
        return (
          <SalesCondition
            userDetails={userDetails}
            setUserDetails={setUserDetails}
            userDetailsCopy={userDetailsCopy}
            setUserDetailsCopy={setUserDetailsCopy}
            valMessage={valMessage}
            setValMessage={setValMessage}
            successMessage={successMessage}
            setSuccessMessage={setSuccessMessage}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            setUsers={setUsers}
            companyName={companyName}
            url={url}
          />
        );
      // Add more cases for each option
      default:
        return null;
    }
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
        <Box display="flex" justifyContent="space-between" height="10%" alignItems="center"sx={{"@media (max-width: 1200px)": {
    height:'50%'// Reduce font size for smaller screens
    
  },}}>
          <Box sx={{ }}>
            <Typography variant="h3" style={{ fontWeight: "1.1rem" }}>
              {userDetails.username}
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
          <Box sx={appBarStyle}>
            <Toolbar sx={{ width: "100%", height: "100%" }}>
              <List sx={appbarContentStyle}>
                {[
                  "general",
                  "accounting",
                  "stock-inventory",
                  "invoices",
                  "sales",
                  "tables",
                  "other",
                ].map((option) => (
                  <Box
                    key={option}
                    sx={{
                      flex: "1",
                      display: "flex",
                      //justifyContent: "center",
                      "& .MuiButtonBase-root": {
                        fontSize: "1.1rem",
                        fontWeight: "700",
                      },
                    }}
                  >
                    <Button
                      key={option}
                      onClick={() => handleOptionChange(option)}
                      style={{
                        ...listItemStyle,
                        //variant:"contained",
                        background:
                          selectedOption === option
                            ? colors.greenAccent[600]
                            : colors.grey[700],
                        color:
                          selectedOption === option ? colors.primary[500] : "",
                      }}
                    >
                      {getOptionLabel(option)}
                    </Button>
                  </Box>
                ))}
              </List>
            </Toolbar>
          </Box>
        
        <Box sx={{ height: "75%", width: "100%" }}>
          {renderSelectedTable()}
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

export default UserDetailsModal;
