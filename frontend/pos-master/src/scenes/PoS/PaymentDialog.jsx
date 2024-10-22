import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  Typography,
} from "@mui/material";
import { fontWeight } from "@mui/system";
import VisaDialog from "./VisaDialog";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
const PaymentDialog = ({
  setPayDialog,
  open,
  onClose,
  finalTotal,
  infCom,
  paymentMethod,
  setPaymentMethod,
  payInLBP,
  setPayInLBP,
  payOutLBP,
  setPayOutLBP,
  payInUSD,
  setPayInUSD,
  payOutUSD,
  setPayOutUSD,
  payInLBPVISA1,
  currency,
  setCurrency,
  onClick,
  payInLBPVISA,
  setPayInLBPVISA,
  payInUSDVISA,
  setPayInUSDVISA,
  setTClicknyed,
  companyName,
  url,
  selectedAmounts,
  setSelectedAmounts,
  handleOpenNumericKeypad, amountValue, setAmountValue
}) => {
  const [payType, setPayType] = useState("PayIn");
  const [openVisaDialog, setOpenVisaDialog] = useState(false);
  const [currencyAmount, setCurrencyAmount] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        const fetchCurrencies = await fetch(
          `${url}/pos/getAllCurrencies/${companyName}`
        );
        const response = await fetchCurrencies.json();
        setCurrencyList(response);
        const fetchAmounts = await fetch(
          `${url}/pos/getAmountsCurrency/${companyName}/${currency}`
        );
        const responseAmount = await fetchAmounts.json();
        setCurrencyAmount(responseAmount);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAmounts(); // Call the function inside the useEffect
  }, [currency]); // Include companyName as a dependency if it can change

  const handleSubmit = () => {
    onClick();
    setPayDialog(false);
  };

  const ClearFields = () => {
    setSelectedAmounts([]);
    setPayInLBP(0);
    setPayOutLBP(0);
    setPayInUSD(0);
    setPayOutUSD(0);
    setPayInUSDVISA(0);
    setPayInLBPVISA(0);
    setPayType("PayIn");
    setCurrency("USD");
    setPaymentMethod("Cash");
  };

  const handlePresetAmount = (amount) => {
    if (paymentMethod === "Cash") {
      if (currency === "USD" && payType === "PayIn") {
        setPayInUSD((prev) => prev + amount);
      } else if (currency === "USD" && payType === "PayOut") {
        setPayOutUSD((prev) => prev + amount);
      } else if (currency === "LBP" && payType === "PayIn") {
        setPayInLBP((prev) => prev + amount);
      } else if (currency === "LBP" && payType === "PayOut") {
        setPayOutLBP((prev) => prev + amount);
      }
    } else {
      if (currency === "LBP" && payType === "PayIn") {
        setPayInLBPVISA((prev) => prev + amount);
      } else if (currency === "USD" && payType === "PayIn") {
        setPayInUSDVISA((prev) => prev + amount);
      }
    }
    // Add the selected amount to the list
    setSelectedAmounts((prev) => [
      ...prev,
      { payType, currency, amount, paymentMethod },
    ]);
  };

  const handleTextFieldChange = () => {
    // const { value } = event.target;
    const amount = parseFloat(amountValue) || 0;

    setSelectedAmounts((prev) => [
      ...prev,
      {
        currency: currency,
        payType: payType,
        paymentMethod: paymentMethod,
        amount: amount,
      },
    ]);

    if (paymentMethod === "Cash") {
      if (currency === "USD") {
        if (payType === "PayIn") {
          setPayInUSD((prev) => prev + amount);
        } else if (payType === "PayOut") {
          setPayOutUSD((prev) => prev + amount);
        }
      } else if (currency === "LBP") {
        if (payType === "PayIn") {
          setPayInLBP((prev) => prev + amount);
        } else if (payType === "PayOut") {
          setPayOutLBP((prev) => prev + amount);
        }
      }
    } else if (paymentMethod.includes("Card")) {
      if (currency === "USD" && payType === "PayIn") {
        setPayInUSDVISA((prev) => prev + amount);
      } else if (currency === "LBP" && payType === "PayIn") {
        setPayInLBPVISA((prev) => prev + amount);
      }
    }
  };

  const handleDecrement = (index) => {
    const { amount, payType, currency, paymentMethod } = selectedAmounts[index];

    setSelectedAmounts((prev) =>
      prev.filter(
        (item, idx) =>
          !(
            idx === index &&
            item.amount === amount &&
            item.payType === payType &&
            item.currency === currency &&
            item.paymentMethod === paymentMethod
          )
      )
    );

    if (paymentMethod === "Cash") {
      if (currency === "USD" && payType === "PayIn") {
        setPayInUSD((prev) => Math.max(prev - amount, 0));
      } else if (currency === "USD" && payType === "PayOut") {
        setPayOutUSD((prev) => Math.max(prev - amount, 0));
      } else if (currency === "LBP" && payType === "PayIn") {
        setPayInLBP((prev) => Math.max(prev - amount, 0));
      } else {
        setPayOutLBP((prev) => Math.max(prev - amount, 0));
      }
    } else {
      if (currency === "USD" && payType === "PayIn") {
        setPayInUSDVISA((prev) => Math.max(prev - amount, 0));
      } else if (currency === "LBP" && payType === "PayIn") {
        setPayInLBPVISA((prev) => Math.max(prev - amount, 0));
      }
    }
  };

  const handleCloseVisa = () => {
    setOpenVisaDialog(false);
  };

  const usdAmount = 
    infCom.KD === "*"
      ? (
          finalTotal -
          ((payInLBP - payOutLBP) / infCom.Rate +
            (payInUSD - payOutUSD) +
            payInLBPVISA / infCom.Rate +
            payInUSDVISA)
        ).toLocaleString()
      : (
          finalTotal / infCom.Rate -
          (payInUSD -
            payOutUSD +
            (payInLBP - payOutLBP) / infCom.Rate +
            (payInLBPVISA / infCom.Rate + payInUSDVISA))
        ).toLocaleString()
    ;
  
  const lbpAmount = 
    infCom.KD === "*"
      ? (
          finalTotal * infCom.Rate -
          ((payInUSD - payOutUSD) * infCom.Rate +
            (payInLBP - payOutLBP) +
            payInLBPVISA +
            payInUSDVISA * infCom.Rate)
        ).toLocaleString()
      : (
          finalTotal -
          ((payInUSD - payOutUSD) * infCom.Rate +
            (payInLBP - payOutLBP) +
            (payInUSDVISA * infCom.Rate + payInLBPVISA))
        ).toLocaleString()
    ;
  
  const numericAmount = (() => {
    if (payType === "PayOut") {
      if (currency === "USD") {
        return -1 * Number(usdAmount.toString().replace(/,/g, ""));
      } else if (currency === "LBP") {
        return -1 * Number(lbpAmount.toString().replace(/,/g, ""));
      }
    } else {
      if (currency === "USD") {
        return Number(usdAmount.toString().replace(/,/g, ""));
      } else if (currency === "LBP") {
        return Number(lbpAmount.toString().replace(/,/g, ""));
      }
    }
    return 0; // Default value
  })();

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth={true}
        maxWidth="md"
        sx={{
          "& .MuiDialog-paper": {
            width: "600px", // Set a fixed width
            height: "700px", // Set a fixed height
          },
        }}
      >
        <DialogTitle sx={{ fontSize: "1.5rem" }}>
         {t["SelectPaymentMethod"]} 
        </DialogTitle>
        <DialogContent>
          <Grid container direction="column" gap={1}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                {/* Payment Method: Cash / VISA */}
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      sx={{ fontSize: "1rem" }}
                      variant={
                        paymentMethod === "Cash" ? "contained" : "outlined"
                      }
                      color="secondary"
                      onClick={() => setPaymentMethod("Cash")}
                      fullWidth
                    >
                      {t["Cash"]}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      sx={{ fontSize: "1rem" }}
                      variant={
                        paymentMethod.includes("Card")
                          ? "contained"
                          : "outlined"
                      }
                      color="secondary"
                      onClick={() => setOpenVisaDialog(true)}
                      fullWidth
                    >
                      {t["VISACard"]}
                    </Button>
                  </Grid>
                </Grid>

                {/* Pay In / Pay Out */}
                <Grid container spacing={2} style={{ marginTop: "16px" }}>
                  <Grid item xs={6}>
                    <Button
                      sx={{ fontSize: "1rem" }}
                      variant={payType === "PayIn" ? "contained" : "outlined"}
                      color="secondary"
                      onClick={() => setPayType("PayIn")}
                      fullWidth
                    >
                     {t["PayIn"]}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      sx={{ fontSize: "1rem" }}
                      variant={
                        payType === "PayOut" && paymentMethod === "Cash"
                          ? "contained"
                          : "outlined"
                      }
                      color="secondary"
                      onClick={() => {
                        paymentMethod === "Cash" && setPayType("PayOut");
                      }}
                      fullWidth
                    >
                      {t["PayOut"]}
                    </Button>
                  </Grid>
                </Grid>

                {/* Currency: USD / LBP */}
                <Grid container spacing={1} style={{ marginTop: "16px" }}>
                  {currencyList.map((currencyItem) => (
                    <Grid item key={currencyItem.id} xs>
                      <Button
                        sx={{ fontSize: "1rem" }}
                        variant={
                          currency === currencyItem.Code
                            ? "contained"
                            : "outlined"
                        }
                        color="secondary"
                        onClick={() => setCurrency(currencyItem.Code)}
                        fullWidth
                      >
                        {currencyItem.Code}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    component="legend"
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                   {t["PaidUSD"]}
                  </FormLabel>
                  <Typography
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                    color="secondary"
                  >
                    {(payInUSD || payInUSDVISA) &&
                      (payInUSD + payInUSDVISA).toLocaleString() + " $"}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    component="legend"
                  >
                   { t["PaidLBP"]}
                  </FormLabel>
                  <Typography
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                    color="secondary"
                  >
                    {(payInLBP || payInLBPVISA) &&
                      (payInLBP + payInLBPVISA).toLocaleString() + " LBP"}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    component="legend"
                  >
                  {t ["USDOut"]}
                  </FormLabel>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {payOutUSD && payOutUSD.toLocaleString() + " $"}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    component="legend"
                  >
                  {t["LBPOut"]}
                  </FormLabel>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {payOutLBP && payOutLBP.toLocaleString() + " LBP"}
                  </Typography>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    component="legend"
                  >
                    {t["BalanceUSD"]}
                  </FormLabel>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {infCom.KD === "*"
                      ? (
                          finalTotal -
                          ((payInLBP - payOutLBP) / infCom.Rate +
                            (payInUSD - payOutUSD) +
                            payInLBPVISA / infCom.Rate +
                            payInUSDVISA)
                        ).toLocaleString() + " $"
                      : (
                          finalTotal / infCom.Rate -
                          (payInUSD -
                            payOutUSD +
                            (payInLBP - payOutLBP) / infCom.Rate +
                            (payInLBPVISA / infCom.Rate + payInUSDVISA))
                        ).toLocaleString() + " $"}
                  </Typography>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <FormLabel
                    sx={{ fontSize: "1rem", fontWeight: "bold" }}
                    component="legend"
                  >
                   {t["BalanceLBP"]}
                  </FormLabel>
                  <Typography
                    style={{
                      fontWeight: "bold",
                      color: "red",
                      fontSize: "1rem",
                    }}
                  >
                    {infCom.KD === "*"
                      ? (
                          finalTotal * infCom.Rate -
                          ((payInUSD - payOutUSD) * infCom.Rate +
                            (payInLBP - payOutLBP) +
                            payInLBPVISA +
                            payInUSDVISA * infCom.Rate)
                        ).toLocaleString() + " LBP"
                      : (
                          finalTotal -
                          ((payInUSD - payOutUSD) * infCom.Rate +
                            (payInLBP - payOutLBP) +
                            (payInUSDVISA * infCom.Rate + payInLBPVISA))
                        ).toLocaleString() + " LBP"}
                  </Typography>
                </div>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={2}>
                <Button
                  sx={{ fontSize: "1rem" }}
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    numericAmount > 0 && handlePresetAmount(numericAmount);
                  }}
                >
                  {numericAmount}
                </Button>
              </Grid>

              {currencyAmount.map((amount, index) => (
                <Grid item key={index} xs={2}>
                  <Button
                    sx={{ fontSize: "1rem" }}
                    fullWidth
                    variant="outlined"
                    onClick={() => {
                      const numericAmount = Number(
                        amount.toString().replace(/,/g, "")
                      );

                      handlePresetAmount(numericAmount);
                    }}
                  >
                    {amount.toLocaleString()}
                    {/* {currency === "USD"
                      ? `$${amount}`
                      : `${amount.toLocaleString()} LBP`} */}
                  </Button>
                </Grid>
              ))}
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      sx={{ fontSize: "1rem" }}
                      onChange={(event) => {
                        setAmountValue(event.target.value);
                      }}
                      label={`${payType} ${paymentMethod} ${currency}`}
                      value={amountValue}
                      fullWidth
                      margin="dense"
                      onDoubleClick={() => handleOpenNumericKeypad("Amount")}
                      InputLabelProps={{
                        sx: { fontSize: "1.2rem" }, // Adjusts the font size of the label
                      }}
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      sx={{ fontSize: "1rem" }}
                      onClick={handleTextFieldChange}
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      {t["Add"]}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                {selectedAmounts.map(({ amount }, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <TextField
                      sx={{ fontSize: "1rem" }}
                      onDoubleClick={() => handleDecrement(index)}
                      //onChange={(event) => handleTextFieldChange(event, index)}
                      label={`${selectedAmounts[index].payType} ${selectedAmounts[index].paymentMethod} (${selectedAmounts[index].currency})`}
                      value={amount}
                      fullWidth
                      margin="dense"
                      InputProps={{
                        readOnly: true,
                      }}
                      InputLabelProps={{
                        sx: { fontSize: "1.2rem" }, // Adjusts the font size of the label
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontSize: "1rem" }}
            variant="outlined"
            onClick={onClose}
          >
            {t["Cancel"]}
          </Button>
          <Button
            sx={{ fontSize: "1rem" }}
            variant="outlined"
            onClick={ClearFields}
          >
            {t["Clear"]}
          </Button>
          <Button
            sx={{ fontSize: "1rem" }}
            onClick={handleSubmit}
            variant="contained"
            color="secondary"
          >
            {t["SubmitPayment"]}
          </Button>
        </DialogActions>
      </Dialog>
      {openVisaDialog && (
        <VisaDialog
          open={openVisaDialog}
          onClose={handleCloseVisa}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          payType={payType}
          setPayType={setPayType}
          companyName={companyName}
          url={url}
        ></VisaDialog>
      )}
    </>
  );
};

export default PaymentDialog;
