import { createContext, useContext ,useState} from "react";


export const LocationContext = createContext();

const LocationContextProvider = ( {children} ) => {
    // added some default values for now 
    const [pickupLat,setPickupLat] = useState(19.0197148);
    const [pickupLng,setPickupLng] = useState(72.8437936);
    const [dropLat,setDropLat] = useState(19.0222181);
    const [dropLng,setDropLng] = useState(72.85612119999999);
    const [pickupText,setPickupText] = useState("Dadar Railway Station, Dadar, Mumbai, Maharashtra");
    const [dropText,setDropText] = useState("V.J.T.I., H R Mahajani Road, Matunga East, Mumbai, Maharashtra, India");
    const [roomid,setRoomid] = useState("");


    return (
        <LocationContext.Provider value={{pickupLat,setPickupLat,pickupLng,setPickupLng,dropLat,setDropLat,dropLng,setDropLng,pickupText,setPickupText,dropText,setDropText,roomid,setRoomid}} >

            {children}

        </LocationContext.Provider>
    )
    
}

export default LocationContextProvider;

// custom hook for Locations

const useLocations = () => {
    return useContext(LocationContext);
}