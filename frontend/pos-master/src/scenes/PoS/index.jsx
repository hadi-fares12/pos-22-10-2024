import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import { useState, useRef } from "react";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useEffect } from 'react';
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import NumericKeypad from './NumericKeybad';
import { format, lastDayOfDecade } from "date-fns";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import ModifierDialog from './ModifierDialaog';
import printJS from "print-js";
import FileSaver from "file-saver";
import { resolveBreakpointValues } from '@mui/system/breakpoints';
import { useRefresh } from '../RefreshContex';
import { useLocation, useNavigate } from "react-router-dom";
import KitchenDialog from './KitchenDialog';
import { preventDefault } from '@fullcalendar/core/internal';
import DelModal from './DelModal';
import QRCode from 'qrcode.react';
import { useMediaQuery,Dialog } from "@mui/material";
import ButtonBase from "@mui/material/ButtonBase";
import IngredDialog from './IngredDialog';
import AllowDialog from './AllowDialog';
import { display, height, width } from '@mui/system';
import RecallDialog from './RecallDialog';
import PaymentDialog from './PaymentDialog';
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
  
const PoS = ({
  companyName,
  branch,
  invType,
  isCollapsed,
  selectedRow,
  setSelectedRow,
  oldItemNo,
  newItemNo,
  username,
  isConfOpenDialog,
  setIsConfOpenDialog,
  isNav,
  setIsNav,
  pageRed,
  setSelectedTop,
  isOpenDel,
  setIsOpenDel,
  addTitle,
  setAddTitle,
  message,
  setMessage,
  filterValue,
  url,
  v,
  compPhone,
  compCity,
  compStreet,
  accno,
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
  compTime,
  searchClient,
  setSearchClient,tickKey,
                          inputValue,
                          setInputValue,
                          setTickKey, branchDes, allowRecall
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCategoryCode, setSelectedCategoryCode] = useState("");
  //const [quantity, setQuantity] = useState(1);
  const [categories, setCategories] = useState([]);
  const [mealsCopy, setMealsCopy] = useState([]);
  const [meals, setMeals] = useState([]);
  const [isNumericKeypadOpen, setNumericKeypadOpen] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [numericKeypadType, setNumericKeypadType] = useState("Discount");
  const [isModifierDialogOpen, setIsModifierDialogOpen] = useState(false);
  const [selectedMealForModify, setSelectedMealForModify] = useState();
  const [selectedMeals, setSelectedMeals] = useState([]);
  const [selectedModifiers, setSelectedModifiers] = useState([]);
  // const [message, setMessage] = useState("");
  const [srv, setSrv] = useState(0);
  const [discValue, setDiscValue] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const selectedTableId = searchParams.get("selectedTableId");
  const sectionNo = searchParams.get("sectionNo");
  // Ref for the last item in the list
  const lastItemRef = useRef(null);
  const [openIngred, setOpenIngred] = useState(false);
  const [nameCard, setNameCard] = useState("");
  const [ingredCard, setIngredCard] = useState("");
  const [closeTClicked, setCloseTClicked] = useState(false);
  const [curr, setCurr] = useState("");
  const [infCom, setInfCom] = useState({});
  const [defaultPrinter, setDefaultPrinter] = useState("");
  const [allowPrintInv, setAllowPrintInv] = useState("Y");
  const [allowPrintKT, setAllowPrintKT] = useState("Y");
  const [allowDialog, setAllowDialog] = useState(false);
  const [qtyPrintKT, setQtyPrintKT] = useState(1);
  const [prRemark, setPrRemark] = useState("");
  const [orderId, setOrderId] = useState();
  const [invN, setInvN] = useState();
  //const [newcurrDate, setNewCurrDate] = useState("");
  //const [newcurrTime, setNewCurrTime] = useState("");
  const [vat, setVat] = useState("");
  const [openRecall, setOpenRecall] = useState(false);
  const [invRecall, setInvRecall] = useState("");
  const [recallType, setRecallType] = useState(invType);
  const [renewInv, setRenewInv] = useState(false);
  const currentDate = new Date();
  let formattedDate = format(currentDate, "dd/MM/yyyy");
  const formattedTime = format(currentDate, "HH:mm:ss");
  const [recallDate, setRecallDate] = useState(formattedDate);
  const [recallTime, setRecallTime] = useState(formattedTime);
  const [payDialog, setPayDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [currency, setCurrency] = useState("USD");
  const [payInUSD, setPayInUSD] = useState(0);
  const [payInLBP, setPayInLBP] = useState(0);
  const [payOutUSD, setPayOutUSD] = useState(0);
  const [payOutLBP, setPayOutLBP] = useState(0);
  const [payInUSDVISA, setPayInUSDVISA] = useState(0);
  const [payInLBPVISA, setPayInLBPVISA] = useState(0);
  const [selectedAmounts, setSelectedAmounts] = useState([]);
  const [amountValue, setAmountValue] = useState(0);
  const { language } = useLanguage();
  const t = translations[language];
  const [isDisabled, setIsDisabled] = useState(false);
  const [authMessage, setAuthMessage] = useState(""); 
  const [openDialog, setOpenDialog] = useState(false);
  const handleCheckoutClick = () => {
    setOpenDialog(true); // Open the dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  // const [selectedButtons, setSelectedButtons] = useState({
  //   receipt: allowPrintInv,
  //   kt: allowPrintKT,
  // });

  // const handleToggle = (buttonName) => async() => {
  //   setSelectedButtons((prevState) => ({
  //     ...prevState,
  //     [buttonName]: 'Y' ? "N" : "Y", // Toggle the state
  //   }));
  //   setAllowPrintKT(p);
  //   setAllowPrintInv(selectedButtons["receipt"]);
  // };

  //console.log("Selecet", selectedButtons);
    console.log("allowww printt ktt", allowPrintKT);
   console.log("allow printttt reeeeeeeee", allowPrintInv);
  console.log("selected MEALSSSSS", selectedMeals)

  const handleCloseRecall = () => {
    setOpenRecall(false);
  }

  const handleClosePay = () => {
    setPayDialog(false);
  }
  const handlePayCheck = () => {
    setPayDialog(true);
  }
  const isSmallScreen = useMediaQuery('(max-width:1200px)');
// Function to get the tooltip message based on disabled state
const getDisabledMessage = () => {
  return isDisabled
    ? "Not authorized: cannot add or modify locked invoice."
    : "";
}

  // const handleRecall = () => {
  //   if (isNav) {
  //     if (allowRecall === "Y") {
  //       setOpenRecall(true);
  //     } else {
  //       setAllowDialog(true);
  //       setPrRemark("You have no permission to recall an invoice");
  //     }
  //   } else {
  //     setIsConfOpenDialog(true);
  //   } 
  // }
  const handleRecall = async () => {
    if (isNav) {
      try {
        // Fetch user data to get RecallInv
        const userDataResponse = await fetch(`${url}/pos/users/${companyName}`);
        const userData = await userDataResponse.json();
  
        // Check if RecallInv is "Y" for any user in the userData array
        const recallInv = userData.some(user => user.RecallInv === 'Y');
  
        if (recallInv) {
          setOpenRecall(true);
        } else {
          setAllowDialog(true);
          setPrRemark("You have no permission to recall an invoice");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setIsConfOpenDialog(true);
    }
  };
  

  const handleBack = async () => {
    if (isNav) {
      try {
        // Fetch user data to get RecallInv
        const userDataResponse = await fetch(`${url}/pos/users/${companyName}`);
        const userData = await userDataResponse.json();
  
        // Check if RecallInv is "Y" for any user in the userData array
        const recallInv = userData.some(user => user.RecallInv === 'Y');
  
        if (recallInv) {
          try {
            const response = await fetch(
              `${url}/pos/getBackInv/${companyName}/${recallType}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
              }
            );
  
            const data = await response.json();
  
            if (data.inv_list) {
              setSelectedMeals(data.inv_list);
              setMessage(data.invNo);
              console.log("aaaaaaaaaaaaaaa", data.inf);
              setSrv(data.inf.Srv);
              setDiscValue(data.inf.Disc);
              setOpenRecall(false);
              setRecallType(data.invType);
              setRecallDate(data.recallDate);
              setRecallTime(data.recallTime);
              setRenewInv(true);
  
              setPayInUSD(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return Number(totalAmount);
              });
  
              setPayOutUSD(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayOut" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return totalAmount;
              });
  
              setPayInLBP(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return totalAmount;
              });
  
              setPayOutLBP(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayOut" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return totalAmount;
              });
  
              setPayInUSDVISA(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod !== "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return totalAmount;
              });
  
              setPayInLBPVISA(() => {
                let totalAmount = 0;
  
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod !== "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
  
                return totalAmount;
              });
  
              setSelectedAmounts(
                () =>
                  data.payDetailList
                    .map((payDetail) => ({
                      payType: payDetail.PayType,
                      currency: payDetail.Currency,
                      amount: payDetail.Amount,
                      paymentMethod: payDetail.PaymentMethod,
                    }))
                    .filter(Boolean) // This filters out any false or undefined values
              );
  
              // Check LockAfterDone
              const lockAfterDone = userData.some(user => user.LockAfterDone === 'Y');

              if (data.invKind === "TABLE") {
                setIsDisabled(true); // Always disable the button for "TABLE"
                setAuthMessage("Invoice type 'TABLE' is locked and cannot be modified."); // Set appropriate message
              } else if (data.invKind === "TAKEAWAY" || data.invKind === "DELIVERY") {
                setIsDisabled(lockAfterDone); // Set disabled state based on LockAfterDone for TAKEAWAY or DELIVERY
                
                if (lockAfterDone) {
                  setAuthMessage("Not authorized: cannot add or modify locked invoice."); // Show auth message if locked
                } else {
                  setAuthMessage(""); // Clear message if authorized
                }
              } else {
                setIsDisabled(false); // Enable the button for other invoice types
                setAuthMessage(""); // Clear the auth message for non-relevant invoice kinds
              }
  
            } else {
              setAllowDialog(true);
              setPrRemark(data.message);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          setAllowDialog(true);
          setPrRemark("You do not have permission to retrieve an invoice.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setIsConfOpenDialog(true);
    }
  };
  
  const handleNext = async () => {
    if (isNav) {
      try {
        // Fetch user data to get RecallInv
        const userDataResponse = await fetch(`${url}/pos/users/${companyName}`);
        const userData = await userDataResponse.json();
  
        // Check if RecallInv is "Y" for any user in the userData array
        const recallInv = userData.some(user => user.RecallInv === 'Y');
  
        if (recallInv) {
          try {
            const response = await fetch(
              `${url}/pos/getNextInv/${companyName}/${recallType}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: message }),
              }
            );
  
            const data = await response.json();
  
            if (data.inv_list) {
              setSelectedMeals(data.inv_list);
              setMessage(data.invNo);
              setSrv(data.srv);
              setDiscValue(data.disc);
              setOpenRecall(false);
              setRecallType(data.invType);
              setRenewInv(true);
              setRecallDate(data.recallDate);
              setRecallTime(data.recallTime);
  
              // Handling payments
              setPayInUSD(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return Number(totalAmount);
              });
  
              setPayOutUSD(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayOut" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return totalAmount;
              });
  
              setPayInLBP(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return totalAmount;
              });
  
              setPayOutLBP(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod === "Cash" &&
                    payDetail.PayType === "PayOut" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return totalAmount;
              });
  
              setPayInUSDVISA(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod !== "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "USD"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return totalAmount;
              });
  
              setPayInLBPVISA(() => {
                let totalAmount = 0;
                data.payDetailList.forEach((payDetail) => {
                  if (
                    payDetail.PaymentMethod !== "Cash" &&
                    payDetail.PayType === "PayIn" &&
                    payDetail.Currency === "LBP"
                  ) {
                    totalAmount += Number(payDetail.Amount);
                  }
                });
                return totalAmount;
              });
  
              setSelectedAmounts(
                () =>
                  data.payDetailList
                    .map((payDetail) => ({
                      payType: payDetail.PayType,
                      currency: payDetail.Currency,
                      amount: payDetail.Amount,
                      paymentMethod: payDetail.PaymentMethod,
                    }))
                    .filter(Boolean) // This filters out any false or undefined values
              );
  
              // Check LockAfterDone
              const lockAfterDone = userData.some(user => user.LockAfterDone === 'Y');

              if (data.invKind === "TABLE") {
                setIsDisabled(true); // Always disable the button for "TABLE"
                setAuthMessage("Invoice type 'TABLE' is locked and cannot be modified."); // Set appropriate message
              } else if (data.invKind === "TAKEAWAY" || data.invKind === "DELIVERY") {
                setIsDisabled(lockAfterDone); // Set disabled state based on LockAfterDone for TAKEAWAY or DELIVERY
                
                if (lockAfterDone) {
                  setAuthMessage("Not authorized: cannot add or modify locked invoice."); // Show auth message if locked
                } else {
                  setAuthMessage(""); // Clear message if authorized
                }
              } else {
                setIsDisabled(false); // Enable the button for other invoice types
                setAuthMessage(""); // Clear the auth message for non-relevant invoice kinds
              }
  
            } else {
              // No invoice list found, show dialog
              setAllowDialog(true);
              setPrRemark(data.message);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        } else {
          setAllowDialog(true);
          setPrRemark("You do not have permission to proceed with the next invoice.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      setIsConfOpenDialog(true);
    }
  };
  
  const handleSubmitRecall = async() => {
    try {
          const response = await fetch(
            `${url}/pos/getRecallInv/${companyName}/${invRecall}/${invType}`
          );
          const data = await response.json();

           // Fetch user data to check LockAfterDone
        const userDataResponse = await fetch(`${url}/pos/users/${companyName}`);
        const userData = await userDataResponse.json();
        
        // Check LockAfterDone
        const lockAfterDone = userData.some(user => user.LockAfterDone === 'Y');
        

          if (data.inv_list) {
            setSelectedMeals(data.inv_list);
            setMessage(data.invNo);
            setSrv(data.srv);
            setDiscValue(data.disc);
            setOpenRecall(false);
            setRecallType(data.invType);
            setRenewInv(true);
            setIsDisabled(lockAfterDone); // Set disabled state based on LockAfterDone
            
           
        // Handle button state and authorization message based on invKind
      if (data.invKind === "TABLE") {
        setIsDisabled(true); // Always disable the button for "TABLE"
        setAuthMessage("Invoice type 'TABLE' is locked and cannot be modified."); // Set appropriate message
      } else if (data.invKind === "TAKEAWAY" || data.invKind === "DELIVERY") {
        setIsDisabled(lockAfterDone); // Set disabled state based on LockAfterDone for TAKEAWAY or DELIVERY
        
        if (lockAfterDone) {
          setAuthMessage("Not authorized: cannot add or modify locked invoice."); // Show auth message if locked
        } else {
          setAuthMessage(""); // Clear the message if authorized
        }
      } else {
        setIsDisabled(false); // Enable the button for other invoice types
        setAuthMessage(""); // Clear the auth message for non-relevant invoice kinds
      }

          } else {
            setRecallType(invType);
            setAllowDialog(true);
            setPrRemark(data.message);
          }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
  };
  
  
  const handleNewInv = () => {
    if (isNav) {
      setSelectedMeals([]);
      setFinalTotal(0);
      setDiscValue(0);
      setSrv(0);
      setRenewInv(false);
      setSelectedModifiers([]);
      setRenewInv(false);
      setRecallType(invType);
      setMessage("");
      setRecallDate(formattedDate);
      setRecallTime(formattedTime);
      setSelectedAmounts([]);
      setPayInLBP(0);
      setPayOutLBP(0);
      setPayInUSD(0)
      setPayOutUSD(0);
      setPayInUSDVISA(0);
      setPayInLBPVISA(0);
      setIsDisabled(false);
      setAuthMessage("");
    } else {
      setIsConfOpenDialog(true);
    }
  }

  const handleToggle = async (buttonName) => {
    let newStatus;
    if (buttonName === "kt") {
      newStatus = allowPrintKT === "Y" ? "N" : "Y";
      setAllowPrintKT(newStatus);
    } else if (buttonName === "receipt") {
      newStatus = allowPrintInv === "Y" ? "N" : "Y";
      setAllowPrintInv(newStatus);
    }

    try {
      const changePrint = await fetch(`${url}/pos/updatePrint/${companyName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          allowPrintInv: buttonName === "receipt" ? newStatus : allowPrintInv,
          allowPrintKT: buttonName === "kt" ? newStatus : allowPrintKT,
        }),
      });
      if (changePrint.ok) {
        console.log("Print updated successfully");
      } else {
        console.error("Failed to update print settings");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCloseAllow = () => {
    setAllowDialog(false);
  };
  // Function to scroll the last item into view
  const scrollToLastItem = () => {
    if (lastItemRef.current) {
      lastItemRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const prevSelectedMealsLength = useRef(selectedMeals.length);

  // Effect to scroll to the last item whenever a new item is added to selectedMeals
  useEffect(() => {
    if (selectedMeals.length > prevSelectedMealsLength.current) {
      scrollToLastItem();
      // Update the previous length to the current length
      prevSelectedMealsLength.current = selectedMeals.length;
    }
  }, [selectedMeals]);

  const handleConfCancel = async () => {
    setIsConfOpenDialog(false);
  };

  const handleConfKitchen = async() => {
    await handlePlace();
    setIsConfOpenDialog(false);
  };

  useEffect(() => {
    const handleAsync = async () => {
      if (closeTClicked && infCom.Pay === "N") {
        await handlePlace();
      }
    };
    handleAsync();
  }, [closeTClicked]);

  const handleP = () => {
    const unsentMeals = selectedMeals.filter((meal) => meal.Printed !== "p");
    if (unsentMeals.length > 0) {
      setAllowDialog(true);
      setPrRemark("You need to place order first")
    } else {
      printJS({
        printable: "myPrintableContent",
        type: "html",
        targetStyles: ["*"],
        documentTitle: "Receipt",
        honorColor: true,
        scanStyles: false,
        // style: `
        //   @media print {
        //     @page {
        //       marginLeft: 1mm;
        //     }
        //   }
        // `,
        header: null,
        footer: null,
        showModal: true,
        onError: (error) => {
          console.error("Printing error:", error);
        },
        onPrintDialogClose: () => {
          console.log("Print dialog closed");
        },
        printerName: defaultPrinter,
      });
    }
  }
  const handlePrint = async() => {
    if (allowPrintInv === "Y") {
        printJS({
          printable: "myPrintableContent",
          type: "html",
          targetStyles: ["*"],
          documentTitle: "Receipt",
          honorColor: true,
          scanStyles: false,
          // style: `
          //   @media print {
          //     @page {
          //       marginLeft: 1mm;
          //     }
          //   }
          // `,
          header: null,
          footer: null,
          showModal: true,
          onError: (error) => {
            console.error("Printing error:", error);
          },
          onPrintDialogClose: () => {
            console.log("Print dialog closed");
          },
          printerName: defaultPrinter,
        });
      
    } 
  };

  const { refreshNeeded, resetRefresh } = useRefresh();

  // Use the refreshNeeded state to trigger a refresh
  useEffect(() => {
    if (refreshNeeded) {
      // Perform actions to refresh data or components
      // For example, refetch data from the server
      loadItems();

      // Reset the refresh flag
      resetRefresh();
    }
  }, [refreshNeeded]);

  const loadItems = async () => {
    try {
      let ref;
      if (selectedCategoryCode) {
        // If a category is selected, fetch items for the selected category
        ref = `${url}/pos/categoriesitems/${companyName}/${username}/${selectedCategoryCode}`;
      } else {
        // Otherwise, fetch all items
        ref = `${url}/pos/allitems/${companyName}/${username}`;
      }
      const response = await fetch(ref);
      const data = await response.json();
    // Check if data is an array
    if (Array.isArray(data)) {
      setMeals(data);
    } else {
      console.error("Expected data to be an array but got:", data);
      setMeals([]);  // Set to empty array to avoid errors
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  }
  };

  const handleModify = (index) => {
    setSelectedMealForModify(index);
    // Open the modifier dialog
    setIsModifierDialogOpen(true);
  };
  const handleCloseModifierDialog = () => {
    // Close the modifier dialog
    setIsModifierDialogOpen(false);
  };

  const handleAddMod = () => {
    // Update the state with the modified selectedMeals array
    setSelectedMeals((prevSelectedMeals) =>
      prevSelectedMeals.map((meal) => {
        // Check if the meal has any chosenModifiers to update
        const correspondingChosenModifier = selectedModifiers.find(
          (item) => item.index === meal.index
        );

        // If corresponding chosenModifier is found, update the chosenModifiers for the meal
        if (correspondingChosenModifier) {
          const updatedModifiers = correspondingChosenModifier.modifiers.map(
            (modifier) => ({
              ItemNo: modifier.ItemNo,
              ItemName: modifier.ItemName,
            })
          );

          return {
            ...meal,
            chosenModifiers: updatedModifiers,
          };
        }
        return meal;
      })
    );
  };

  const handleOpenNumericKeypad = (type) => {
    setNumericKeypadType(type);
    setNumericKeypadOpen(true);
  };

  const handleCloseNumericKeypad = () => {
    setNumericKeypadOpen(false);
  };
  const handleSubmit = (value) => {
    // Handle the submitted discount value
    if (numericKeypadType === "Discount") {
      setDiscValue(value);
    } else if (numericKeypadType === "Service") {
      setSrv(value);
    } else if (numericKeypadType === "Amount") {
      console.log("ana bl amount", value);
      setAmountValue(Number(value));
    }
  };

  useEffect(() => {
    const copy = meals.map((meal, index) => ({
      ...meal,
      quantity: 1,
    }));
    setMealsCopy(copy);
  }, [meals]);

  useEffect(() => {
    fetchCategories();
    // Fetch categories when the component mounts
    fetchAllItems();

    fetchCur();

    fetchAllowPrint();

    fetchVAT();
  }, []);

  const fetchVAT = async () => {
    try {
      const response = await fetch(`${url}/pos/getVAT/${companyName}`);
      const data = await response.json();
      setVat(data["VAT"]);
    } catch (error) {
      console.error("Error fetching categoriesitems:", error);
    }
  }


  const fetchAllowPrint = async () => {
    try {
      const response = await fetch(`${url}/pos/getAllowPrint/${companyName}`);
      const data = await response.json();
      setDefaultPrinter(data["defaultPrinter"]);
      setAllowPrintKT(data["allowKT"]);
      setAllowPrintInv(data["allowInv"]);
      setQtyPrintKT(data["qtyPrintKT"]);
      // setSelectedButtons({
      //     receipt: data["allowInv"],
      //     kt: data["allowKT"]
      //   });
    } catch (error) {
      console.error("Error fetching categoriesitems:", error);
    }
  };

  const fetchCur = async () => {
    try {
      const response = await fetch(`${url}/pos/getCurr/${companyName}`);
      const data = await response.json();
      setCurr(data["Code"]); // Assuming your API response has a 'categories' property
      console.log("currency data", data);
      setInfCom(data);
    } catch (error) {
      console.error("Error fetching categoriesitems:", error);
    }
  };

  useEffect(() => {
    // Fetch items when selectedCategoryCode changes
    if (selectedCategoryCode !== "") {
      fetchItemsCategory();
    }
  }, [selectedCategoryCode]);

  useEffect(() => {
    // Update the selected meals to match the ItemNo in mealsCopy
    const updatedSelectedMeals = selectedMeals.map((meal) => {
      // Find the corresponding meal in mealsCopy based on a unique identifier
      const correspondingMeal = mealsCopy.find(
        (copyMeal) => copyMeal.ItemNo === newItemNo
      );
      if (correspondingMeal && meal.ItemNo === oldItemNo) {
        // If there is a corresponding meal and the meal's ItemNo matches the oldItemNo, update only the ItemNo
        return { ...meal, ItemNo: correspondingMeal.ItemNo };
      } else {
        // If no corresponding meal is found or the meal's ItemNo doesn't match the oldItemNo, return the original meal
        return meal;
      }
    });

    // Update the state with the updated selected meals
    setSelectedMeals(updatedSelectedMeals);
  }, [mealsCopy]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${url}/pos/categories/${companyName}`);
      const data = await response.json();
      setCategories(data); // Assuming your API response has a 'categories' property
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryClick = (category) => {
    if (category === "All") {
      fetchAllItems();
      setSelectedCategory("All");
      setSelectedCategoryCode("");
    } else {
      setSelectedCategory(category.GroupName);
      setSelectedCategoryCode(category.GroupNo);
    }
  };

  const handleOrderClick = (mealId, newQuantity) => {
    setMealsCopy((prevMealsCopy) =>
      prevMealsCopy.map((meal) =>
        meal.ItemNo === mealId ? { ...meal, quantity: 1 } : meal
      )
    );
    // Find the meal in mealsCopy
    const selectedMeal = mealsCopy.find((meal) => meal.ItemNo === mealId);
    setSelectedMeals((prevSelectedMeals) => [
      ...prevSelectedMeals,
      {
        ...selectedMeal,
        quantity: newQuantity,
        index: prevSelectedMeals.length,
      },
    ]);
  };

  const handleQuantityChange = (index, newQuantity) => {
    setSelectedMeals((prevSelectedMeals) =>
      prevSelectedMeals.map((meal) =>
        meal.index === index ? { ...meal, quantity: newQuantity } : meal
      )
    );

    // setMealsCopy((prevMealsCopy) =>
    //   prevMealsCopy.map((meal) =>
    //     meal.ItemNo === mealId ? { ...meal, quantity: newQuantity } : meal
    //   )
    // );
  };

  const handleQuantityChangeGrid = (mealId, newQuantity) => {
    setMealsCopy((prevMealsCopy) =>
      prevMealsCopy.map((meal) =>
        meal.ItemNo === mealId ? { ...meal, quantity: newQuantity } : meal
      )
    );
  };

  const fetchItemsCategory = async () => {
    try {
      const response = await fetch(
        `${url}/pos/categoriesitems/${companyName}/${username}/${selectedCategoryCode}`
      );
      const data = await response.json();
    // Check if data is an array
    if (Array.isArray(data)) {
      setMeals(data);
    } else {
      console.error("Expected data to be an array but got:", data);
      setMeals([]);  // Set to empty array to avoid errors
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  }
  };

  const fetchAllItems = async () => {
    try {
      const response = await fetch(`${url}/pos/allitems/${companyName}/${username}`);
      const data = await response.json();
      // Check if the response is an array before setting meals
      if (Array.isArray(data)) {
        setMeals(data);
      } else {
        console.error("Expected an array but received:", data);
        setMeals([]); // Set an empty array to avoid errors
      }
    } catch (error) {
      console.error("Error fetching categoriesitems:", error);
      setMeals([]); // Set an empty array on error to prevent runtime errors
    }
  };

  const calculateTotalDiscountedPrice = () => {
    let totalPrice = 0;

    selectedMeals.forEach((selectedMeal) => {
      // Use the selectedMeal directly from selectedMeals array
      const meal = selectedMeal;
      const price = meal.UPrice || 0;
      const quantity = meal.quantity || 0;
      const Disc = meal.Disc || 0;
      totalPrice += price * (1 - Disc / 100) * quantity;
    });

    return totalPrice.toFixed(2);
  };

  const calculateTotalTax = () => {
    let totalTax = 0;
    selectedMeals.forEach((selectedMeal) => {
      const meal = selectedMeal;
      const tax = meal.Tax || 0;
      totalTax += (meal.UPrice * (1 - meal.Disc / 100) * tax) / 100;
    });
    return totalTax.toFixed(2);
  };

  useEffect(() => {
    const newFinalTotal = totalFinal;

    setFinalTotal(newFinalTotal);
  }, [calculateTotalDiscountedPrice, discValue, calculateTotalTax]);

  const handleDelete = (mealCode) => {
    // Filter out the selectedMeal with the given mealCode
    const updatedSelectedMeals = selectedMeals.filter(
      (meal) => meal.index !== mealCode
    );

    // Find the meal with the given mealCode
    const deletedMeal = selectedMeals.find((meal) => meal.index === mealCode);

    // If the meal is found, set selectedModifiers to an empty array for that meal
    if (deletedMeal) {
      setSelectedModifiers((prevModifiers) => {
        const updatedModifiers = prevModifiers.filter(
          (modifier) => modifier.index !== mealCode
        );
        return updatedModifiers;
      });
    }

    // Update the state with the filtered array
    setSelectedMeals(updatedSelectedMeals);
  };

  useEffect(() => {
    const handleCh = async () => { 
     if (invN && orderId) {
        if (!selectedTableId || (selectedTableId && closeTClicked)) {
          await handlePrint();
       } 
       navigate(`/${v}/PoS`);
       setSelectedTop("Takeaway");
       if(allowPrintKT)
       setIsNav(true);
       setIsConfOpenDialog(false);
       setCloseTClicked(false);
       setSelectedModifiers([]);
       setSelectedMeals([]);
       setSelectedRow(null);
       setMealsCopy((prevMealsCopy) =>
         prevMealsCopy.map((meal) => ({ ...meal, quantity: 1 }))
       );
       setFinalTotal(0);
       setDiscValue(0);
       setSrv(0);
       
      }
    }
    handleCh();
  }, [invN, orderId]);

  let placeOrderCount = 0;
  const handlePlace = async () => {
    try {
      const currentDate = new Date();
      let formattedDate = format(currentDate, "dd/MM/yyyy");
      const realDate = format(currentDate, "dd/MM/yyyy");
      //setNewCurrDate(realDate);
      //let orderId;
      // No need to format the time, use currentDate directly
      // const compTimeRequest = await fetch(
      //   `${url}/pos/getCompTime/${companyName}`
      // );
      if (compTime) {
        // Extract the time components from the compTime string
        const [hours, minutes, seconds] = compTime.split(":").map(Number);

        // Create a new Date object with the company's end time
        const endTime = new Date();
        endTime.setHours(hours);
        endTime.setMinutes(minutes);
        endTime.setSeconds(seconds);

        // Create a new Date object with the current time
        const currentTime = new Date();

        // Check if the current time is between 12:00 AM and the company's end time
        if (
          currentTime.getHours() >= 0 && // Check if the current hour is after midnight
          currentTime.getHours() < hours && // Check if the current hour is before the end time hour
          (currentTime.getHours() !== hours || // Additional check for the hour
            currentTime.getMinutes() < minutes || // Check if current minutes are before the end time minutes
            (currentTime.getMinutes() === minutes && // Additional check for minutes
              currentTime.getSeconds() < seconds)) // Check if current seconds are before the end time seconds
        ) {
          formattedDate = currentDate;
          formattedDate.setDate(currentDate.getDate() - 1);
          formattedDate = formattedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
        }
        // else {
        //   const lastOrderIdDate = await fetch(
        //     `${url}/pos/getLastOrderIdDate/${companyName}`
        //   );
        //   if (lastOrderIdDate.ok) {
        //     const lastDate = await lastOrderIdDate.json();
        //     console.log("lastttt", lastDate);
        //     if (realDate > lastDate) {
        //       orderId = 1;
        //     } else {
        //       orderId = 0;
        //     }
        //   }
        // }
        // Encode the formatted date
        const formattedTime = format(currentDate, "HH:mm:ss");
        //setNewCurrTime(formattedTime);

        // Encode the formatted date
        const delivery =
          selectedRow && selectedRow["AccNo"] ? selectedRow["AccNo"] : "";
        const unsentMeals = selectedMeals.filter(
          (meal) => meal.Printed !== "p"
        );
        const requestBody = {
          date: formattedDate,
          time: formattedTime,
          discValue: discValue,
          srv: srv,
          meals: selectedMeals,
          branch: branch,
          invType: invType,
          closeTClicked: closeTClicked,
          tableNo: selectedTableId,
          unsentMeals: unsentMeals ? unsentMeals : selectedMeals,
          message: message,
          realDate: realDate,
          accno: delivery ? delivery : accno,
          qtyPrintKT: qtyPrintKT,
          username: username,
          invKind: selectedTableId
            ? "TABLE"
            : selectedRow
            ? "DELIVERY"
            : "TAKEAWAY",
          vat: vat,
          renewInv: renewInv,
          selectedAmounts: selectedAmounts
        };
        const response = await fetch(`${url}/pos/invoiceitem/${companyName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        // Check if the request was successful (status code 2xx)
        if (response.ok) {
          const responseData = await response.json();
          if (responseData["message"] === "Invoice items added successfully") {
            setRenewInv(false);
            setInvN(responseData["invoiceDetails"]["InvNo"]);
            setOrderId(responseData["invoiceDetails"]["OrderId"]);
            setRecallType(invType);
            setPaymentMethod("Cash");
            setPayInLBP(0);
            setPayOutLBP(0);
            setPayInUSD(0);
            setPayOutUSD(0);
            setPayInUSDVISA(0);
            setPayInLBPVISA(0);   
            setSelectedAmounts([]);
            if (allowPrintKT === "Y") {
              const jsonString = JSON.stringify(responseData, null, 2);
              const blob = new Blob([jsonString], { type: "application/json" });
              FileSaver.saveAs(blob, "response-data.json");

              // Increment the placeOrderCount
              placeOrderCount++;

              // Check if the placeOrderCount reaches 3
              if (placeOrderCount === 3) {
                // Reload the page after 3 placing orders
                setTimeout(() => {
                  window.location.reload();
                }, 3000);
              }
            }

            // if (!selectedTableId) {
            //   handlePrint();
            // }
          } else if (responseData["message"] === "Table closed") {
            setInvN(responseData["invoiceDetails"]["InvNo"]);
            setOrderId(responseData["invoiceDetails"]["OrderId"]);
          }
        }
        // Reset selectedMeals to an empty array
        // setSelectedModifiers([]);
        // setSelectedMeals([]);
        // setMealsCopy((prevMealsCopy) =>
        //   prevMealsCopy.map((meal) => ({ ...meal, quantity: 1 }))
        // );
        // setFinalTotal(0);
        // setDiscValue(0);
        // setSrv(0);
        // setSelectedRow({});
        // navigate(`/${v}/PoS`);
        // setSelectedTop("Takeaway");
        // setIsNav(true);
        // setIsConfOpenDialog(false);
        // setCloseTClicked(false);
      } else {
        console.error("Failed to place order:");
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const grossTotal = parseFloat(calculateTotalDiscountedPrice());
  const serviceValue = (grossTotal * srv) / 100;
  const discountValue = ((grossTotal + serviceValue) * discValue) / 100;
  const totalDiscount = (grossTotal + serviceValue) * (1 - discValue / 100);
  let totalTax = 0;
  if (selectedMeals && selectedMeals.length > 0) {
    const totalTaxSD =
      parseFloat(calculateTotalTax()) * (1 + srv / 100) * (1 - discValue / 100);
    const totall = ((serviceValue * vat) / 100) * (1 - discValue / 100);
    totalTax = totalTaxSD + totall;
  }
  const totalFinal = totalDiscount + totalTax;
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (location.search.includes("selectedTableId")) {
          const response = await fetch(
            `${url}/pos/getInv/${companyName}/${selectedTableId}/${username}`
          );
          const data = await response.json();
          if (data.inv_list) {
            setSelectedMeals(data.inv_list);
            setMessage(data.invNo);
            setSrv(data.srv);
            setDiscValue(data.disc);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [location.search]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsentMeals = selectedMeals.filter(
          (meal) => meal.Printed !== "p"
        );
        //if (location.search.includes("selectedTableId")) {
        if (unsentMeals.length > 0) {
          setIsNav(false);
        } else {
          setIsNav(true);
        }
        //}
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedMeals, location]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!location.search.includes("selectedTableId") && message) {
          const response = await fetch(
            `${url}/pos/resetUsedBy/${companyName}/${message}`
          );
          if (response.ok) {
            setSelectedMeals([]);
            setSelectedModifiers([]);
            setSrv(0);
            setDiscValue(0);
            setMessage("");
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location]);

  const handleCardClick = (mealName, mealIngred) => {
    setNameCard(mealName);
    setIngredCard(mealIngred);
    setOpenIngred(true);
  };

  const handleCloseCard = () => {
    setOpenIngred(false);
  };

  const isIpadPro = useMediaQuery("(min-width: 900px) and (max-width: 1300px)");

  console.log("infffff com", infCom);
  const getItemListTable = () => {
    const styles = {
      container: {
        height: "100%",
        width: "100%",
        padding: "16px",
        backgroundColor: "#fff",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      },
      header: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "2px solid #E5E7EB",
        paddingBottom: "12px",
        marginBottom: "16px",
        color: "#4CAF50", // Matching the green accent in the image
        fontWeight: "bold",
        fontSize: "16px",
      },
      row: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid #F1F1F1",
        padding: "12px 0",
        fontSize: "14px",
      },
      cell: {
        flex: "1",
        textAlign: "right",
        color: "#333",
      },
      descriptionCell: {
        flex: "2",
        textAlign: "left",
        color: "#333",
      },
      modifierRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        backgroundColor: "#F9FAFB",
        borderRadius: "6px",
      },
      modifierCell: {
        flex: "1",
        textAlign: "right",
      },
      descriptionModifierCell: {
        flex: "2",
        textAlign: "left",
        color: "#666",
      },

        // Mobile styles
    '@media (max-width: 1200px)': {
      container: {
        padding: "12px",
        
      },
      header: {
        flexDirection: "column", // Stack items vertically
        alignItems: "flex-start",
        fontSize: "14px",
        paddingBottom: "8px",
      },
      row: {
        flexDirection: "column", // Stack each row's items
        alignItems: "flex-start",
        padding: "8px 0",
      },
      cell: {
        textAlign: "left", // Align all text to the left
        fontSize: "12px",
      },
      descriptionCell: {
        textAlign: "left",
        fontSize: "12px",
      },
      modifierRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "6px 0",
      },
      modifierCell: {
        textAlign: "left",
        fontSize: "12px",
      },
    }
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.cell}>Qty</div>
          <div style={styles.descriptionCell}>Description</div>
          <div style={styles.cell}>Total</div>
        </div>
        <div>
          {selectedMeals.map((selectedMeal, index) => (
            <React.Fragment key={index}>
              {/* Meal row */}
              <div style={styles.row}>
                <div style={styles.cell}>{selectedMeal.quantity}</div>
                <div style={styles.descriptionCell}>
                  {selectedMeal.ItemName}
                </div>
                <div style={styles.cell}>
                  {(
                    (selectedMeal.UPrice -
                      (selectedMeal.UPrice * selectedMeal.Disc) / 100) *
                    selectedMeal.quantity
                  ).toFixed(2)}
                </div>
              </div>
              {/* Modifier rows */}
              {selectedMeal.chosenModifiers &&
                selectedMeal.chosenModifiers.map((modifier, modifierIndex) => (
                  <div
                    key={`${index}-${modifierIndex}`}
                    style={styles.modifierRow}
                  >
                    <div style={styles.modifierCell}></div>
                    <div style={styles.descriptionCell}>
                      {modifier.ItemName}
                    </div>
                    <div style={styles.modifierCell}></div>
                  </div>
                ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* First Box (70% width) */}
      {/* First Box (70% width) */}
        <Box
          sx={{
            width: `calc(${window.innerWidth}px - (${
              isCollapsed ? "33px" : "270px"
            } + ${window.innerWidth * 0.3}px))`,
            padding: "1%",
            height: "90%",
            display: "flex",
            flexDirection: "column",
          }}
          
        >
          {/* Filter Buttons with Icons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row", // Ensure horizontal layout
              overflowX: categories.length > 5 ? "auto" : "visible", 
              width: "100%",
              height: "16%",
              alignItems: "center",
              padding: "10px",
              // backgroundColor: "#f9f9f9",
              gap: "15px", // Add spacing between buttons
               borderRadius: "8px", // Rounded corners for the container
              paddingY: { xs: "10px", md: "20px" },
              // boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Shadow for the box
              '@media (min-width: 1200px)': {
                flexWrap: categories.length > 5 ? "nowrap" : "wrap", // Keep it in one row when more than 5 items
                justifyContent: categories.length > 5 ? "start" : "center", 
                height: "auto",
                padding: "10px",
                minWidth: "50px",
                paddingTop: "30px", // Padding above the section
                paddingBottom: "30px", // Padding below the section
                // boxShadow: "none",
              },
            }}
          >
            <Button
              sx={{
                fontWeight: "bold",
                fontSize: "1rem",
                padding: "20px 25px",
                backgroundColor:
                  selectedCategory === "All"
                    ? colors.greenAccent[500]
                    : colors.primary[500],
                color: selectedCategory === "All" ? colors.primary[500] : "black",
                borderRadius: "10px", // Round corners for card-like style
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Enhanced shadow
                transition: "background-color 0.3s, transform 0.2s", // Smooth transition
                minWidth: "150px",
                marginBottom: "10px", // Add margin-bottom for spacing when wrapped
                '&:hover': {
                  backgroundColor: colors.greenAccent[600], // Darker shade on hover
                  transform: "scale(1.05)", // Slightly enlarge on hover
                },
                '@media (min-width: 1200px)': {
                height: "100%",
                padding: "15px 25px",
                minWidth: "150px",
              },
                
              }}
              onClick={() => handleCategoryClick("All")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.GroupNo}
                sx={{
                  '@media (min-width: 1200px)': {
                    height: "100%",
                    padding: "15px 25px",
                    minWidth: "150px",
                  },
                  fontWeight: "bold",
                  fontSize: "1rem",
                  padding: "20px 25px",
                  backgroundColor:
                    selectedCategory === category.GroupName
                      ? colors.greenAccent[500]
                      : colors.primary[500],
                  color:
                    selectedCategory === category.GroupName
                      ? colors.primary[500]
                      : "black",
                      borderRadius: "10px", // Round corners
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Enhanced shadow
        transition: "background-color 0.3s, transform 0.2s", // Smooth transition
        minWidth: "150px", // Uniform width
        marginBottom: "10px", // Add margin-bottom for spacing when wrapped
        '&:hover': {
          backgroundColor: colors.greenAccent[600], // Darker shade on hover
          transform: "scale(1.05)", // Slightly enlarge on hover
        },
              
                }}
                onClick={() => handleCategoryClick(category)}
                
              >
                {category.GroupName}
              </Button>
            ))}
          </Box>
          
          {/* Cards in Grid Layout */}
          <div id="authorization-section">
                  {authMessage && (
                    <Typography
                      variant="body1" 
                      color="error" // MUI's built-in error color
                      sx={{
                        fontWeight: "bold", // Bold font
                        marginTop: 2,       // Adds top margin
                      }}
                    >
                      {authMessage}
                    </Typography>
                  )}
                </div>
          <Box sx={{ overflowY: "auto", height: "90%", width: "100%" , paddingTop: { xs: "10px", md: "20px", lg: "30px" }, // Adjust padding for different screen sizes
    '@media (min-width: 1200px)': {
      paddingTop: "30px", 
     
    },}}>
            <Grid
              container
              spacing={2}
              // Responsive Grid Layout
              sx={{
                // Additional media queries for better layout on small screens
                '@media (max-width: 700px)': {
                  justifyContent: 'center', // Align items to the center on small screens
                },
              }}
            >
              {filterValue
                ? mealsCopy
                    .filter((meal) =>
                      meal.ItemName.toLowerCase().includes(filterValue.toLowerCase())
                    )
                    .map((meal) => (
                      <Grid
                        item
                        xs={12}
                        sm={isCollapsed ? 6 : 12}
                        md={
                          isCollapsed
                            ? isIpadPro
                              ? 4 // iPad Pro collapsed
                              : 2.4 // Other devices collapsed
                            : isIpadPro
                            ? 6 // iPad Pro expanded
                            : 3 // Other devices expanded
                        }
                        key={meal.ItemNo}
                      >
                        <ButtonBase
                          sx={{
                            position: "relative",
                            height: "auto",
                            width: "100%",
                            // Added transition effect for smooth scaling on hover
                            transition: "transform 0.3s ease",
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                          onClick={() =>
                            handleCardClick(meal.ItemName, meal.Ingredients)
                          }
                        >
                          <Card
                            sx={{
                              height: "100%",
                              width: "100%",
                              "& .MuiCardContent-root:last-child ": {
                                paddingBottom: "5px",
                              },
                              "& .MuiCardContent-root": {
                                padding: "5px",
                              },
                              // Shadow effect on hover for emphasis
                              '&:hover': {
                                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                              },
                            }}
                          >
                            <CardMedia
                              component="img"
                              // Updated styles for better image scaling and centering
                              height="140"
                              image={
                                meal.Image
                                  ? `${process.env.PUBLIC_URL}/${companyName}/images/${meal.Image}`
                                  : `${process.env.PUBLIC_URL}/maxresdefault.jpg`
                              }
                              alt={`Meal ${meal.ItemNo}`}
                              sx={{
                                objectFit: 'cover', // Ensure image covers the entire area
                                borderRadius: '4px',
                              }}
                            />
                            {meal.Disc !== null && meal.Disc !== 0 && (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  position: "absolute",
                                  top: 0,
                                  right: 0,
                                  backgroundColor: "red",
                                  padding: "0.2rem 0.5rem",
                                  color: "#fff",
                                  fontSize: "1.4rem",
                                }}
                              >
                                <Typography>{`-${meal.Disc}%`}</Typography>
                              </Box>
                            )}
                            <CardContent
                              sx={{
                                height: "auto",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                              }}
                            >
                              <Typography variant="h4" noWrap >{meal.ItemName}</Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginTop: "0.5rem",
                                }}
                              >
                                <Typography variant="body2">
                                  {meal.Tax !== null && meal.Tax !== 0
                                    ? `${(
                                        meal.UPrice +
                                        meal.UPrice * (meal.Tax / 100)
                                      ).toFixed(2)} ${curr}`
                                    : `${meal.UPrice.toFixed(2)} ${curr}`}
                                </Typography>
                                <Button
                                  sx={{
                                    fontSize: "0.9rem",
                                    borderRadius: "20px",
                                    border: `2px solid ${colors.greenAccent[500]}`,
                                    color: colors.greenAccent[500],
                                    "&:hover": {
                                      backgroundColor: colors.greenAccent[500],
                                      color: colors.primary[500],
                                    },
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOrderClick(meal.ItemNo, meal.quantity);
                                  }}
                                >
                                  Choose
                                </Button>
                              </Box>
                            </CardContent>
                          </Card>
                        </ButtonBase>
                      </Grid>
                    ))
                : mealsCopy.map((meal) => (
                    <Grid
                      item
                      xs={12}
                      sm={isCollapsed ? 6 : 12}
                      md={
                        isCollapsed
                          ? isIpadPro
                            ? 4 // iPad Pro collapsed
                            : 2.4 // Other devices collapsed
                          : isIpadPro
                          ? 6 // iPad Pro expanded
                          : 3 // Other devices expanded
                      }
                      key={meal.ItemNo}
                    >
                      <ButtonBase
                        sx={{
                          position: "relative",
                          height: "auto",
                          width: "100%",
                          transition: "transform 0.3s ease",
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                        onClick={() =>
                          handleCardClick(meal.ItemName, meal.Ingredients)
                        }
                      >
                        <Card
                          sx={{
                            height: "100%",
                            width: "100%",
                            "& .MuiCardContent-root:last-child ": {
                              paddingBottom: "5px",
                            },
                            "& .MuiCardContent-root": {
                              padding: "5px",
                            },
                            '&:hover': {
                              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            },
                          }}
                        >
                          <CardMedia
                            component="img"
                            height="140"
                            image={
                              meal.Image
                                ? `${process.env.PUBLIC_URL}/${companyName}/images/${meal.Image}`
                                : `${process.env.PUBLIC_URL}/maxresdefault.jpg`
                            }
                            alt={`Meal ${meal.ItemNo}`}
                            sx={{
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                          {meal.Disc !== null && meal.Disc !== 0 && (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "red",
                                padding: "0.2rem 0.5rem",
                                color: "#fff",
                                fontSize: "1.4rem",
                              }}
                            >
                              <Typography>{`-${meal.Disc}%`}</Typography>
                            </Box>
                          )}
                          <CardContent
                            sx={{
                              height: "auto",
                              display: "flex",
                              flexDirection: "column",
                              justifyContent: "space-between",
                            }}
                          >
                            <Typography variant="h4" noWrap>{meal.ItemName}</Typography>
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginTop: "0.5rem",
                              }}
                            >
                              <Typography variant="body2">
                                {meal.Tax !== null && meal.Tax !== 0
                                  ? `${(
                                      meal.UPrice +
                                      meal.UPrice * (meal.Tax / 100)
                                    ).toFixed(2)} ${curr}`
                                  : `${meal.UPrice.toFixed(2)} ${curr}`}
                              </Typography>
                              <Button
                               disabled={isDisabled}
                                sx={{
                                  fontSize: "0.9rem",
                                  borderRadius: "20px",
                                  border: `2px solid ${colors.greenAccent[500]}`,
                                  color: colors.greenAccent[500],
                                  "&:hover": {
                                    backgroundColor: colors.greenAccent[500],
                                    color: colors.primary[500],
                                  },
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOrderClick(meal.ItemNo, meal.quantity);
                                }}
                              >
                                 {t["Choose"]}
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </ButtonBase>
                    </Grid>
                  ))}
            </Grid>
          </Box>
        </Box>

      {/* Second Box (30% width) */}

      <Box
        sx={{
          height: "100%",
          width: "30%",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          right: 0,
          overflowY: "auto", // Enable vertical scrolling
          '@media (max-width: 1100px)': {
            width: "30%",
          },
        }}
      >
        <Box sx={{
      height: "90%",
      backgroundColor: colors.primary[500],
      overflowY: "auto", // Enable vertical scrolling for this section
      '@media (max-width: 1200px)': {
        height: "80%",
      },
    }}>
          {/* Order Summary Box */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "10%",
              width: "100%",
              
            }}
          >
            <Box
              sx={{
                display: "flex",

                justifyContent: "space-between",
                fontWeight: "bold",
                //paddingLeft: "15px",
                flexDirection: "row",
               
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {selectedRow && selectedRow["AccName"]} {recallType}
                {"-"}
                {message && message}
              </Typography>
              
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {recallDate}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {recallTime}
              </Typography>
              {selectedMeals.length > 0 && (
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  L: {selectedMeals.length}
                </Typography>
              )}
            </Box>
            <Box borderBottom="1px solid #ccc" my={1}></Box>
          </Box>

          {/* ListCards */}

          <Box
            sx={{
              height: "90%",
              width: "100%",
              alignContent: "center",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              overflowY: "auto",
              
            
              // gap: theme.spacing(2), // Add some spacing between each ListCard
            }}
          >
            {selectedMeals.map((selectedMeal, index) => (
              <Box sx={{ width: "100%" }}>
                <Card
                  key={selectedMeal.index}
                  sx={{
                    background: selectedMeal.Printed
                      ? colors.redAccent[600]
                      : "inherit",
                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.5)",
                  }}
                >
                  <CardContent //sx={{ width: "100%" }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row",overflowX: "auto", // Allow horizontal scrolling on small screens
                     }}>
                      <Tooltip
                        title={
                          <span style={{ fontSize: "16px" }}>
                             {t["Messagecannotupdate"]}
                          </span>
                        }
                        disableHoverListener={!selectedMeal.Printed}
                      >
                        <IconButton
                          sx={{ width: "7%" }}
                          // sx={{ width: "10%" }}
                          onClick={
                            !selectedMeal.Printed
                              ? () => handleDelete(selectedMeal.index)
                              : () => {}
                          }
                        >
                          <DeleteOutlineOutlinedIcon
                            sx={{ fontSize: "30px" }}
                          />
                        </IconButton>
                      </Tooltip>
                      {/* Display the image here */}
                      {/* <Box
                        sx={{
                          height: "30%",
                          width: "20%",
                          alignItems: "center",
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <CardMedia
                          component="img"
                          height="50"
                          width="100%"
                          image={`${process.env.PUBLIC_URL}/${companyName}/images/${selectedMeal.Image}`}
                          alt={`Meal ${selectedMeal.ItemNo}`}
                        />
                      </Box> */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          //flex: "1", // Allow this box to take the available space
                          padding: "5px",
                          height: "100%",
                          width: "43%",
                         
                         
                        }}
                      >
                        <Typography
                          variant="h4"
                          style={{
                            display: "inline",
                            height: "20%",
                            width: "100%",
                          }}
                        >
                          {selectedMeal.ItemName}
                          {selectedMeal.Tax !== null &&
                            selectedMeal.Tax !== 0 && (
                              <Typography style={{ display: "inline" }}>
                                *
                              </Typography>
                            )}
                        </Typography>
                        <Typography
                          variant="h4"
                          color="text.secondary"
                          style={{ height: "10%", width: "100%" }}
                        >
                          {`${
                            selectedMeal.UPrice -
                            (selectedMeal.UPrice * selectedMeal.Disc) / 100
                          } ${curr}`}
                        </Typography>
                        {selectedMeal.chosenModifiers !== undefined && (
                          <Typography style={{ height: "50%", width: "100%"}}>
                            {selectedMeal.chosenModifiers.map(
                              (modifier, index) => (
                                <span key={index}>
                                  {index > 0 && ", "}{" "}
                                  {/* Add a comma if not the first modifier */}
                                  {modifier.ItemName}
                                </span>
                              )
                            )}
                          </Typography>
                        )}
                      </Box>

                      {/* Quantity and buttons */}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          width: "50%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                         
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            width: "30%",
                           
                          }}
                        >
                          <Tooltip
                            title={
                              <span style={{ fontSize: "16px" }}>
                                {t["Messagecannotupdate"]}
                              </span>
                            }
                            disableHoverListener={!selectedMeal.Printed}
                          >
                            <IconButton
                              onClick={
                                !selectedMeal.Printed
                                  ? () =>
                                      handleQuantityChange(
                                        selectedMeal.index,
                                        selectedMeal.quantity - 1
                                      )
                                  : () => {}
                              }
                            >
                              <RemoveCircleOutlineOutlinedIcon
                                sx={{ fontSize: "35px" }}
                              />
                            </IconButton>
                          </Tooltip>

                          <Typography variant="body1" sx={{ width: "25%" }}>
                            {selectedMeal.quantity}
                          </Typography>
                          <Tooltip
                            title={
                              <span style={{ fontSize: "16px" }}>
                                {t["Messagecannotupdate"]}
                              </span>
                            }
                            disableHoverListener={!selectedMeal.Printed}
                          >
                            <IconButton
                              //sx={{ width: "10%" }}
                              onClick={
                                !selectedMeal.Printed
                                  ? () =>
                                      handleQuantityChange(
                                        selectedMeal.index,
                                        selectedMeal.quantity + 1
                                      )
                                  : () => {}
                              }
                            >
                              <AddCircleOutlineOutlinedIcon
                                sx={{ fontSize: "35px" }}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        <Tooltip
                          title={
                            <span style={{ fontSize: "16px" }}>
                             {t["Messagecannotupdate"]}
                            </span>
                          }
                          disableHoverListener={!selectedMeal.Printed}
                        >
                          <IconButton
                            sx={{ width: "20%" }}
                            onClick={
                              !selectedMeal.Printed
                                ? () => handleModify(selectedMeal.index)
                                : () => {}
                            }
                          >
                            <AutoFixHighOutlinedIcon
                              sx={{ fontSize: "35px" }}
                            />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                {index === selectedMeals.length - 1 && (
                  <div ref={lastItemRef}></div>
                )}
              </Box>
            ))}
          </Box>
        </Box>
        {/* Final Box */}
        <Box  sx={{
      height: "35%",
      width: "100%",
      overflowY: "auto", // Enable vertical scrolling for the final box
      '@media (max-width: 1200px)': {
        height: "50%",
        width: "100%",
      },
    }}>
          <Card
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: colors.primary[400],
            
          
            }}
          >
            <CardContent
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflowY: 'auto', // Enable vertical scrolling
       
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "15%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "nowrap", // Prevent wrapping for horizontal scrolling
                  overflowX: 'auto', // Enable horizontal scrolling

                  '@media (max-width: 1200px)': {
                    height: "30%",
                    width: "100%",
                  },
      
                }}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "15%" }}
                  onClick={handleP}
                >
                 {t["Print"]}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "15%" }}
                  onClick={handleBack}
                  disabled={location.search.includes("selectedTableId")}
                >
                  <ArrowBackIcon />
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "15%" }}
                  onClick={handleRecall}
                  disabled={location.search.includes("selectedTableId")}
                >
                  {t["Recall"]}
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "15%" }}
                  onClick={handleNext}
                  disabled={location.search.includes("selectedTableId")}
                >
                  <ArrowForwardIcon />
                </Button>
                <Button
                  selected={allowPrintInv}
                  onClick={() => handleToggle("receipt")}
                  aria-label="print receipt"
                  sx={{
                    fontWeight: allowPrintInv === "Y" ? "bold" : "normal",
                    color: allowPrintInv === "Y" ? "white" : "black",
                    backgroundColor:
                      allowPrintInv === "Y"
                        ? colors.greenAccent[500]
                        : "lightgray",
                    "&:hover": {
                      backgroundColor:
                        allowPrintInv === "Y"
                          ? colors.greenAccent[500]
                          : "lightgray",
                    },
                    width: "15%",
                    borderRadius: "20px",
                    
                  }}
                >
                  {allowPrintInv === "Y" ? "Inv On" : "Inv Off"}
                </Button>
                <Button
                  selected={allowPrintKT}
                  onClick={() => handleToggle("kt")}
                  aria-label="print kt"
                  sx={{
                    fontWeight: allowPrintKT === "Y" ? "bold" : "normal",
                    color: allowPrintKT === "Y" ? "white" : "black",
                    backgroundColor:
                      allowPrintKT === "Y"
                        ? colors.greenAccent[500]
                        : "lightgray",
                    "&:hover": {
                      backgroundColor:
                        allowPrintKT === "Y"
                          ? colors.greenAccent[500]
                          : "lightgray",
                    },
                    width: "15%",
                    borderRadius: "20px",
                   
                  }}
                >
                  {allowPrintKT === "Y" ? "KT On" : "KT Off"}
                </Button>
                {/* <Typography variant="h4" fontWeight="bold">
                  Payment Summary
                </Typography> */}
                {location.search.includes("selectedTableId") && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ borderRadius: "20px", width: "25%" }}
                    onClick={() => {
                      const unsentMeals = selectedMeals.filter(
                        (meal) => meal.Printed !== "p"
                      );
                      if (unsentMeals.length > 0) {
                        setAllowDialog(true);
                        setPrRemark("You need to place order first");
                      } else {
                        if (infCom.Pay === "Y") {
                          handlePayCheck();
                        }
                        setCloseTClicked(true);
                      }
                      // : handlePayCheck();
                      
                    }}
                  >
                   {t["CloseTable"]}
                  </Button>
                )}
              </Box>
              {/* <Box
                sx={{
                  height: "9%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  '@media (max-width: 1200px)': {display:'none'}
                  
                               
                }}
              >
                <Typography variant="h4">{t["GrossTotal"]}</Typography>
                <Typography variant="h4">
                  {grossTotal} {curr}
                </Typography>
              </Box> */}
              {/* <Box
                sx={{
                  height: "15%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap", // Allow wrapping for small screens
                  '@media (max-width: 1200px)': {display:'none'}
               
                 
                }}
              >
                <Button
                  onClick={() => handleOpenNumericKeypad(t["Service"])}
                  disabled={isDisabled}
                  sx={{
                    width: "50%",
                    borderRadius: "20px",
                    border: `2px solid ${colors.greenAccent[500]}`,
                    color: colors.greenAccent[500],
                   
                    
                  }}
                >
                 {t["Service"]}
                </Button>
                <Typography variant="h4" sx={{'@media (max-width: 1200px)': {display:'none'}}}>{srv}%</Typography>
                <Typography variant="h4">
                  {serviceValue.toFixed(2)} {curr}
                </Typography>
              </Box> */}
              {/* <Box
                sx={{
                  height: "15%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap", // Allow wrapping for small screens
                  '@media (max-width: 1200px)': {
                    display:'none'
                    },
                }}
              >
                <Button
                  onClick={() => handleOpenNumericKeypad(t["Discount"])}
                  disabled={isDisabled}
                  sx={{
                    width: "50%",
                    borderRadius: "20px",
                    border: `2px solid ${colors.greenAccent[500]}`,
                    color: colors.greenAccent[500],
                
                  
                  }}
                >
                  {t["Discount"]}
                </Button>
                <Typography variant="h4">{discValue}%</Typography>
                <Typography variant="h4">
                  {discountValue.toFixed(2)} {curr}
                </Typography>
              </Box> */}
              {/* <Box
                sx={{
                  height: "9%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap", // Allow wrapping for small screens
                  '@media (max-width: 1200px)': {display:'none'}  
                }}
              >
                <Typography variant="h4">{t["Total"]}</Typography>
                <Typography variant="h4">
                  {totalDiscount.toFixed(2)} {curr}
                </Typography>
              </Box> */}
              {/* <Box
                sx={{
                  height: "9%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                
                }}
              >
                <Typography variant="h4" sx={{ width: "50%" }}>
                {t["Tax"]}
                </Typography>
                <Typography variant="h4">{vat}%</Typography>
                <Typography variant="h4">
                  {totalTax.toFixed(2)} {curr}
                </Typography>
              </Box> */}
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                {selectedTableId && `Table: ${selectedTableId}`}
              </Typography>
              <Box
                sx={{
                  height: "9%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap", // Allow wrapping for small screens
                  
                  
                }}
              >
                <Box sx={{ width: "45%" ,'@media (max-width: 1200px)': {
                    // height: "30%",
                    width: "100%",
                  }, }}>
                  <Typography variant="h4">{t["Total"]}</Typography>
                </Box>
                <Box>
                  <Typography variant="h4" sx={{'@media (max-width: 1200px)': {
                             width:"100%",
                    } }} >
                    {infCom.KD === "/"
                      ? (finalTotal / infCom.Rate).toLocaleString() + " USD"
                      : (finalTotal * infCom.Rate).toLocaleString() + " LBP"}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h4">
                    {finalTotal.toLocaleString()} {curr}
                  </Typography>
                </Box>
              </Box>
              {/* <NumericKeypad
                open={isNumericKeypadOpen}
                onClose={handleCloseNumericKeypad}
                onSubmit={handleSubmit}
                type={numericKeypadType}
              /> */}
              <Box
                sx={{
                  height: "25%",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flexWrap: "wrap", // Allow wrapping for small screens
          //         '@media (max-width: 1200px)': {
          //           marginTop:'30px'
          // },
                  
                }}
              >
                {/* <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "70%", height: "100%",  '@media (max-width: 1200px)': {
                              marginTop:'20px',display:'none'
                    }}}
                  disabled={isDisabled}
                  onClick={() => {
                    infCom.Pay === "Y" &&
                    !location.search.includes("selectedTableId")
                      ? handlePayCheck()
                      : handlePlace();
                  }}
                >
                  {t["PlaceOrder"]}
                </Button>{" "} */}
               
        <Button variant="contained" color="secondary" onClick={handleCheckoutClick} sx={{ borderRadius: "20px", width: "70%", height: "100%",  '@media (max-width: 1200px)': {
          marginTop:'30px',padding:'18px'
}}}>
          Checkout
        </Button>
      
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ borderRadius: "20px", width: "20%", height: "100%",'@media (max-width: 1200px)': {
                              marginTop:'30px',padding:'18px'
                    } }}
                  onClick={() => handleNewInv()}
                >
                  {t["New"]}
                </Button>
              </Box>
           

{/* Dialog for Checkout */}
<Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
  <Box sx={{ padding: 2 }}>
    <Box
      sx={{
        height: "9%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        '@media (max-width: 1200px)': {
          marginTop: '10px', // Example style for smaller screens
        },
      }}
    >
      <Typography variant="h4">{t["GrossTotal"]}</Typography>
      <Typography variant="h4">
        {grossTotal} {curr}
      </Typography>
    </Box>
    <Box
      sx={{
        height: "15%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        '@media (max-width: 1200px)': {
          // Additional styles for smaller screens
          marginTop: '10px',
        },
      }}
    >
      <Button
        onClick={() => handleOpenNumericKeypad(t["Service"])}
        disabled={isDisabled}
        sx={{
          width: "50%",
          borderRadius: "20px",
          border: `2px solid ${colors.greenAccent[500]}`,
          color: colors.greenAccent[500],
        }}
      >
        {t["Service"]}
      </Button>
      <Typography variant="h4">{srv}%</Typography>
      <Typography variant="h4">
        {serviceValue.toFixed(2)} {curr}
      </Typography>
    </Box>
    <Box
      sx={{
        height: "15%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        '@media (max-width: 1200px)': {
          marginTop: '10px', // Example style for smaller screens
        },
      }}
    >
      <Button
        onClick={() => handleOpenNumericKeypad(t["Discount"])}
        disabled={isDisabled}
        sx={{
          width: "50%",
          borderRadius: "20px",
          border: `2px solid ${colors.greenAccent[500]}`,
          color: colors.greenAccent[500],
        }}
      >
        {t["Discount"]}
      </Button>
      <Typography variant="h4">{discValue}%</Typography>
      <Typography variant="h4">
        {discountValue.toFixed(2)} {curr}
      </Typography>
    </Box>
    <Box
      sx={{
        height: "9%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        '@media (max-width: 1200px)': {
          marginTop: '10px', // Example style for smaller screens
        },
      }}
    >
      <Typography variant="h4">{t["Total"]}</Typography>
      <Typography variant="h4">
        {totalDiscount.toFixed(2)} {curr}
      </Typography>
    </Box>
    <Box
      sx={{
        height: "9%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
      }}
    >
      <Typography variant="h4" sx={{ width: "50%" }}>
        {t["Tax"]}
      </Typography>
      <Typography variant="h4">{vat}%</Typography>
      <Typography variant="h4">
        {totalTax.toFixed(2)} {curr}
      </Typography>
    </Box>
    <Box
      sx={{
        height: "9%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        '@media (max-width: 1200px)': {
          marginTop: '10px', // Example style for smaller screens
        },
      }}
    >
      <Box sx={{ width: "45%" }}>
        <Typography variant="h4">{t["Total"]}</Typography>
      </Box>
      <Box>
        <Typography variant="h4" sx={{
          '@media (max-width: 1200px)': {
            width: "100%", // Adjust width for smaller screens
          }
        }}>
          {infCom.KD === "/"
            ? (finalTotal / infCom.Rate).toLocaleString() + " USD"
            : (finalTotal * infCom.Rate).toLocaleString() + " LBP"}
        </Typography>
      </Box>
      <Box>
        <Typography variant="h4">
          {finalTotal.toLocaleString()} {curr}
        </Typography>
      </Box>
    </Box>
    <NumericKeypad
      open={isNumericKeypadOpen}
      onClose={handleCloseNumericKeypad}
      onSubmit={handleSubmit}
      type={numericKeypadType}
    />
    <Box
      sx={{
        height: "15%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: "16px",
        flexWrap: "wrap",
        '@media (max-width: 1200px)': {
          marginTop: '20px', // Example style for smaller screens
        },
      }}
    >
      <Button
        variant="contained"
        color="secondary"
        sx={{
          borderRadius: "20px",
          width: "100%",
          height: "100%",
        
        }}
        disabled={isDisabled}
        onClick={() => {
          infCom.Pay === "Y" &&
          !location.search.includes("selectedTableId")
            ? handlePayCheck()
            : handlePlace();
        }}
      >
        {t["PlaceOrder"]}
      </Button>{" "}
    </Box>
  </Box>
</Dialog>


            </CardContent>
          </Card>
        </Box>
      </Box>
      <Box id="myPrintableContent" sx={{ display: "none" }}>
        <div
          style={{
            textAlign: "center",
            width: "100%",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {/* Company Information */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              {companyName}
            </div>
            <div style={{ marginBottom: "5px" }}>Order {orderId}</div>

            {compPhone && <div style={{ marginTop: "5px" }}>{compPhone}</div>}
            <div style={{ marginTop: "5px" }}>
              {compStreet && compStreet}
              {compStreet && compCity && ", "}
              {compCity && compCity}
              {branchDes && <span> {branchDes}</span>}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "5px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ marginRight: "10px" }}>InvNo {invN}</div>
                <div>
                  {recallDate} {recallTime}
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Information */}
        </div>

        {getItemListTable()}
        <div>
          <div style={{ fontWeight: "bold" }}>Payment Summary</div>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>Gross Total:</div>
              <div>
                {grossTotal} {curr}
              </div>
            </div>
            {srv !== 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>Service:</div>
                <div>{srv}%</div>
                <div>
                  {serviceValue.toFixed(2)} {curr}
                </div>
              </div>
            )}
            {discValue !== 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>Discount:</div>
                <div>{discValue}%</div>
                <div>{discountValue.toFixed(2)}</div>
                <div>{curr}</div>
              </div>
            )}
            {totalDiscount !== 0 && (discValue !== 0 || srv !== 0) && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>Total:</div>
                <div>
                  {totalDiscount.toFixed(2)} {curr}
                </div>
              </div>
            )}
            {totalTax !== 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                }}
              >
                <div>Tax:</div>
                <div>{vat}%</div>
                <div>
                  {totalTax.toFixed(2)}
                  {curr}
                </div>
              </div>
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>Total:</div>
              {/* <div>{finalTotal}</div> */}
              <div>
                {infCom.KD === "/"
                  ? (finalTotal / infCom.Rate).toLocaleString() + " USD"
                  : (finalTotal * infCom.Rate).toLocaleString() + " LBP"}
              </div>
            </div>
          </div>
        </div>

        {selectedRow && Object.keys(selectedRow).length > 0 && (
          <div>
            <div style={{ fontWeight: "bold" }}>Client Address</div>
            {selectedRow["AccName"] !== "" && (
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", }}>
                <div>Name:</div>
                <div>{selectedRow["AccName"]}</div>
              </div>
            )}
            {selectedRow["Tel"] !== "" && selectedRow["Tel"] !== null && (
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", }}>
                <div>Tel:</div>
                <div>{selectedRow["Tel"]}</div>
              </div>
            )}
            {selectedRow["Address"] !== "" &&
              selectedRow["Address"] !== null && (
                <div
                  style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", }}
                >
                  <div>Address:</div>
                  <div>{selectedRow["Address"]}</div>
                </div>
              )}
            {selectedRow["Building"] !== "" &&
              selectedRow["Building"] !== null && (
                <div
                  style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", }}
                >
                  <div>Building:</div>
                  <div>{selectedRow["Building"]}</div>
                </div>
              )}
            {selectedRow["Street"] !== "" && selectedRow["Street"] !== null && (
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", }}>
                <div>Street:</div>
                <div>{selectedRow["Street"]}</div>
              </div>
            )}
            {selectedRow["GAddress"] !== "" &&
              selectedRow["GAddress"] !== null && (
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  <QRCode
                    value={`https://www.google.com/maps/place/${selectedRow["GAddress"]}`}
                  />
                </div>
              )}
          </div>
        )}

        <Typography variant="h5" style={{ textAlign: "center" }}>
          Thank you{username && `, you were served by ${username}`}
        </Typography>
      </Box>
      <ModifierDialog
        open={isModifierDialogOpen}
        onClose={handleCloseModifierDialog}
        companyName={companyName} // Pass the company name as a prop
        handleAddMod={handleAddMod}
        selectedMealForModify={selectedMealForModify}
        selectedModifiers={selectedModifiers}
        setSelectedModifiers={setSelectedModifiers}
        url={url}
      />
      <KitchenDialog
        open={isConfOpenDialog}
        onCancel={handleConfCancel}
        onConfirm={handleConfKitchen}
      ></KitchenDialog>
      <DelModal
        isOpenDel={isOpenDel}
        companyName={companyName}
        setIsOpenDel={setIsOpenDel}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        addTitle={addTitle}
        setAddTitle={setAddTitle}
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
      ></DelModal>
      {ingredCard && (
        <IngredDialog
          open={openIngred}
          onCancel={handleCloseCard}
          nameCard={nameCard}
          ingredCard={ingredCard}
        ></IngredDialog>
      )}
      <RecallDialog
        open={openRecall}
        onCancel={handleCloseRecall}
        onSubmit={handleSubmitRecall}
        setInvRecall={setInvRecall}
      ></RecallDialog>
      <AllowDialog
        open={allowDialog}
        onCancel={handleCloseAllow}
        nameCard={prRemark}
      ></AllowDialog>
      <PaymentDialog
        setPayDialog={setPayDialog}
        open={payDialog}
        onClose={handleClosePay}
        finalTotal={finalTotal}
        infCom={infCom}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        payInLBP={payInLBP}
        setPayInLBP={setPayInLBP}
        setPayOutLBP={setPayOutLBP}
        payOutLBP={payOutLBP}
        payInUSD={payInUSD}
        setPayInUSD={setPayInUSD}
        payOutUSD={payOutUSD}
        setPayOutUSD={setPayOutUSD}
        currency={currency}
        setCurrency={setCurrency}
        onClick={handlePlace}
        payInLBPVISA={payInLBPVISA}
        setPayInLBPVISA={setPayInLBPVISA}
        payInUSDVISA={payInUSDVISA}
        setPayInUSDVISA={setPayInUSDVISA}
        setCloseTClicked={setCloseTClicked}
        companyName={companyName}
        url={url}
        selectedAmounts={selectedAmounts}
        setSelectedAmounts={setSelectedAmounts}
        handleOpenNumericKeypad={handleOpenNumericKeypad}
        amountValue={amountValue}
        setAmountValue={setAmountValue}
      ></PaymentDialog>
    </>
  );
};

export default PoS;
