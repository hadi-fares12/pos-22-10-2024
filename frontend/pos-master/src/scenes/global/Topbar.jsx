import { Box, IconButton, useTheme, Button, ListItem, ListItemText } from "@mui/material";
import { useContext, useState, useEffect } from "react";
import { ColorModeContext, tokens } from "../../theme"
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Sidebar from "./Sidebar";
import { useRefresh } from "../RefreshContex";
import { useNavigate, useLocation } from "react-router-dom";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { width } from "@mui/system";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const Topbar = ({
  isCollapsed,
  isMobile,
  setIsCollapsed,
  setIsMobile,
  currentRoute,
  isNav,
  setIsConfOpenDialog,
  setPageRed,
  companyName,
  selectedTop,
  setSelectedTop,
  isOpenDel,
  setIsOpenDel,
  setFilterValue,
  url,
  v, activeField,
  setActiveField,
  showKeyboard,
  setShowKeyboard, setInputValue, tickKey, setTickKey, inputValue, filterValue
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [secOrTab, setSecOrTable] = useState(`/${v}/Sections`);
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  const { triggerRefresh } = useRefresh();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRefreshClick = () => {
    triggerRefresh();
  };

  const handleMenuToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigate = useNavigate();
  const handleClick = () => {
    if (isNav) {
      navigate(`/${v}/PoS`);
      setSelectedTop("Takeaway");
    } else {
      setIsConfOpenDialog(true);
      setPageRed(`/${v}/PoS`);
    }
  };

  const handleChart = () => {
    setIsOpenDel(true);
  };

  const handleSections = () => {
    if (isNav) {
      navigate(secOrTab);
      setSelectedTop("Tables");
    } else {
      setIsConfOpenDialog(true);
      setPageRed(secOrTab);
    }
  };
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return currentTime.toLocaleDateString('en-GB', options);
  };
  useEffect(() => {
    const getLen = async () => {
      try {
        const response = await fetch(`${url}/pos/allsections/${companyName}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.section_list && data.section_list.length > 1) {
            setSecOrTable(`/${v}/Sections`);
          } else {
            const getsec = await fetch(
              `${url}/pos/getOneSection/${companyName}`
            );
            if (getsec.ok) {
              const sec = await getsec.json();
              const sectionNo = sec.sectionNo;
              setSecOrTable(`/${v}/Tables/${sectionNo}`);
            }
          }
        } else {
          console.error("Failed to fetch sections:", response.status);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    };
    getLen();
  }, []);

  return (
    <>
      {(currentRoute === `/${v}/PoS` ||
        currentRoute === `/${v}/Sections` ||
        location.pathname.includes("/Tables")) && (
        <Box
          sx={{
            width: currentRoute === `/${v}/PoS` ? "70%" : "100%",
            height: "50px",
            display: "flex",
            justifyContent: "space-around",
            "@media (max-width: 1200px)": {
              marginBottom:'10px'
            }, 
           
          }}
        >
          {/* <Box display="flex">
        {isMobile && isCollapsed && (
          <IconButton onClick={handleMenuToggle}>
            <MenuOutlinedIcon />
          </IconButton>
        )}
        <Box>
          {isMobile && !isCollapsed && (
            <Sidebar
              isCollapsed={isCollapsed}
              isMobile={isMobile}
              setIsCollapsed={setIsCollapsed}
              setIsMobile={setIsMobile}
            />
          )}
        </Box> */}
          <Box
            sx={{
              display: "flex",
              p: "2",
              width: "80%",
              margin: "2px",
              height: "100%",
              alignItems: "center",
              gap: "10px", // Add spacing between items
              "@media (max-width: 1200px)": {
              width: "100%",
              
            }, 
            }}
          >
            {/* <IconButton onClick={handleMenuToggle} >
            <MenuOutlinedIcon /> 
          </IconButton> */}
            {currentRoute === `/${v}/PoS` && (
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  backgroundColor: colors.primary[500],
                  borderRadius: "3px",
                  "@media (max-width: 1200px)": {
                    width: "60%",
                  }, 
                }}
              >
                <InputBase
                  sx={{ ml: 2, flex: 1,"@media (max-width: 1200px)": {
              width: "100%",
            }, }}
                  placeholder={t["Search"]}
                  onChange={(e) => setFilterValue(e.target.value)}
                  onDoubleClick={() => {
                    setInputValue("");
                    setShowKeyboard(true);
                  }}
                  onFocus={() => {
                    setActiveField("Search PoS");
                  }}
                  value={filterValue}
                />
                <IconButton type="button" sx={{ p: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Box>
            )}
            <Box sx={{ display: "flex", width: "70%", height: "100%", "@media (max-width: 1200px)": {
              width: "100%",
            },  }}>
              {(currentRoute === `/${v}/PoS` ||
                currentRoute === `/${v}/Chart` ||
                currentRoute === `/${v}/Sections` ||
                location.pathname.includes("/Tables")) && (
                <Button
                  onClick={handleClick}
                  sx={{
                    width: "30%",
                    display: "flex",
                    fontSize: "1rem",
                    fontWeight: "400",
                    backgroundColor:
                      selectedTop === "Takeaway"
                        ? colors.greenAccent[600]
                        : colors.grey[700],
                    color:
                      selectedTop === "Takeaway"
                        ? colors.primary[500]
                        : "black",
                    "&:hover": {
                      background: colors.greenAccent[500],
                      color: colors.primary[500],
                    },
                    "@media (max-width: 1200px)": {
              width: "100%",
            },
                  }}
                >
                  {t["TakeAway"]}
                </Button>
              )}
              {!location.search.includes("selectedTableId") &&
                currentRoute === `/${v}/PoS` && (
                  <Button
                    onClick={handleChart}
                    sx={{
                      width: "30%",
                      display: "flex",
                      fontSize: "1rem",
                      fontWeight: "400",
                      background:
                        selectedTop === "Delivery"
                          ? colors.greenAccent[600]
                          : colors.grey[700],
                      color:
                        selectedTop === "Delivery"
                          ? colors.primary[500]
                          : "black",
                      "@media (max-width: 1200px)": {
              width: "100%",
            },                          
                    }}
                  >
                    {t["Delivery"]}
                  </Button>
                )}
              {(currentRoute === `/${v}/PoS` ||
                currentRoute === `/${v}/Chart` ||
                currentRoute === `/${v}/Sections` ||
                location.pathname.includes("/Tables")) && (
                <Button
                  onClick={handleSections}
                  sx={{
                    width: "30%",
                    display: "flex",
                    fontSize: "1rem",
                    fontWeight: "400",
                    background:
                      selectedTop === "Tables"
                        ? colors.greenAccent[600]
                        : colors.grey[700],
                    color:
                      selectedTop === "Tables" ? colors.primary[500] : "black",
                    "&:hover": {
                      background: colors.greenAccent[500],
                      color: colors.primary[500],
                    },
                    "@media (max-width: 1200px)": {
              width: "100%",
            },
                  }}
                >
                  {t["Tables"]}
                </Button>
              )}
            </Box>
          </Box>
          <Box sx={{ width: "20%", marginRight: "auto", display: 'flex', alignItems: 'center', '@media (max-width: 1200px)': {
              display: 'none', // Hide on mobile
            }, }}>
            {currentRoute === `/${v}/PoS` && (
              <IconButton onClick={handleRefreshClick}>
                <RestoreOutlinedIcon />
              </IconButton>
            )}
               <Box sx={{
          ml: 2,
          color: colors.grey[300],
          fontSize: "1rem",
          fontWeight: "500",
          padding: "8px 12px", // Increased padding for better spacing
          borderRadius: "8px", // Rounded corners
          backgroundColor: colors.grey[800], // Subtle background color
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)", // Slight shadow for depth
          display: "flex",
          alignItems: "center", // Center the content
          gap: "4px" // Space between date and time
        }}>
          <span style={{ fontWeight: 'bold' }}>{getFormattedDate()}</span> {/* Bold for emphasis */}
          <span>{currentTime.toLocaleTimeString()}</span>
        </Box>

          </Box>
        </Box>
      )}
    </>
  );
};

export default Topbar;