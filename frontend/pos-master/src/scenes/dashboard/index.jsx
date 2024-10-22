import { Button, Box, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";

const Dashboard = ({v}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const handleNavigateHistory = () => {
    navigate(`/${v}/Journal`);
  };
  const handleNavigateDailySales = () => {
    navigate(`/${v}/Daily`);
  };

  return (
    <Box
      sx={{ width: "90%", height: "90%", display: "flex", justifyContent: "center", alignItems:"center" }}
    >
      <Button
        sx={{
          marginLeft: "2%",

          width: "30%",
          height: "30%",
          fontSize: "1.8rem",
          fontWeight: "bold",
          background: `${colors.blueAccent[800]}`,
        }}
        onClick={handleNavigateHistory}
      >
        Invoices History
      </Button>
      <Button
        sx={{
          marginLeft: "2%",
          width: "30%",
          height: "30%",
          fontSize: "1.8rem",
          fontWeight: "bold",
          background: `${colors.blueAccent[800]}`,
        }}
        onClick={handleNavigateDailySales}
      >
        Daily Sales
      </Button>
    </Box>
  );
};

export default Dashboard;
