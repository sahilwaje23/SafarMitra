import React, { createContext, useState } from "react";
export const EntityContext = createContext();

const EntityContextProvider = ({ children }) => {
  const [entity, setEntity] = useState({
    type: null,
    data: null,
  });

  return (
    <EntityContext.Provider value={{ entity, setEntity }}>
      {children}
    </EntityContext.Provider>
  );
};

export default EntityContextProvider;