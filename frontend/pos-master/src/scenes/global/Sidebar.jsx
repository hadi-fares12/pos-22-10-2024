import React from "react";
import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { Box, IconButton, Typography, useTheme, Tooltip } from "@mui/material";
import { Link, redirect } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
// import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlinedIcon";
// import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlinedIcon";
// import PersonOutlinedIcon from "@mui/icons-material/PersonOutlinedIcon";
// import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlinedIcon";
// import HelpOutlinedIcon from "@mui/icons-material/HelpOutlinedIcon";
// import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlinedIcon";
// import PieChartOutlinedOutlinedIcon from "@mui/icons-material/PieChartOutlinedOutlinedIcon";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import SummarizeOutlinedIcon from "@mui/icons-material/SummarizeOutlined";
import StoreIcon from "@mui/icons-material/Store";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import PointOfSaleOutlinedIcon from "@mui/icons-material/PointOfSaleOutlined";
import { useNavigate } from "react-router-dom";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import PostAddOutlinedIcon from "@mui/icons-material/PostAddOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import ProductionQuantityLimitsOutlinedIcon from "@mui/icons-material/ProductionQuantityLimitsOutlined";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
import AllowDialog from '../PoS/AllowDialog';
import PersonIcon from '@mui/icons-material/Person';
import WelcomePage from "../form/welcomepage.jsx";
const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  setOpen,
  companyName,
  userControl,
  isNav,
  setIsConfOpenDialog,
  setIsAuthenticated,
  v,
  url,
  setOpenCash,
  setOpenEOD,
  username, isCollapsed,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language];
  const [prRemark, setPrRemark] = useState('');
  const [allowDialog, setAllowDialog] = useState(false);

  const FromDate = localStorage.getItem("FromDate");
  const ToDate = localStorage.getItem("ToDate");
  const is_within_year = localStorage.getItem("is_within_year");
  const handleCloseAllow = () => {
    setAllowDialog(false);
  };

  

  const handleManagePoS = () => {
    // console.log("ggggggggggggggggg", isNav)
    // if (isNav) {
    //   if (userControl === "N") {
    //     setOpen(true);
    //   } else {
    //     navigate("/ManagePoS");
    //   }
    // } else {
    //   setIsConfOpenDialog(true);
    // }
    
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/ManagePoS`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };

  const handleManageGroups = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/Groups`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };

  const handleComp = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/CompanyManagement`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };

  const handleUser = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/team`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };
  const handleStation = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/Station`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };
  const handleKitchen = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/Kitchen`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };

  const handleCurrency = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/Currency`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };
  
  const handleBranch = () => {
    if (userControl === "N") {
      setOpen(true);
    } else {
      if (isNav) {
        navigate(`/${v}/Branch`);
      } else {
        setIsConfOpenDialog(true);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const handleInvHis = () => {
    if (isNav) {
      navigate(`/${v}/journal`);
    } else {
      setIsConfOpenDialog(true);
    }
  };

  const handleDailySales = () => {
    if (isNav) {
      navigate(`/${v}/Daily`);
    } else {
      setIsConfOpenDialog(true);
    }
  };

  const handleCashOnHands = () => {
    if (isNav) {
      setOpenCash(true);
    } else {
      setIsConfOpenDialog(true);
    }
  };

  const handleEndOfDay = async () => {
    const getEODPermission = await fetch(
      `${url}/pos/getEODPermission/${companyName}/${username}`
    );
    const responseEODPer = await getEODPermission.json();
    if (isNav) {
      if (responseEODPer === "Y") {
        setOpenEOD(true);
      } else {
        setOpen(true);
      }  
    } else {
      setIsConfOpenDialog(true);
    }
  };

  const handleClick = () => {
    
    if (title === t["Manage Items"]) {
      if (localStorage.getItem("user_manage_items") === "Y") {
        handleManagePoS();
    } else {
        setOpen(true);
    }
    } else if (title === t["POS Screen"]) {
      
      if (localStorage.getItem("user_pos") === "Y") {
        const currentDate = new Date();
        const parseDate = (dateStr) => {
          const [day, month, year] = dateStr.split('/');
          return new Date(`${year}-${month}-${day}`); 
        };
        const beginningYearDate = parseDate(FromDate);
        const endYearDate = parseDate(ToDate);
        if (currentDate >= beginningYearDate && currentDate <= endYearDate) {
            navigate(`/${v}/PoS`);
        } else {
            setPrRemark(`POS section is disabled because the current date (${currentDate.toLocaleDateString()}) is outside the allowed range (${FromDate} - ${ToDate}).`);
            setAllowDialog(true);
        }
    }
     else {
        // setOpen(true);
        setPrRemark(`No Access permission to Pos`);
        setAllowDialog(true);
    }
    }else if (title === t["Manage Group Item"]) {
      if (localStorage.getItem("user_manage_group_items") === "Y") {
        handleManageGroups();
    } else {
        setOpen(true);
    }
    } else if (title === t["Company Management"]) {
      handleComp();
    } else if (title === t["User Settings"]) {
      handleUser();
    } else if (title === t["Station Settings"]) {
      handleStation();
    } else if (title === t["Kitchen"]) {
      handleKitchen();
    } else if (title === t["Currency"]) {
      handleCurrency();
    } else if (title === t["Logout"]) {
      handleLogout();
    } else if (title === t["Invoices History"]) {
      if (localStorage.getItem("user_inv_history") === "Y") {
        handleInvHis();
    } else {
        setOpen(true);
    }
    } else if (title === t["Daily Sales"]) {
      if (localStorage.getItem("user_daily_sales") === "Y") {
        handleDailySales();
    } else {
        setOpen(true);
    }
    } else if (title === t["Cash On Hands"]) {
      if (localStorage.getItem("user_cash_on_hands") === "Y") {
        handleCashOnHands();
    } else {
        setOpen(true);
    }
    } else if (title === t["End Of Day"]) {
      handleEndOfDay();
    } else if (title === t["Branch"]) {
      handleBranch();
    }
  };

  const menuItem = (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={handleClick}
      icon={icon}
    >
      <Box width="200px">
        <Typography>{title}</Typography>
      </Box>
    </MenuItem>
  );

  return (
    <>
      {isCollapsed ? (
        <Tooltip title={title} arrow>
          {menuItem}
        </Tooltip>
      ) : (
        menuItem
      )}
      <AllowDialog
        open={allowDialog}
        onCancel={handleCloseAllow}
        nameCard={prRemark}
      />
    </>
  );
};

const SubItem = ({
  title,
  icon,
  children,
  isCollapsed,
  handleSubItemClick,
  selected,
  setSelected,
  isNav, setIsConfOpenDialog,
}) => {
  const handleItemClick = () => {
    // Call the handler to open the sidebar and handle the SubItem click
    handleSubItemClick(title);
  };
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const subMenuContent = (
    <SubMenu
      onClick={handleItemClick}
      title={
        <Box>
          <Typography>{title}</Typography>
        </Box>
      }
      icon={icon}
      style={{
        color: colors.grey[100],
      }}
    >
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selected: child.props.title === selected,
          setSelected: setSelected,
          onClick: () => handleSubItemClick(child.props.title),
        })
      )}
      <style>
        {`
          .pro-arrow-wrapper {
            ${isCollapsed ? "display: none;" : ""}
          }
        `}
      </style>
    </SubMenu>
  );

  return isCollapsed ? (
    <Tooltip title={title} arrow>
      {subMenuContent}
    </Tooltip>
  ) : (
    subMenuContent
  );
};

const Sidebar = ({
  isCollapsed,
  isMobile,
  setIsCollapsed,
  setIsMobile,
  userControl,
  setOpen,
  companyName,
  isNav,
  setIsConfOpenDialog,
  setIsAuthenticated,
  v,
  url,
  setOpenCash,
  setOpenEOD, username
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  //const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  const { language } = useLanguage();
  const t = translations[language];

  const handleSubItemClick = (menuItem) => {
    if (isCollapsed) {
      setIsCollapsed(false); // Open the sidebar
    }

    // Handle the SubItem click as needed
    setSelected(menuItem);
  };
 
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // const handleResize = () => {
  //   setIsMobile(window.innerWidth <= 768);
  //   if (window.innerWidth > 768) {
  //     setIsCollapsed(false);
  //   } else {
  //             setIsCollapsed(true);

  //   }
  // };

  // const handleMenuToggle = () => {
  //   setIsCollapsed(!isCollapsed);
  // };

  // useEffect(() => {
  //   window.addEventListener("resize", handleResize);
  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);
  return (
    <Box
      sx={{
        
        //width: isCollapsed ? "5%" : "15%",
        position: isMobile && !isCollapsed ? "fixed" : "relative",
        zIndex: 1000, // Adjust the z-index to make sure it appears above other content
        //width: isCollapsed ? "auto" : "240px", // Adjust the width as needed
        height: isMobile && !isCollapsed ? "100%" : "auto", // Fixed height for mobile view
        overflowY: isMobile && !isCollapsed ? "auto" : "visible", // Make it scrollable on mobile

        "& .pro-sidebar-inner": {
          background: `${colors.primary[500]} !important`,
        },
        "& .pro-menu-item": {
          padding: "5px 5px 10px 10px !important",
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .react-slidedown.pro-inner-list-item": {
          color: `${colors.greenAccent[500]} !important`,
          display: isCollapsed ? "none" : "",
          // Add other styles as needed
        },

        "& .pro-inner-item:hover": {
          color: `${colors.greenAccent[500]} !important`,
        },
        "& .pro-menu-item.active": {
          color: `${colors.greenAccent[500]} !important`,
        },
        "& .pro-sub-menu .pro-inner-item.active": {
          color: `${colors.greenAccent[500]} !important`,
        },
         
        
        //position: (isMobile && !isCollapsed) ? "fixed" : "relative",
        //zIndex: 1000, // Adjust the z-index to make sure it appears above other content
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="circle">
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={
              isCollapsed && (
                <MenuOutlinedIcon style={{ color: colors.grey[100] }} />
              )
            }
          >
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "15px",
              }}
            >
              {!isCollapsed && (
                <>
                  <Box>
                    <Typography variant="h3" color={colors.grey[100]}>
                      {companyName}
                    </Typography>
                    
                    </Box>
                    
                  <Box
                    sx={{
                      "& .react-slidedown.pro-inner-list-item": {},
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        setIsCollapsed(!isCollapsed);
                      }}
                    >
                      <MenuOutlinedIcon />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          </MenuItem>
          <Box>
            {/* <Item
              icon={<HomeOutlinedIcon />}
              title="Dashboard"
              selected={selected}
              setSelected={setSelected}
              isNav={isNav}
              v={v}
            /> */}
             <MenuItem component={Link} to="/welcome" icon={<PersonIcon style={{ color: colors.grey[100] }}  />}>
            <Typography variant="h6" color={colors.grey[100]}>
              Welcome, {username}!
            </Typography>
          </MenuItem>
            <Item
              icon={<PointOfSaleOutlinedIcon />}
              title={t["POS Screen"]}
              selected={selected}
              setSelected={setSelected}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              isCollapsed={isCollapsed}
            />
              
            <Item
              icon={<PostAddOutlinedIcon />}
              title={t["Manage Items"]}
              selected={selected}
              setSelected={setSelected}
              setOpen={setOpen}
              userControl={userControl}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              isCollapsed={isCollapsed}
            />
            <Item
              icon={<PostAddOutlinedIcon />}
              title={t["Manage Group Item"]}
              selected={selected}
              setSelected={setSelected}
              setOpen={setOpen}
              userControl={userControl}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              isCollapsed={isCollapsed}
            />
            <Item
              icon={<ReceiptOutlinedIcon />}
              title={t["Invoices History"]}
              selected={selected}
              setSelected={setSelected}
              setOpen={setOpen}
              userControl={userControl}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              isCollapsed={isCollapsed}
            />
            <Item
              icon={<AssessmentOutlinedIcon />}
              title={t["Daily Sales"]}
              selected={selected}
              setSelected={setSelected}
              setOpen={setOpen}
              userControl={userControl}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              isCollapsed={isCollapsed}
            />
            {/* <SubItem
              title="Inventory Management"
              icon={<Inventory2OutlinedIcon />}
              isCollapsed={isCollapsed}
              handleSubItemClick={handleSubItemClick}
              selected={selected} // Pass selected to SubItem
              setSelected={setSelected}
            >
              <Item
                title="Items"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Purshase"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Sales Invoice"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Sales Return"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Purshase Return"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
            </SubItem> */}
            {/* <SubItem
              title="Accounting"
              icon={<AccountBalanceOutlinedIcon />}
              isCollapsed={isCollapsed}
              handleSubItemClick={handleSubItemClick}
              selected={selected} // Pass selected to SubItem
              setSelected={setSelected}
            >
              <Item
                title="Chart of Account"
                to="/Chart"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Journal Varchar"
                to="/journal"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Statement of Account"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Trial Balance"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
            </SubItem> */}
            {/* <SubItem
              title="Payment & Receivable"
              icon={<PaidOutlinedIcon />}
              isCollapsed={isCollapsed}
              handleSubItemClick={handleSubItemClick}
              selected={selected} // Pass selected to SubItem
              setSelected={setSelected}
            >
              <Item
                title="Payment Voucher"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Receipt Voucher"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
            </SubItem> */}
            {/* <SubItem
              title="Reports"
              icon={<SummarizeOutlinedIcon />}
              isCollapsed={isCollapsed}
              handleSubItemClick={handleSubItemClick}
              selected={selected} // Pass selected to SubItem
              setSelected={setSelected}
            >
              <Item
                title="Stocks Report"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
              <Item
                title="Accounting Reports"
                to="/team"
                selected={selected}
                setSelected={setSelected}
              />
            </SubItem> */}
            <Item
              icon={<CurrencyExchangeOutlinedIcon />}
              title={t["Cash On Hands"]}
              selected={selected}
              setSelected={setSelected}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              url={url}
              setOpenCash={setOpenCash}
              isCollapsed={isCollapsed}
            />
            <Item
              icon={<ScheduleOutlinedIcon />}
              title={t["End Of Day"]}
              selected={selected}
              setSelected={setSelected}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
              v={v}
              url={url}
              companyName={companyName}
              setOpenEOD={setOpenEOD}
              username={username}
              setOpen={setOpen}
              isCollapsed={isCollapsed}
            />
            <SubItem
              title={t["Company Settings"]}
              icon={<StoreIcon />}
              isCollapsed={isCollapsed}
              handleSubItemClick={handleSubItemClick}
              selected={selected} // Pass selected to SubItem
              setSelected={setSelected}
              setOpen={setOpen}
              userControl={userControl}
              isNav={isNav}
              setIsConfOpenDialog={setIsConfOpenDialog}
            >
              <Item
                title={t["Company Management"]}
                to="/CompanyManagement"
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
              <Item
                title={t["Station Settings"]}
                to="/Station"
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
              <Item
                title={t["User Settings"]}
                to="/team"
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
              <Item
                title={t["Kitchen"]}
                to="/Kitchen"
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
              <Item
                title={t["Branch"]}
                to="/Branch"
                selected={selected}
                setSelected={setSelected}
                setOpen={setOpen}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
              {/* <SubItem
                title="General Information"
                icon={<MenuOutlinedIcon />}
                isCollapsed={isCollapsed}
                handleSubItemClick={handleSubItemClick}
                selected={selected} // Pass selected to SubItem
                setSelected={setSelected}
              >
                <Item
                  title="Department Management"
                  to="/Department Management"
                  selected={selected}
                  setSelected={setSelected}
                /> */}
              <Item
                title={t["Currency"]}
                to="/Currency"
                selected={selected}
                setOpen={setOpen}
                setSelected={setSelected}
                userControl={userControl}
                isNav={isNav}
                setIsConfOpenDialog={setIsConfOpenDialog}
                v={v}
                isCollapsed={isCollapsed}
              />
                <Item
                  title="Table Settings"
                  to="/table-settings"
                  selected={selected}
                  setSelected={setSelected}
                  setOpen={setOpen}
                  userControl={userControl}
                  isNav={isNav}
                  setIsConfOpenDialog={setIsConfOpenDialog}
                  v={v}
                  isCollapsed={isCollapsed}
              />
              {/* </SubItem> */}
            </SubItem>
            <Item
              icon={<LogoutOutlinedIcon />}
              title={t["Logout"]}
              setIsAuthenticated={setIsAuthenticated}
              isCollapsed={isCollapsed}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;