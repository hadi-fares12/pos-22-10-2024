import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import StatSet from "./StatSet";
import Header from "../../components/Header";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";
const Station = ({ companyName, url }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { language } = useLanguage();
  const t = translations[language];
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [successMess, setSuccessMess] = useState();
  // const [kitchenDetails, setKitchenDetails] = useState([]);
  // const [kitchenDetailsCopy, setKitchenDetailsCopy] = useState([
  //   ...kitchenDetails,
  // ]);

  // const [unsavedChanges, setUnsavedChanges] = useState(false);
  // const [prList, setPrList] = useState([]);

  const modalStyle = {
    background: colors.whiteblack[100],
    boxShadow: 24,
    pt: 2, // Set top padding to 2
    pr: 2, // Set right padding to 3
    pb: 2, // Set bottom padding to 3
    pl: 2, // Set left padding to 3
    width: "90%",
    height: "90%",
    display: "flex",
    flexDirection: window.innerWidth < 650 ? "row" : "column",
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "10%",
        }}
      >
        <Box sx={{ pt: "2%", pl: "5%" }}>
          <Header title={t.stationSettings} />
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          height: "90%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            ...modalStyle,
          }}
        >
          <StatSet companyName={companyName} url={url} />
        </Box>
      </Box>
    </Box>
  );
};
export default Station;
