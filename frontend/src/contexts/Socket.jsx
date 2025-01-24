import { io } from "socket.io-client";
import React, { createContext, useEffect } from "react";

export const SocketContext = createContext();

const socket = io("http://localhost:8000");

const SocketContextProvider = ({ children }) => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      localStorage.setItem("socket_id", socket.id);
    });

    socket.on("disconnect", () => console.log("Disconnected from server"));

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const sendMessage = (eventName, message) => {
    socket.emit(eventName, message);
  };

  const recieveMessage = () => {
    socket.on("message", (message) => {
      console.log(message);
    });
  };

  return (
    <SocketContext.Provider value={{ sendMessage, recieveMessage }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
