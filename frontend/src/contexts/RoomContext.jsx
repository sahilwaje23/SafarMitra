import { createContext,useContext,useState } from "react";

export const RoomContext = createContext();

export const RoomContextProvider = ({children}) => {
    const [pickup, setPickup] = useState(null); // object 
    const [destination, setDestination] = useState(null);///object
    const [roomid, setRoomid] = useState(null);// room id
    const [creatorData, setCreatorData] = useState({
        creatorId: null,
        fullName: null,
        email: null,
        mobileNo: null,
        gender: null,
        rating: null,
        createdAt: null,
        updatedAt: null,
        socketId: null
    });//creator data 

    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fare, setFare] = useState(null);
    const [status, setStatus] = useState(null);
    const [mitra, setMitra] = useState([
        "mitraName"= null,
        "mitraRating" = null,
        "mitraId"
    ]);// array of object , each object has repective mitra data like id 
    const [driverid, setDriverid] = useState(null); // driver_id
    // participant limit 
    return (
        <RoomContext.Provider value={{ 
            pickup, setPickup,
            destination, setDestination,
            roomid, setRoomid,
            creatorData, setCreatorData,
            distance, setDistance,
            duration, setDuration,
            fare, setFare,
            status, setStatus,
            mitra, setMitra,
            driverid, setDriverid
         }}>
            {children}
        </RoomContext.Provider>
    )
}

export const useRoom = () => {
    return useContext(RoomContext);
}