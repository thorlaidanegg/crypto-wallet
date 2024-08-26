'use client';

import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export function ContextWrapper({ children }) {
    const [mnemonics, setMnemonics] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email,setEmail ] = useState("");

    return (
        <AppContext.Provider value={{ mnemonics, setMnemonics, isLoggedIn, setIsLoggedIn, email }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
