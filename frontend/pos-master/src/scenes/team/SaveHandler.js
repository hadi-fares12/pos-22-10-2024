const handleSave = async (
  companyName,
  userDetails,
  userDetailsCopy,
  setUsers,
  setSuccessMessage,
  setUserDetails,
  valMessage,
  url
) => {
  try {
    // Check if there is a validation message
    if (!valMessage) {
      const data = userDetailsCopy;

      // Send a POST request to save all edited fields
      const saveResponse = await fetch(
        `${url}/pos/users/${companyName}/${userDetails.id}`,
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

        // If save is successful, update userDetails to match userDetailsCopy
        setUserDetails(userDetailsCopy);
        setSuccessMessage(responseData.message);
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        console.error("Save failed");
      }
    } else {
      console.log("Validation error: ", valMessage);
    }
  } catch (error) {
    console.error("Error during save:", error);
  }
};

export { handleSave };
