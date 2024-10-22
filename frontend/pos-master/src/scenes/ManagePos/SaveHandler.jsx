const handleSave = async (
  companyName,
  itemDetails,
  itemDetailsCopy,
  setSuccessMessage,
  setItemDetails,
  setOldItemNo,
  setNewItemNo,
  url
) => {
  try {
    
  const data = itemDetailsCopy;
   const isImageSame =
     itemDetails["Image"] === itemDetailsCopy["Image"];
    let existedImage;
   // If the image is the same, include the existedImage field with value 1
   if (isImageSame) {
     existedImage = 1;
   } else {
     existedImage = 0;
   }
    // Send a POST request to save all edited fields
    const saveResponse = await fetch(
      `${url}/pos/updateItems/${companyName}/${itemDetails.ItemNo}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data, existedImage }),
      }
    );
    const responseData = await saveResponse.json();

    if (saveResponse.ok) {
      console.log("Save response:", responseData);
      setOldItemNo(responseData.oldItemNo);
      setNewItemNo(responseData.newItemNo);
      if (
        responseData.message !==
        "ItemNo already exists. Please choose another ItemNo."
      ) {
        // If save is successful, update userDetails to match userDetailsCopy
        setItemDetails(itemDetailsCopy);
      }
        
      setSuccessMessage(responseData.message);
      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } else {
      console.error("Save failed");
    }
  } catch (error) {
    console.error("Error during save:", error);
  }
};

export { handleSave };
