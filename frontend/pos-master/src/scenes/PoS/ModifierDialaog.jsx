import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CardMedia,
} from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { useLanguage } from "../LanguageContext";
import translations from "../translations";

const ModifierDialog = ({
  open,
  onClose,
  companyName,
  handleAddMod,
  selectedMealForModify,
  selectedModifiers,
  setSelectedModifiers,
  url,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [modifiers, setModifiers] = useState([]);
  //const [selectedModifiers, setSelectedModifiers] = useState([]);
  const { language } = useLanguage();
  const t = translations[language];
   

  useEffect(() => {
    // Fetch modifiers based on the company name
    fetchModifiers();
  }, []);

  const fetchModifiers = async () => {
    try {
      const response = await fetch(
        `${url}/pos/getModifiers/${companyName}`
      );
      const data = await response.json();
      setModifiers(data);
    } catch (error) {
      console.error("Error fetching modifiers:", error);
    }
  };

const handleChooseModifier = (modifier) => {
  setSelectedModifiers((prevSelectedModifiers) => {
    const isItemAlreadySelected = prevSelectedModifiers.some(
      (item) => item.index === selectedMealForModify
    );

    if (!isItemAlreadySelected) {
      // If the item is not already selected, add a new object to the array
      const newModifiersArray = [
        ...prevSelectedModifiers,
        {
          index: selectedMealForModify,
          modifiers: [modifier],
        },
      ];

      return newModifiersArray;
    }

    // If the item is already selected, check if the modifier is already present
    const updatedModifiersArray = prevSelectedModifiers.map((item) =>
      item.index === selectedMealForModify
        ? {
            ...item,
            modifiers: item.modifiers.some(
              (existingModifier) => existingModifier.ItemNo === modifier.ItemNo
            )
              ? item.modifiers.filter(
                  (existingModifier) =>
                    existingModifier.ItemNo !== modifier.ItemNo
                ) // If already present, remove the modifier
              : [...item.modifiers, modifier], // Otherwise, add the modifier
          }
        : item
    );

    return updatedModifiersArray;
  });
};


const handleConfirmSelection = () => {
  // console.log("selectedd Modifierssssssssssssssss", selectedModifiers);

  // Pass the flattened array of selected modifiers to the parent component
  handleAddMod();

  // Close the dialog
  onClose();
};


  return (
    <Modal
      open={open}
      onClose={onClose}
      companyName={companyName}
      BackdropProps={{ onClick: () => {} }}
      disableEscapeKeyDown
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "95%",
          height: "90%",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          backgroundColor: colors.primary[400],
          '@media (max-width: 1100px)': {
            width: "100%",
            height: "auto", 
            padding: "10px",
          },
        }}
      >
        <Box sx={{ height: "95%", width: "100%", overflow: "auto" , '@media (max-width: 1100px)': {
              height: "auto", // Adjust height for mobile
            },}}>
          <Grid container spacing={1} sx={{}}>
            {Array.isArray(modifiers) &&
              modifiers.map((modifier) => (
                <Grid item xs={12} sm={6} md={2} key={modifier.id}>
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
                      '@media (max-width: 1100px)': {
                        height: "auto",
                        marginBottom: "10px",
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="40%"
                      src={
                        modifier.Image
                          ? `${process.env.PUBLIC_URL}/${companyName}/images/${modifier.Image}`
                          : `${process.env.PUBLIC_URL}/maxresdefault.jpg`
                      }
                      alt={`Modifier ${modifier.ItemNo}`}
                    />
                    {/* <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "red", // Add your preferred styling
                    padding: "0.2rem 0.5rem",
                    color: "#fff",
                    fontSize: "1.4rem",
                  }}
                >
                  <Typography></Typography>
                </Box> */}
                    <CardContent
                      sx={{
                        height: "60%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        '@media (max-width: 1100px)': {
                          height: "auto",
                          
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          maxHeight: "60%",
                          width: "100%", // Full width of the Box
                          // overflow: "hidden", // Hide overflow
                          wordWrap: "break-word", // Allow long words to break
                          textOverflow: "ellipsis",
                          '@media (max-width: 1100px)': {
                            maxHeight: "none",
                            marginBottom: "10px",
                          },
                        }}
                      >
                        <Typography variant="h4">
                          {modifier.ItemName}
                        </Typography>
                        <Typography variant="body2"></Typography>
                      </Box>
                      <Box
                        sx={{
                          // display: "flex",
                          // justifyContent: "flex-end",
                          // flexDirection: "row",
                          height: "40%",
                          //width: "10%",
                          marginLeft: "auto",
                        }}
                      >
                        <Button
                          sx={{
                            fontSize: "0.9rem",
                            borderRadius: "20px",
                            border: `2px solid ${colors.greenAccent[500]}`,
                            color: colors.greenAccent[500],
                            "&:hover": {
                              backgroundColor: selectedModifiers.some(
                                (meal) =>
                                  meal.index === selectedMealForModify &&
                                  meal.modifiers.some(
                                    (selectedModifier) =>
                                      selectedModifier.ItemNo ===
                                      modifier.ItemNo
                                  )
                              )
                                ? colors.greenAccent[500]
                                : "inherit",
                              color: selectedModifiers.some(
                                (meal) =>
                                  meal.index === selectedMealForModify &&
                                  meal.modifiers.some(
                                    (selectedModifier) =>
                                      selectedModifier.ItemNo ===
                                      modifier.ItemNo
                                  )
                              )
                                ? colors.primary[500]
                                : colors.greenAccent[500],
                            },
                            backgroundColor: selectedModifiers.some(
                              (meal) =>
                                meal.index === selectedMealForModify &&
                                meal.modifiers.some(
                                  (selectedModifier) =>
                                    selectedModifier.ItemNo === modifier.ItemNo
                                )
                            )
                              ? colors.greenAccent[500] // Set background color to green for selected modifiers
                              : "inherit", // Set to default background color
                            color: selectedModifiers.some(
                              (meal) =>
                                meal.index === selectedMealForModify &&
                                meal.modifiers.some(
                                  (selectedModifier) =>
                                    selectedModifier.ItemNo === modifier.ItemNo
                                )
                            )
                              ? colors.primary[500] // Set background color to green for selected modifiers
                              : colors.greenAccent[500],
                          }}
                          onClick={() => handleChooseModifier(modifier)}
                        >
                          {selectedModifiers.some(
                            (meal) =>
                              meal.index === selectedMealForModify &&
                              meal.modifiers.some(
                                (selectedModifier) =>
                                  selectedModifier.ItemNo === modifier.ItemNo
                              )
                          )
                            ? t["Unchoose"] // If the modifier is selected, show "Unchoose"
                            : t["Choose"]}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Box>
        <Box sx={{ height: "5%" , '@media (max-width: 1100px)': {
              height: "10%", // Adjust for mobile
            }, }}>
          <Button
            marginLeft="auto"
            variant="h4"
            sx={{
              backgroundColor: colors.greenAccent[500],
              color: colors.primary[500],
              fontSize: "1rem",
              '@media (max-width: 1100px)': {
                fontSize: "0.8rem", // Adjust button font size for mobile
              },
            }}
            onClick={handleConfirmSelection}
          >
            {t["Close"]}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ModifierDialog;
