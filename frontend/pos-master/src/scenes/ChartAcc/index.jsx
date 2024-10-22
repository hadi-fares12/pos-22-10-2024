import {
  Box,
  Typography,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import ClientDetailsModal from "./ClientDetailsModal";
import Button from "@mui/material/Button";
import AddUserDialog from "../team/AddUserDialog";
import { Checkbox } from "@mui/material";
import { json } from "react-router-dom";
import ClearIcon from "@mui/icons-material/Clear";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const ChartAcc = ({
  companyName,
  addTitle,
  setAddTitle,
  selectedRow,
  setSelectedRow,
  setIsOpenDel,
  isDialogOpen,
  setIsDialogOpen,
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
  setSearchClient,tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);
  //const [companyName, setCompanyName] = useState("");
  const [clients, setClients] = useState([]);
  // const [selectedRow, setSelectedRow] = useState(() => {
  //   const storedSelectedRow = localStorage.getItem("selectedRow");
  //   return storedSelectedRow ? JSON.parse(storedSelectedRow) : null;
  // });
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();
  const storedSelectedRow = localStorage.getItem("selectedRow");
  const [filteredClients, setFilteredClients] = useState([...clients]);
  const { language } = useLanguage();
  const t = translations[language];
  useEffect(() => {

    // Fetch users based on the company name
    if (companyName) {
      fetch(`${url}/pos/clients/${companyName}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure that data is an object with the 'initialState' property

          if (Array.isArray(data)) {
            setClients(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        })
        .catch((error) => console.error("Error fetching clients", error));
    }
  }, [clientDetails]);

  const handleRowClick = (params) => {
    // Check if the clicked column is not the checkbox column
    // if (params.field !== "checkbox") {
    //   setIsDetailsModalOpen(true);
    //   setClientDetails(params.row);
    //   setClientDetailsCopy(params.row)
    // }

    setIsDetailsModalOpen(true);
    setClientDetails(params);
    setClientDetailsCopy(params);
  };
  useEffect(() => {
    // Compare clientDetails with selectedRow based on AccNo
    if (
      clientDetails &&
      selectedRow &&
      clientDetails.AccNo === selectedRow.AccNo
    ) {
      // Update selectedRow with the updated clientDetails
      setSelectedRow(clientDetails);
    }
  }, [clientDetails]);

  const closeDetailsModal = () => {
    // Close the details modal
    setIsDetailsModalOpen(false);
    //setSelectedUserDetails(null);
    setClientDetails(null);
  };

  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const renderCheckboxCell = ({ row }) => {
    return (
      <Button
        // checked={selectedRow !== null && selectedRow["AccNo"] === row["AccNo"]}
        // onChange={(event) => {
        //   setSelectedRow(selectedRow === row ? null : row);
        //   event.stopPropagation();
        // }}
        onClick={(event) => {
          setSelectedRow(row);
          setIsOpenDel(false);
          setSearchClient("");
          event.stopPropagation();
        }}
      >
        {/* {selectedRow !== null && selectedRow["AccNo"] === row["AccNo"]
          ? "Unselect"
          : "Select"} */}
        {t["Select"]}
      </Button>
    );
  };

  const renderProfile = ({ row }) => {
    return (
      <Button
        onClick={(event) => {
          handleRowClick(row);
        }}
      >
        {t["Profile"]}
      </Button>
    );
  };

  const columns = [
    {
      field: "AccName",
      headerName: t["AccountName"],
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
      flex: 1,
      onClick: handleRowClick,
    },
    {
      field: "Tel",
      headerName: t["Tel"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Address",
      headerName: t["Address"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "Building",
      headerName: t["Building"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "profile",
      headerName: "",
      renderCell: renderProfile,
      minWidth: 50,
      headerClassName: "header-cell",
    },
    {
      field: "checkbox",
      headerName: "",
      renderCell: renderCheckboxCell,
      minWidth: 50,
      headerClassName: "header-cell",
    },
    // {
    //   field: "password",
    //   headerName: "Password",
    //   headerAlign: "left",
    //   minWidth: 200,
    //   renderCell: renderTextCell,
    //   headerClassName: "header-cell", // Apply the custom style to the header
    // },
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

  // const handleAddUser = (title) => {
  //   setAddTitle(title);
  //   // Open the modal when "Add" button is clicked
  //   setIsDialogOpen(true);
  // };

  const handleUserDetailsChange = async (newUserDetails) => {
    try {
      const apiUrl = `${url}/pos/addclients/${companyName}/${newUserDetails.name}`;

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
      const clientDetailsResponse = await fetch(
        `${url}/pos/getClientDetail/${companyName}/${newUserDetails.name}`
      );

      if (!clientDetailsResponse.ok) {
        throw new Error(`HTTP error! Status: ${clientDetailsResponse.status}`);
      }

      const clientDetailsData = await clientDetailsResponse.json();

      // Set the userDetails state with the details of the newly added user
      setClientDetails(clientDetailsData);
      setClientDetailsCopy(clientDetailsData);
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

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchClient(value);  
  };

  useEffect(() => {
    if (searchClient) {
      const filtered = clients.filter((client) => {
        return (
          client.AccName.toLowerCase().includes(searchClient.toLowerCase()) ||
          client.Tel.toLowerCase().includes(searchClient.toLowerCase()) ||
          client.Address.toLowerCase().includes(searchClient.toLowerCase()) ||
          client.Building.toLowerCase().includes(searchClient.toLowerCase())
        );
      });
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients); // Reset to initial clients when search is empty
    }
  }, [searchClient, clients]);

  const handleClear = () => {
    setSearchClient("");
  };

  return (
    <Box
      sx={{
        height: "92%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "10px",
        
      }}
    >
      <Box width="95%" height="8%" display="flex" justifyContent="flex-end" sx={{'@media (max-width: 1300px)': {
               marginBottom:'30px'
              },}} >
        <TextField
          label={t["Search"]}
          variant="standard"
          value={searchClient}
          onChange={handleSearch}
          onDoubleClick={() => {
            setInputValue("");
            setShowKeyboard(true);
          }}
          onFocus={() => {
            setActiveField("Search a client");
          }}
          InputLabelProps={{
            style: { fontSize: 25, fontWeight: "bold" }, // Adjust the font size of the label
          }}
          InputProps={{
            style: { fontSize: 18 },
            endAdornment: (
              <InputAdornment position="end">
                {searchClient && (
                  <IconButton onClick={handleClear}>
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>
      <ClientDetailsModal
        isOpen={isDetailsModalOpen}
        setIsDetailsModalOpen={setIsDetailsModalOpen}
        //setSelectedUserDetails={setSelectedUserDetails}
        clientDetails={clientDetails}
        setClientDetails={setClientDetails}
        clients={clients}
        setClients={setClients}
        companyName={companyName}
        clientDetailsCopy={clientDetailsCopy}
        setClientDetailsCopy={setClientDetailsCopy}
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
      />
      <DatagridTable
        rows={searchClient ? filteredClients : clients}
        columns={columns}
        getRowId={(row) => row.AccNo}
        // onSelectionModelChange={(newSelection) => {
        //   setSelectedRow(newSelection.selectedRow);
        // }}
        //selectionModel={selectedRow}
      ></DatagridTable>
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
        tickKey={tickKey}
        inputValue={inputValue}
        setInputValue={setInputValue}
        setTickKey={setTickKey}
      />
    </Box>
  );
};

export default ChartAcc;
