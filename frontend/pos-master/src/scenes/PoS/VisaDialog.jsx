import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const VisaDialog = ({
  open,
  onClose,
  paymentMethod,
  setPaymentMethod,
  payType,
  setPayType,
  companyName,
  url
}) => {
  const [visaList, setVisaList] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const response = await fetch(`${url}/pos/Visa/${companyName}`);
        if (response.ok) {
          const data = await response.json();
          setVisaList(data);
        } else {
          console.error("Failed to fetch Visa details");
        }
      } catch (error) {
        console.error("Error during fetch:", error);
      }
    };
    fetchVisa();
  }, []);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: "1.5rem" }}>{t["SelectCardType"]}</DialogTitle>
      <DialogContent>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {
            visaList.map((item, index) => (
              <Button
                key={index}
                variant={paymentMethod === `${item} Card` ? "contained" : "outlined"}
                color="secondary"
                onClick={() => {
                  setPaymentMethod(`${item} Card`);
                  if (payType === "PayOut") {
                    setPayType("PayIn");
                  }
                  onClose();
                }}
              >
                {item}
              </Button>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VisaDialog;
