import React, { useEffect, useState } from "react";
import { Button,IconButton } from "@mui/material"; // Assuming you're using Material-UI
import { useNavigate } from "react-router-dom";
import logoVideo from './logovideo.mp4'; // Correct way to import the video
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";


const WelcomePage = () => {
  const navigate = useNavigate(); // Hook to navigate to other routes
  const v = "pointofsale";
  const FromDate = localStorage.getItem("FromDate");
  const ToDate = localStorage.getItem("ToDate");
  const [prRemark, setPrRemark] = useState(''); // To store the error message
  const [allowDialog, setAllowDialog] = useState(false); // To control dialog visibility



  // useEffect to handle navigation
  useEffect(() => {
    const currentDate = new Date();

    // Helper function to parse dates from "DD/MM/YYYY" format
    const parseDate = (dateStr) => {
      const [day, month, year] = dateStr.split('/');
      return new Date(`${year}-${month}-${day}`);
    };

    if (FromDate && ToDate) {
      const beginningYearDate = parseDate(FromDate);
      const endYearDate = parseDate(ToDate);

      // Check if the current date is within the allowed range
      if (currentDate >= beginningYearDate && currentDate <= endYearDate) {
        // Set a timer to navigate to PoS after 7 seconds
        const timer = setTimeout(() => {
          navigate(`/${v}/PoS`);
        }, 7000);

        // Cleanup the timer on unmount to avoid memory leaks
        return () => clearTimeout(timer);
      } else {
        // Show the error message if the date is outside the range
        setPrRemark(`POS section is disabled because the current date (${currentDate.toLocaleDateString()}) is outside the allowed range (${FromDate} - ${ToDate}).`);
        setAllowDialog(true); // Open the dialog with the message
      }
    }
  }, [navigate, v, FromDate, ToDate]);

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
       
      <video
        src={logoVideo}
        autoPlay
        loop
        muted
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      {/* Show dialog or message if outside date range */}
      {allowDialog && (
        <div style={{ position: 'absolute', backgroundColor: 'rgba(0, 0, 0, 0.7)', color: 'white', padding: '20px', borderRadius: '10px' }}>
          <p>{prRemark}</p>
          <Button onClick={() => setAllowDialog(false)} variant="contained" color="secondary">
            Close
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
