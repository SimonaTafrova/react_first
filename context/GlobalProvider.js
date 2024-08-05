import { createContext, useContext, useState, useEffect, Children } from "react";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children }) => {
    const [isLoggedIn, setisLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [isLoading, setisLoading] = useState(true)
    return (
        <GlobalContext.Provider
        value = {{
                
        }}
        >
            {children}
           
        </GlobalContext.Provider>
    )
}