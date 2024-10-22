import {
  Box,
  Typography,
  useTheme,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddUserDialog from "../team/AddUserDialog";
import ItemDetailsModal from "./ItemDetailsModal";
import DatagridTable from "../DatagridTable";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import ClearIcon from "@mui/icons-material/Clear";

const ManagePoS = ({
  companyName,
  addTitle,
  setAddTitle,
  setOldItemNo,
  setNewItemNo,
  url,
  activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard, valMessage, setValMessage, 
  userName, setUserName,
  tickKey, setTickKey, inputValue, setInputValue, searchItem, setSearchItem
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pageSize, setPageSize] = useState(10);

  //const [companyName, setCompanyName] = useState("");
  const [items, setItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [successMess, setSuccessMess] = useState();
  const [itemDetails, setItemDetails] = useState({});
  const [itemDetailsCopy, setItemDetailsCopy] = useState({ ...itemDetails });  
  const [filteredItems, setFilteredItems] = useState([...items]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    // Read company_name from localStorage
    // const storedCompanyName = localStorage.getItem("company_name");
    // setCompanyName(storedCompanyName);

    // Fetch users based on the company name
    if (companyName) {
      fetch(`${url}/pos/allitemswithmod/${companyName}`)
        .then((response) => response.json())
        .then((data) => {
          // Ensure that data is an object with the 'initialState' property
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            console.error("Invalid data format received:", data);
          }
        })
        .catch((error) => console.error("Error fetching users", error));
    }
  }, [itemDetails]);

  const handleRowClick = (params) => {
    // Open the details modal and set the selected user details
    setIsDetailsModalOpen(true);
    setItemDetails(params.row);
    setItemDetailsCopy(params.row)
  };
  const renderTextCell = ({ value }) => {
    return <Typography variant="h4">{value}</Typography>;
  };

  const columns = [
    {
      field: "ItemNo",
      headerName: t["ItemNo"],
      headerAlign: "left",
      align: "left",
      minWidth: 100,
      flex: 1,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "ItemName",
      headerName: t["ItemName"],
      headerAlign: "left",
      align: "left",
      minWidth: 200,
      flex: 1,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
    {
      field: "GroupName",
      headerName: t["GroupName"],
      flex: 1,
      cellClassName: "name-column--cell",
      minWidth: 200,
      renderCell: renderTextCell,
      headerClassName: "header-cell", // Apply the custom style to the header
    },
  ];

  const handleAddItem = (title) => {
    setValMessage("");
    setAddTitle(title);
    // Open the modal when "Add" button is clicked
    setIsDialogOpen(true);
  };

  const handleItemDetailsChange = async (newItemDetails) => {
    try {
      const apiUrl = `${url}/pos/additems/${companyName}/${newItemDetails.name}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItemDetails),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      setSuccessMess(responseData.message);
      setTimeout(() => {
        setSuccessMess("");
      }, 8000);
      console.log("Response from the server:", responseData);

      // Fetch the details of the newly added user
      const itemDetailsResponse = await fetch(
        `${url}/pos/getItemDetail/${companyName}/${newItemDetails.name}`
      );

      if (!itemDetailsResponse.ok) {
        throw new Error(`HTTP error! Status: ${itemDetailsResponse.status}`);
      }

      const itemDetailsData = await itemDetailsResponse.json();

      // Set the userDetails state with the details of the newly added user
      setItemDetails(itemDetailsData);
      setItemDetailsCopy(itemDetailsData);
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

   const handleSearchItem = (event) => {
     const value = event.target.value;
     setSearchItem(value);

  };
  

  useEffect(() => {
    if (searchItem) {
      const filtered = items.filter((item) => {
        // Ensure the properties exist and are strings before calling includes
        const itemNo = item.ItemNo || "";
        const itemName = item.ItemName || "";
        const groupName = item.GroupName || "";

        return (
          itemNo.includes(searchItem) ||
          itemName.toLowerCase().includes(searchItem.toLowerCase()) ||
          groupName.toLowerCase().includes(searchItem.toLowerCase())
        );
      });
      setFilteredItems(filtered);
    } else {
      setFilteredItems(items); // Reset to initial items when search is empty
    }
  }, [searchItem, items]);


  const handleClear = () => {
    setSearchItem("");
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
          <Header title={t["manage_items"]} />
        </Box>
        <Box>
          <TextField
            label= {t["Search"]}
            variant="standard"
            value={searchItem}
            onChange={handleSearchItem}
            sx={{
              flexGrow: 1,
              mx: 2,
              "& .MuiInputLabel-root": { fontSize: { xs: 18, md: 25 } },
              "& .MuiInputBase-root": { fontSize: { xs: 14, md: 18 } },
            }}
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
                  {searchItem && (
                    <IconButton onClick={handleClear}>
                      <ClearIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{ fontSize: { xs: "0.9rem", md: "1.1rem" } }}
            onClick={() => handleAddItem(t["AddItemNumber"])}
          >
            {t["Add"]}
          </Button>
        </Box>
      </Box>
      <ItemDetailsModal
        isOpen={isDetailsModalOpen}
        setIsDetailsModalOpen={setIsDetailsModalOpen}
        itemDetails={itemDetails}
        setItemDetails={setItemDetails}
        items={items}
        setItems={setItems}
        companyName={companyName}
        setOldItemNo={setOldItemNo}
        setNewItemNo={setNewItemNo}
        itemDetailsCopy={itemDetailsCopy}
        setItemDetailsCopy={setItemDetailsCopy}
        url={url}
        activeField={activeField}
        setActiveField={setActiveField}
        showKeyboard={showKeyboard}
        setShowKeyboard={setShowKeyboard}
        valMessage={valMessage}
        setValMessage={setValMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
        tickKey={tickKey}
        setTickKey={setTickKey}
      />
      <DatagridTable
        rows={searchItem ? filteredItems : items}
        columns={[
          { field: "ItemNo", headerName: t["ItemNo"], flex: 1 },
          { field: "ItemName", headerName: t["ItemName"], flex: 1 },
          { field: "GroupName", headerName: t["GroupName"], flex: 1 },
        ]}
        handleRowClick={handleRowClick}
        getRowId={(row) => row.ItemNo}
      ></DatagridTable>
      <AddUserDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onAdd={handleItemDetailsChange}
        successMess={successMess}
        title={addTitle}
        setShowKeyboard={setShowKeyboard}
        activeField={activeField}
        setActiveField={setActiveField}
        userName={userName}
        setUserName={setUserName}
        valMessage={valMessage}
        setValMessage={setValMessage}
        inputValue={inputValue}
        setInputValue={setInputValue}
        tickKey={tickKey}
        setTickKey={setTickKey}
      />
    </Box>
  );
};

export default ManagePoS;
