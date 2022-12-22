import React, { createContext, useState } from "react";
import { AppContextInterface, NoderInterface } from "../interfaces";

export const AppContext = createContext<AppContextInterface | null>(null);

interface AppProviderInterface {
  children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderInterface) => {
  const [noders, setNoders] = useState<NoderInterface[]>([]);

  return (
    <AppContext.Provider value={{ noders, setNoders }}>
      {children}
    </AppContext.Provider>
  );
};
