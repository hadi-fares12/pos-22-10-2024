import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { height } from "@mui/system";
import KitchenDetails from "./KitchenDetails";
import Header from "../../components/Header";
import { Button } from "@mui/material";
import AddUserDialog from "../team/AddUserDialog";
import { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
const Kitchen = ({ companyName, addTitle, setAddTitle, url, setActiveField, setShowKeyboard, kitchenDetails, setKitchenDetails, kitchenDetailsCopy, setKitchenDetailsCopy, valMessage, setValMessage, userName, setUserName, setInputValue}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();
  
    const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [prList, setPrList] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

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
    setIsDialogOpen(true);
    };
    
    
  useEffect(() => {
    const fetchStationDetails = async () => {
      try {
        const response = await fetch(`${url}/pos/kitchen/${companyName}`);
        if (response.ok) {
          const data = await response.json();
            setKitchenDetails(data);
            setKitchenDetailsCopy(data);
        } else {
          console.error("Failed to fetch company details");
        }
        const response1 = await fetch(`${url}/pos/prlist/${companyName}`);
        if (response1.ok) {
          const data = await response1.json();
          setPrList(data);
        } else {
          console.error("Failed to fetch company details");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    fetchStationDetails();
  }, []);
    
    const handleKitchenDetailsChange = async (newKitchenDetails) => {
      try {
        console.log("newUserDetailssssssssss", newKitchenDetails.name);
        const apiUrl = `${url}/pos/addKitchen/${companyName}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Language": language
          },
          body: JSON.stringify(newKitchenDetails),
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
        const kitchenDetailsResponse = await fetch(
          `${url}/pos/kitchen/${companyName}`
        );

        if (!kitchenDetailsResponse.ok) {
          throw new Error(
            `HTTP error! Status: ${kitchenDetailsResponse.status}`
          );
        }

        const kitchenDetailsData = await kitchenDetailsResponse.json();

        // Set the userDetails state with the details of the newly added user
        setKitchenDetails(kitchenDetailsData);
        setKitchenDetailsCopy(kitchenDetailsData);
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
          justifyContent:"space-between",
        display:"flex",
        height:"10%",
        alignItems:"center",
        }}
      >
        <Box sx={{ width: "50%", m: "2%" }}>
          <Header title={translations[language].KitchenSettings} />
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
            onClick={() => handleAddUser(t["AddKitchenNumber"])}
            
          >
            {t.Add}
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
          <KitchenDetails
            companyName={companyName}
            kitchenDetails={kitchenDetails}
            setKitchenDetails={setKitchenDetails}
            kitchenDetailsCopy={kitchenDetailsCopy}
            setKitchenDetailsCopy={setKitchenDetailsCopy}
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            prList={prList}
            setPrList={setPrList}
            url={url}
          ></KitchenDetails>
          <AddUserDialog
            isOpen={isDialogOpen}
            onClose={handleCloseDialog}
            onAdd={handleKitchenDetailsChange}
            successMess={successMess}
            title={addTitle}
            setActiveField={setActiveField}
            setShowKeyboard={setShowKeyboard}
            setValMessage={setValMessage}
            valMessage={valMessage}
            userName={userName}
            setUserName={setUserName}
            setInputValue={setInputValue}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default Kitchen;
