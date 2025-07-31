import { createContext, useState } from 'react';

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
    const [isProfile, setIsProfile] = useState(false)
    return (
        <UserContext.Provider value={{ isProfile, setIsProfile }}>
            {children}
        </UserContext.Provider>
    )
};

