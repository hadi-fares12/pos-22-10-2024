const handleSave = async (
  companyName,
  groupDetails,
  groupDetailsCopy,
  setSuccessMessage,
  setGroupDetails,
  setOldItemNo,
  setNewItemNo, url
) => {
  try {
    const data = groupDetailsCopy;
    // Send a POST request to save all edited fields
    const saveResponse = await fetch(
      `${url}/pos/updateGroups/${companyName}/${groupDetails.GroupNo}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    const responseData = await saveResponse.json();

    if (saveResponse.ok) {
      console.log("Save response:", responseData);
      setOldItemNo(responseData.oldItemNo);
      setNewItemNo(responseData.newItemNo);
      if (
        responseData.message !==
        "GroupNo already exists. Please choose another GroupNo."
      ) {
          // If save is successful, update userDetails to match userDetailsCopy
          setGroupDetails(groupDetailsCopy);
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
