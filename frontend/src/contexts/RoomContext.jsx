import { createContext, useContext, useState } from "react";

export const RoomContext = createContext(null);

export const RoomContextProvider = ({ children }) => {
    const [pickup, setPickup] = useState({}); // object 
    const [destination, setDestination] = useState({});///object
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
    const [limit, setLimit] = useState(1);
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fare, setFare] = useState(null);
    const [status, setStatus] = useState("open");
    //  open -> closed -> accepted -> ongoing -> completed
    const [mitra, setMitra] = useState([
        {
            mitraName: null,
            mitraRating: null,
            mitraId: null
        }
    ]);// array of objects contain things like mitraName , mitraRating , mitraId
    const [driverid, setDriverid] = useState(null); // driver_id
    // participant limit 
    return (
        <RoomContext.Provider value={{
            pickup, setPickup,
            destination, setDestination,
            roomid, setRoomid,
            creatorData, setCreatorData,
            limit, setLimit,
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