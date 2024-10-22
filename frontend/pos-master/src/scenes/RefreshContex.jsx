import React, { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export const useRefresh = () => useContext(RefreshContext);

export const RefreshProvider = ({ children }) => {
  const [refreshNeeded, setRefreshNeeded] = useState(false);

  const triggerRefresh = () => {
    setRefreshNeeded(true);
  };

  const resetRefresh = () => {
    setRefreshNeeded(false);
  };

  return (
    <RefreshContext.Provider
      value={{ refreshNeeded, triggerRefresh, resetRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
};
