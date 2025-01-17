import React, { createContext, useState } from "react";

export const EntityContext = createContext();

const EntityContextProvider = ({ children }) => {
  const [entity, setEntity] = useState({
    type: "",
    data: "",
  });

  return (
    <EntityContext.Provider value={{ entity, setEntity }}>
      {children}
    </EntityContext.Provider>
  );
};

export default EntityContextProvider;