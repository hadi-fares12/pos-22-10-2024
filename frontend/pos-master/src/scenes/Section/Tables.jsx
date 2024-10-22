import React from "react";
import { tokens } from "../../theme";

import {
  Box,
  Button,
  ButtonBase,
  Container,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import TableDialog from "./TableDialog";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TableChart } from "@mui/icons-material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import AllowDialog from '../PoS/AllowDialog';

const Tables = ({
  addTitle,
  setAddTitle,
  companyName,
  username,
  message,
  setMessage,
  url,
  v,
  userControl,
  tableNo,
  setTableNo,
  active,
  setActive,
  description,
  setDescription,
  tableWaiter,
  setTableWaiter,
  setShowKeyboard,
  setActiveField,
  accno,
  setInputValue,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();
  const { sectionNo } = useParams();
  const [selectedTableId, setSelectedTableId] = useState("");
  const navigate = useNavigate();
  const [tables, setTables] = useState([]);
  const [tablesChanged, setTablesChanged] = useState(false);
  const { language } = useLanguage(); 
  const t = translations[language];
  const [prRemark, setPrRemark] = useState("");
  const [allowDialog, setAllowDialog] = useState(false);
  const [AddandUpdateTable, setAddAndUpdateTable] = useState("N");
  
  const handleCloseAllow = () => {
    setAllowDialog(false);
  }; 
   // Fetch data function
   const fetchData = async () => {
    try {
      const response = await fetch(`${url}/pos/checkPermissionTable/${companyName}/${username}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const permissionData = await response.json();
      setAddAndUpdateTable(permissionData.AddandUpdateTable); // Set the permission state

      // Fetch tables data
      const tablesResponse = await fetch(`${url}/pos/alltables/${companyName}/${sectionNo}`);
      if (!tablesResponse.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await tablesResponse.json();
      setTables(data);

      // Reset used by if message exists
      if (message) {
        await fetch(`${url}/pos/resetUsedBy/${companyName}/${message}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    fetchData(); // Check for changes whenever tables changes
  }, []);

  const handleAddSection = (title) => {
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    // Close the dialog when needed
    setIsDialogOpen(false);
  };

  const handleEditClick = (title, tableNo) => {
    setSelectedTableId(tableNo);
    setAddTitle(title);
    setIsDialogOpen(true);
    // Handle edit action here
  };

  const onAdd = async (sectionInfo) => {
    try {
      if (addTitle === "Add Table") {
        const apiUrl = `${url}/pos/addtables/${companyName}/${sectionNo}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionInfo),
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
      } else {
        const apiUrl = `${url}/pos/updateTables/${companyName}/${sectionNo}/${selectedTableId}`;

        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sectionInfo),
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
      }
      // Fetch the details of the newly added user
      const tablesResponse = await fetch(
        `${url}/pos/alltables/${companyName}/${sectionNo}`
      );

      if (!tablesResponse.ok) {
        throw new Error(`HTTP error! Status: ${tablesResponse.status}`);
      }

      const alltable = await tablesResponse.json();

      // Set the userDetails state with the details of the newly added user
      setTables(alltable);
      // Open the details modal
    } catch (error) {
      console.error("Error:", error.message);
    }
  };
  const handleOpenPOS = async (tableNo) => {
    try {
        const response = await fetch(
            `${url}/pos/chooseAccess/${companyName}/${tableNo}/${username}`
        );
        if (response.ok) {
            const data = await response.json();
            if (data.message === "you can access this table" && data.usedBy !== "") {
                setMessage(data.invNo);
                navigate(`/${v}/PoS?selectedTableId=${tableNo}`);
            } else if (data.message === "you can access this table" && data.usedBy === "") {
                const reqOpen = await fetch(
                    `${url}/pos/openTable/${companyName}/${tableNo}/${username}/${accno}`,
                    {
                        method: "POST",
                    }
                );
                if (reqOpen.ok) {
                  const res = await reqOpen.json();
                  setMessage(res.message);
                  setPrRemark("Table opened successfully."); // Success remark
                } else {
                  setPrRemark("Failed to open the table."); // Failure remark
                }
                navigate(`/${v}/PoS?selectedTableId=${tableNo}`);
              } else if (data.message === "you can't access this table right now") {
                setPrRemark("You can't access this table right now.");
                setAllowDialog(true); // Show the AllowDialog
              } else if (data.message === "you can't access this table, you don't have permission") {
                const accessDeniedMessage = `You cannot access this table, as it is currently used by ${data.usedBy}.`;
                // setMessage(accessDeniedMessage);
                setPrRemark(accessDeniedMessage); // Display access denial remark
                setAllowDialog(true); // Open the dialog on permission error
              }
            } else {
              console.error("Failed to choose access");
              setPrRemark("Failed to access the table. Please try again later.");
              setAllowDialog(true); // Show dialog on error
            }
          } catch (error) {
            console.error("Error:", error);
            setPrRemark("An error occurred while trying to access the table.");
            setAllowDialog(true); // Show the error dialog
          }
};


  // const handleOpenPOS = async (tableNo) => {
  //   try {
  //     const response = await fetch(
  //       `${url}/pos/chooseAccess/${companyName}/${tableNo}/${username}`
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (
  //         data.message === "you can access this table" &&
  //         data.usedBy !== ""
  //       ) {
  //         setMessage(data.invNo);
  //         navigate(`/${v}/PoS?selectedTableId=${tableNo}`);
  //       } else if (
  //         data.message === "you can access this table" &&
  //         data.usedBy === ""
  //       ) {
  //         const reqOpen = await fetch(
  //           `${url}/pos/openTable/${companyName}/${tableNo}/${username}/${accno}`,
  //           {
  //             method: "POST",
  //           }
  //         );
  //         if (reqOpen.ok) {
  //           const res = await reqOpen.json();
  //           setMessage(res.message);
  //         }
  //         navigate(`/${v}/PoS?selectedTableId=${tableNo}`);
  //       } else if (data.message === "you can't access this table right now") {
  //         navigate(`/${v}/Tables/${sectionNo}`);
  //       }
  //     } else {
  //       console.error("Failed to choose access");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  
  return (
    <Box
      sx={{
        height: "90%",
        width: "100%",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          height: "15%",
          width: "90%",
          justifyContent: "space-around",
          display: "flex",
          flexDirection: "row",
          ml: "3%",
        }}
      >
        <Header title={t["Tables"]} subtitle="Choose Table" />
        <Box
          sx={{
            height: "80px",
            marginLeft: "auto",
            justifyContent: "flex-end",
            alignContent: "center",
            alignItems: "center",
            display: "flex",
          }}
        >
          {AddandUpdateTable   === "Y" && (
            <Button
              variant="contained"
              color="secondary"
              style={{ fontSize: "1.1rem" }}
              onClick={() => handleAddSection("Add Table")}
            >
              {t["Add"]}
            </Button>
          )}
        </Box>
      </Box>
      <Container sx={{ height: "85%", width: "100%" }}>
        <Grid
          container
          spacing={2}
          sx={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
            width: "100%",
          }}
        >
          {tables.map((table) => (
            <Grid key={table.TableNo} item xs={12} sm={6} md={4} lg={3}>
              <Box
                position="relative"
                width="100%"
                paddingTop="100%"
                bgcolor={
                  table.UsedBy ? colors.blinkColor : colors.blueAccent[800]
                }
                sx={{
                  animation: table.UsedBy
                    ? "blink 1s infinite alternate"
                    : "none",
                  "@keyframes blink": {
                    from: {
                      backgroundColor: colors.blueAccent[800],
                    },
                    to: {
                      backgroundColor: colors.redAccent[700], // or any other color you want for blinking
                    },
                  },
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {table.TableNo}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {table.UsedBy}
                </Typography>
                <ButtonBase
                  component={Link}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  onClick={() => handleOpenPOS(table.TableNo)}
                />
                {AddandUpdateTable === "Y" && (
                  <Button
                    size="large"
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: colors.greenAccent[500],
                      color: colors.primary[500],
                      zIndex: 1, // Ensure the Edit button is above the ButtonBase
                    }}
                    onClick={() => {
                      setTableNo(table.TableNo);
                      setTableWaiter(table.TableWaiter);
                      setActive(table.Active);
                      setDescription(table.Description);
                      handleEditClick("Update Table", table.TableNo);
                    }}
                  >
                    {t["Edit"]}
                  </Button>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
      <AllowDialog
        open={allowDialog}
        onCancel={handleCloseAllow}
        nameCard={prRemark} // This will display the remark message in the AllowDialog
      ></AllowDialog>
      <TableDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={onAdd}
        successMess={successMess}
        title={addTitle}
        tableNo={tableNo}
        setTableNo={setTableNo}
        tableWaiter={tableWaiter}
        setTableWaiter={setTableWaiter}
        active={active}
        setActive={setActive}
        description={description}
        setDescription={setDescription}
        setShowKeyboard={setShowKeyboard}
        setActiveField={setActiveField}
        setInputValue={setInputValue}
      />
    </Box>
  );
};

export default Tables;
