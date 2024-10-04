import { createContext, useContext, useState, useEffect, Children } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [sensorAlerts, setSensorAlerts] = useState(false); 
    const [prescriptionAlerts, setPrescriptionAlerts] = useState(false); 

    useEffect(() => {
        getCurrentUser()
        .then((res) => {
            if(res){
                setIsLogged(true);
                setUser(res);
            } else {
                setIsLogged(false);
                setUser(null);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
    }, []); // <-- Add the empty dependency array here

    

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                isLoading,
                sensorAlerts,
                setSensorAlerts,
                prescriptionAlerts,
                setPrescriptionAlerts,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalProvider;