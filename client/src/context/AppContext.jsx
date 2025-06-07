import { createContext, useState } from "react";
import { BACKEND_URL } from "../util/constants";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const getUserData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/profile`);

      if (response?.status === 200 && response?.data) {
        setUserData(response.data);
      } else {
        toast.error("Unable to retrieve the profile.");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to fetch user data.";
      toast.error(errMsg);
    }
  };

  const contextValue = {
    BACKEND_URL,
    setUserData,
    isUserLoggedIn,
    setIsUserLoggedIn,
    userData,
    getUserData,
  };
  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
};
