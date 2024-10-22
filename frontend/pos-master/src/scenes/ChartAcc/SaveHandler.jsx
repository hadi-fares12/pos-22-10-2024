const handleSave = async (
  companyName,
  clientDetails,
  clientDetailsCopy,
  setSuccessMessage,
  setClientDetails,
  valMessage,
  url,
) => {
  try {
    const data = clientDetailsCopy;

    // Send a POST request to save all edited fields
    if (valMessage !== "Invalid email format") {
      const saveResponse = await fetch(
        `${url}/pos/updateClients/${companyName}/${clientDetails.AccNo}`,
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
        setClientDetails(clientDetailsCopy);
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
