import { createContext, useContext, useState } from "react";

export const LocationContext = createContext();

const LocationContextProvider = ({ children }) => {
  // added some default values for now
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropLat, setDropLat] = useState("");
  const [dropLng, setDropLng] = useState("");
  const [pickupText, setPickupText] = useState("");
  const [dropText, setDropText] = useState("");
  const [roomid, setRoomid] = useState("");
  const [driverLocation, setDriverLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  return (
    <LocationContext.Provider
      value={{
        pickupLat,
        setPickupLat,
        pickupLng,
        setPickupLng,
        dropLat,
        setDropLat,
        dropLng,
        setDropLng,
        pickupText,
        setPickupText,
        dropText,
        setDropText,
        roomid,
        setRoomid,
        driverLocation,
        setDriverLocation,
        directionsResponse,
        setDirectionsResponse,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContextProvider;

// custom hook for Locations

export const useLocations = () => {
  return useContext(LocationContext);
};
