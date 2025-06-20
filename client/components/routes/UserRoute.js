import { useState, useContext, useEffect } from "react";
import { UserContext } from "@/context";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "../Spinner";

const UserRoute = ({children}) => {
    const [ok, setOk] = useState(false);
    const router = useRouter();
    const [state] = useContext(UserContext);

    useEffect(() => {
        if(state && state.token) getCurrentUser();
    }, [state && state.token])

    const getCurrentUser = async () => {
        try {
        const {data} = await axios.get(`/currentuser`, {
        });
        if(data.ok) setOk(true);  
    } catch (error) {
        router.push("/login");    
    }
    };

    // Handle case where context is not yet loaded
  if (typeof window !== "undefined" && !state) {
    return <Spinner />;
  }

    return !ok ? (<Spinner /> ) : (<>{children}</>)
};

export default UserRoute;