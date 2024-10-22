import { Box } from "@mui/material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import AddUserDialog from "../team/AddUserDialog";
import { useState, useEffect } from "react";
import BranchDetails from "./BranchDetails";

const Branch = ({
    companyName,
    addTitle,
    setAddTitle,
    url,
    activeField,
    setActiveField,
    showKeyboard,
    setShowKeyboard,
    userName,
    setUserName,
    valMessage,
    setValMessage,
    setInputValue,
    tickKey,
    inputValue,
    setTickKey,
}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [successMess, setSuccessMess] = useState();
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [prList, setPrList] = useState([]);
    const { language } = useLanguage();
    const t = translations[language];
    const [branchDetails, setBranchDetails] = useState([]);
    const [branchDetailsCopy, setBranchDetailsCopy] = useState([
        ...branchDetails,
    ]);


  const modalStyle = {
    background: colors.whiteblack[100],
    boxShadow: 24,
    pt: 2, // Set top padding to 2
    pr: 2, // Set right padding to 3
    pb: 2, // Set bottom padding to 3
    pl: 2, // Set left padding to 3
    width: "90%",
    height: "90%",
    display: "flex",
    flexDirection: window.innerWidth < 650 ? "row" : "column",
  };

  const handleAddUser = (title) => {
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        const response = await fetch(`${url}/pos/branch/${companyName}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setBranchDetails(data);
            setBranchDetailsCopy(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        } else {
          console.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    fetchBranchDetails();
  }, []);

  const handleBranchDetailsChange = async (newBranchDetails) => {
    try {
      const apiUrl = `${url}/pos/addBranch/${companyName}/${newBranchDetails.name}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Language": language
        },
        body: JSON.stringify(newBranchDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setSuccessMess(responseData.message);
      setTimeout(() => {
        setSuccessMess("");
      }, 2000);
      console.log("Response from the server:", responseData);

      // Fetch the details of the newly added user
      const BranchDetailsResponse = await fetch(
        `${url}/pos/branch/${companyName}`
      );

      if (!BranchDetailsResponse.ok) {
        throw new Error(`HTTP error! Status: ${BranchDetailsResponse.status}`);
      }

      const BranchDetailsData = await BranchDetailsResponse.json();

      // Set the userDetails state with the details of the newly added user
      setBranchDetails(BranchDetailsData);
      setBranchDetailsCopy(BranchDetailsData);
      // Open the details modal
      // setTimeout(() => {
      //   setIsDetailsModalOpen(true);
      // }, 2000);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleCloseDialog = () => {
    // Close the dialog when needed
    setIsDialogOpen(false);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "10%",
          display: "flex",
          flexDirection: "row",
          //justifyContent: "space-around",
          //alignItems: "center",
        }}
      >
        <Box sx={{ width: "50%", m: "2%" }}>
          <Header title={translations[language].BranchSettings} />
        </Box>
        <Box
          sx={{
            width: "10%",
            marginLeft: "auto",
            justifyContent: "flex-end",
            alignContent: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            style={{ fontSize: "1.1rem" }}
            onClick={() => handleAddUser(t["AddBranchNumber"])}
          >
            {t["Add"]}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "90%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            ...modalStyle,
          }}
        >
          <BranchDetails
            companyName={companyName}
            branchDetails={branchDetails}
            setBranchDetails={setBranchDetails}
            branchDetailsCopy={branchDetailsCopy}
            setBranchDetailsCopy={setBranchDetailsCopy}
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
          ></BranchDetails>
          <AddUserDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onAdd={handleBranchDetailsChange}
            successMess={successMess}
            title={addTitle}
            setActiveField={setActiveField}
            setShowKeyboard={setShowKeyboard}
            setUserName={setUserName}
            userName={userName}
            valMessage={valMessage}
            setValMessage={setValMessage}
            setInputValue={setInputValue}
          />
        </Box>
      </Box>
    </Box>
  );
}; 

export default Branch;