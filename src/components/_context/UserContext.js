import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null);

  return (
    <UserContext.Provider value={{ isAdmin, setIsAdmin }}>
      {children}
    </UserContext.Provider>
  );
};
