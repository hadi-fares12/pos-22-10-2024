import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddUserDialog from "../team/AddUserDialog";
import GroupDetailsModal from "./GroupDetailsModal";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const Groups = ({
  companyName,
  addTitle,
  setAddTitle,
  setOldItemNo,
  setNewItemNo,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard, groupDetails, setGroupDetails, groupDetailsCopy, setGroupDetailsCopy, userName, setUserName, valMessage, setValMessage,tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);
  const { language } = useLanguage();
  const t = translations[language];

  //const [companyName, setCompanyName] = useState("");
  const [rows, setRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();

  useEffect(() => {
    // Read company_name from localStorage
    // const storedCompanyName = localStorage.getItem("company_name");
    // setCompanyName(storedCompanyName);
    // Fetch users based on the company name
    if (companyName) {
      fetch(`${url}/pos/groupitems/${companyName}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure that data is an object with the 'initialState' property

          if (Array.isArray(data)) {
            setRows(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        })
        .catch((error) => console.error("Error fetching users", error));
    }
  }, [groupDetails]);

  const handleRowClick = (params) => {
    // Open the details modal and set the selected user details
    setIsDetailsModalOpen(true);
    setGroupDetails(params.row);
    setGroupDetailsCopy(params.row);
  };

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const columns = [
    {
      field: "GroupNo",
      headerName: t["GroupNo"],
      flex: 1,
      cellClassName: "name-column--cell",
      // minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "GroupName",
      headerName: t["GroupName"],
      flex: 1,
      // headerAlign: "left",
      // align: "left",
      // minWidth: 300,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Image",
      headerName: t["Image"],
      flex: 1,
      // headerAlign: "left",
      // align: "left",
      // minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
  ];

  const handleAddItem = (title) => {
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  const handleGroupDetailsChange = async (newGroupDetails) => {
    try {
      const apiUrl = `${url}/pos/addgroup/${companyName}/${newGroupDetails.name}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroupDetails),
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
      const groupDetailsResponse = await fetch(
        `${url}/pos/getGroupDetail/${companyName}/${newGroupDetails.name}`
      );

      if (!groupDetailsResponse.ok) {
        throw new Error(`HTTP error! Status: ${groupDetailsResponse.status}`);
      }

      const groupDetailsData = await groupDetailsResponse.json();

      // Set the userDetails state with the details of the newly added user
      setGroupDetails(groupDetailsData);
      setGroupDetailsCopy(groupDetailsData);
      // Open the details modal
      setTimeout(() => {
        setIsDetailsModalOpen(true);
      }, 2000);
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
      display: { xs: "flex", md: "block" }, // Flex on small screens, block on medium and up
      flexDirection: { xs: "column", md: "row" }, // Column layout on small screens
      alignItems: "center",
      height: "100%",
      width: "100%",
    }}
    >
      <Box
       sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: { xs: "100%", md: "90%" }, // Full width on small screens, 90% on normal
        mb: { xs: 2, md: 0 }, // Margin bottom for small screens
      }}
      >
        <Box>
          <Header title={t["manage_item_group"]} />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" } }}
            onClick={() => handleAddItem(t["AddGroupNumber"])}
          >
            {t["Add"]}
          </Button>
        </Box>
      </Box>
      <GroupDetailsModal
        isOpen={isDetailsModalOpen}
        setIsDetailsModalOpen={setIsDetailsModalOpen}
        groupDetails={groupDetails}
        setGroupDetails={setGroupDetails}
        groups={rows}
        setGroups={setRows}
        companyName={companyName}
        setOldItemNo={setOldItemNo}
        setNewItemNo={setNewItemNo}
        groupDetailsCopy={groupDetailsCopy}
        setGroupDetailsCopy={setGroupDetailsCopy}
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
      <DatagridTable
        rows={rows}
        columns={columns}
        getRowId={(row) => row.GroupNo}
        handleRowClick={handleRowClick}
      ></DatagridTable>
      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleGroupDetailsChange}
        successMess={successMess}
        title={addTitle}
        setShowKeyboard={setShowKeyboard}
        setActiveField={setActiveField}
        valMessage={valMessage}
        setValMessage={setValMessage}
        userName={userName}
        setUserName={setUserName}
        activeField={activeField}
        tickKey={tickKey}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setTickKey={setTickKey}
      />
    </Box>
  );
};

export default Groups;
