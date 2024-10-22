import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import UserDetailsModal from "./UserDetailsModal";
import Button from "@mui/material/Button";
import AddUserDialog from "./AddUserDialog";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const Team = ({
  companyName,
  addTitle,
  setAddTitle,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard,
  // userDetails,
  // setUserDetails,
  // userDetailsCopy,
  // setUserDetailsCopy,
  valMessage,
  setValMessage,
  userName,
  setUserName,
  tickKey,
  inputValue,
  setInputValue,
  setTickKey,
                      
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);

  //const [companyName, setCompanyName] = useState("");
  const [unitPrices, setUnitPrices] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();
  const [userDetails, setUserDetails] = useState({});
  const [userDetailsCopy, setUserDetailsCopy] = useState({ ...userDetails });
  const [branches, setBranches] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    // Fetch users based on the company name
    if (companyName) {
      fetch(`${url}/pos/users/${companyName}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure that data is an object with the 'initialState' property

          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        })
        .catch((error) => console.error("Error fetching users", error));
      fetch(`${url}/pos/branch/${companyName}`)
        .then((response) => response.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setBranches(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        })
        .catch((error) => console.error("Error fetching branches", error));  
    }
   
  }, [userDetails]);

  // useEffect(() => {
  //   // Check if userDetails is truthy and open the modal
  //   if (userDetails) {
  //     setIsDetailsModalOpen(true);
  //   }
  // }, [userDetails]);

  const handleRowClick = (params) => {
    // Open the details modal and set the selected user details
    setIsDetailsModalOpen(true);
    setUserDetails(params.row);
    setUserDetailsCopy(params.row);
  };

  const closeDetailsModal = () => {
    // Close the details modal
    setIsDetailsModalOpen(false);
    //setSelectedUserDetails(null);
    setUserDetails(null);
  };

  const renderAccessLevelCell = ({ value }) => {
    const iconMap = {
      admin: <AdminPanelSettingsOutlinedIcon />,
      manager: <SecurityOutlinedIcon />,
      user: <LockOpenOutlinedIcon />,
    };

    const colorMap = {
      admin: colors.greenAccent[600],
      manager: colors.greenAccent[700],
      user: colors.greenAccent[700],
    };

    return (
      <Box
        width="100%"
        m="0 auto"
        p="5px"
        display="flex"
        justifyContent="center"
        alignItems="center"
        backgroundColor={colorMap[value]}
        borderRadius="4px"
        color={colors.grey[100]}
      >
        {iconMap[value]}
        <Typography sx={{ ml: "5px" }}>{value}</Typography>
      </Box>
    );
  };

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "username",
      headerName: t.username,
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "password",
      headerName: t.password,
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    // {
    //   field: "phone",
    //   headerName: "Phone",
    //   flex: 1,
    //   minWidth: 200,
    // },
    // {
    //   field: "email",
    //   headerName: "Email",
    //   flex: 1,
    //   minWidth: 250,
    // },
    // {
    //   field: "accessLevel",
    //   headerName: "Access Level",
    //   flex: 1,
    //   minWidth: 250,
    //   type: "singleSelect",
    //   valueOptions: ["manager", "user", "admin"],
    //   editable: true,

    //   renderCell: renderAccessLevelCell,
    // },
  ];

  const handleAddUser = (title) => {
    setTickKey(false);
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  const handleUserDetailsChange = async (newUserDetails) => {
    try {
      const apiUrl = `${url}/pos/addusers/${companyName}/${newUserDetails.name}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUserDetails),
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
      const userDetailsResponse = await fetch(
        `${url}/pos/getUserDetail/${companyName}/${newUserDetails.name}`
      );

      if (!userDetailsResponse.ok) {
        throw new Error(`HTTP error! Status: ${userDetailsResponse.status}`);
      }

      const userDetailsData = await userDetailsResponse.json();

      // Set the userDetails state with the details of the newly added user
      setUserDetails(userDetailsData);
      setUserDetailsCopy(userDetailsData);
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
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box
        justifyContent="space-between"
        display="flex"
        height="8%"
        alignItems="center"
        width="90%"
      >
        <Box>
          <Header title={t.manage_team_members} />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            style={{ fontSize: "1.1rem" }}
            onClick={() => handleAddUser(t["AddUser"])}
          >
            {t.Add}
          </Button>
        </Box>
      </Box>
      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        setIsDetailsModalOpen={setIsDetailsModalOpen}
        //setSelectedUserDetails={setSelectedUserDetails}
        userDetails={userDetails}
        setUserDetails={setUserDetails}
        users={users}
        setUsers={setUsers}
        companyName={companyName}
        userDetailsCopy={userDetailsCopy}
        setUserDetailsCopy={setUserDetailsCopy}
        url={url}
        activeField={activeField}
        setActiveField={setActiveField}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
        valMessage={valMessage}
        setValMessage={setValMessage}
        tickKey={tickKey}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setTickKey={setTickKey}
        userName={userName}
        branches={branches}
     
      />

      <DatagridTable
        rows={users}
        columns={columns}
        handleRowClick={handleRowClick}
      />
      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleUserDetailsChange}
        successMess={successMess}
        title={addTitle}
        activeField={activeField}
        setActiveField={setActiveField}
        setShowKeyboard={setShowKeyboard}
        valMessage={valMessage}
        setValMessage={setValMessage}
        userName={userName}
        setUserName={setUserName}
        inputValue={inputValue}
        setInputValue={setInputValue}
        tickKey={tickKey}
        setTickKey={setTickKey}
      />
    </Box>
  );
};

export default Team;
