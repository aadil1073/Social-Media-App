import axios from "axios";
import { createContext, useState, useEffect } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  useEffect(() => {
    const data = JSON.parse(window.localStorage.getItem("auth"));
    if (data) setState(data);
  }, []);

   // Set axios defaults when token changes
  useEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
    if (state?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [state?.token]);

  return (
    <UserContext.Provider value={[state, setState]}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
