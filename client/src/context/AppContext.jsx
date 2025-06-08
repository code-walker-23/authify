import { createContext, useEffect, useState, useCallback } from "react";
import { BACKEND_URL } from "../util/constants";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  axios.defaults.withCredentials = true;

  const getUserData = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/profile`);
      if (response?.status === 200 && response?.data) {
        setUserData(response.data);
      } else {
        throw new Error("No user data found");
      }
    } catch (error) {
      const errMsg =
        error?.response?.data?.message || "Failed to fetch user data.";
      toast.error(errMsg);
    }
  }, []);

  const getAuthState = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/is-authenticated`);
      if (response?.status === 200 && response?.data === true) {
        setIsUserLoggedIn(true);
        await getUserData();
      } else {
        setIsUserLoggedIn(false);
        setUserData(null);
      }
    } catch (error) {
      setIsUserLoggedIn(false);
      setUserData(null);
      const msg =
        error?.response?.data?.message || "Failed to verify authentication.";
      toast.error(msg);
    }
  }, [getUserData]);

  useEffect(() => {
    getAuthState();
  }, [getAuthState]);

  const contextValue = {
    BACKEND_URL,
    setUserData,
    isUserLoggedIn,
    setIsUserLoggedIn,
    userData,
    getUserData,
    getAuthState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
