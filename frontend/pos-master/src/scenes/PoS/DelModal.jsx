import { Modal, Box } from "@mui/material";
import ChartAcc from "../ChartAcc";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import Button from "@mui/material/Button";
import AddUserDialog from "../team/AddUserDialog";
import Header from "../../components/Header";
import { useState } from "react";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const DelModal = ({
  isOpenDel,
  companyName,
  setIsOpenDel,
  selectedRow,
  setSelectedRow,
  addTitle,
  setAddTitle,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard,
  valMessage,
  setValMessage,
  userName,
  setUserName,
  clientDetails,
  setClientDetails,
  clientDetailsCopy,
  setClientDetailsCopy,
  searchClient,
  setSearchClient, tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  const handleClose = () => {
    setSearchClient("");
    setIsOpenDel(false);
  };

  const modalStyle = {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: colors.whiteblack[100],
    //background: "#FFFEFC",
    //backgroundColor: "#fcfcfc",
    boxShadow: 24,
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
    // Other styles..
    width: "5%",
    heigh: "5%",
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

  const handleAddUser = (title) => {
    setInputValue("");
    setValMessage("");
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  return (
    <Modal open={isOpenDel} onClose={handleClose}>
      <Box
        sx={{
          ...modalStyle,
          ...(window.innerWidth > 650 ? largerModalStyle : heightModalStyle),
          ...modalContainerStyle,
        }}
      >
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            height: "8%",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "50%" }}>
            <Header title={t["Client"]} />
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: "1.1rem" }}
              onClick={() => setSelectedRow(null)}
            >
              {t["Clear"]}
            </Button>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: "1.1rem" }}
              onClick={() => handleAddUser(t["AddClient"])}
            >
             {t["Add"]} 
            </Button>
          </Box>
          <Box>
            <IconButton edge="end" color="inherit" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <ChartAcc
          companyName={companyName}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          addTitle={addTitle}
          setAddTitle={setAddTitle}
          setIsOpenDel={setIsOpenDel}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          url={url}
          activeField={activeField}
          setActiveField={setActiveField}
          showKeyboard={showKeyboard}
          setShowKeyboard={setShowKeyboard}
          valMessage={valMessage}
          setValMessage={setValMessage}
          userName={userName}
          setUserName={setUserName}
          clientDetails={clientDetails}
          setClientDetails={setClientDetails}
          clientDetailsCopy={clientDetailsCopy}
          setClientDetailsCopy={setClientDetailsCopy}
          searchClient={searchClient}
          setSearchClient={setSearchClient}
          tickKey={tickKey}
          inputValue={inputValue}
          setInputValue={setInputValue}
          setTickKey={setTickKey}
        />
      </Box>
    </Modal>
  );
};

export default DelModal;