import { DriveFolderUploadSharp } from "@mui/icons-material";
import { createContext, useContext, useState } from "react";

export const RoomContext = createContext(null);
export const RoomContextProvider = ({ children }) => {
    const [pickup, setPickup] = useState(""); // just simple text
    const [destination, setDestination] = useState("");// just simple text 
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
        socketId: null,
        profileImage: null
    });//creator data 
    const [limit, setLimit] = useState(1);
    const [pcount, setPcount] = useState(1); //stores count of participants 
    const [distance, setDistance] = useState(null);
    const [duration, setDuration] = useState(null);
    const [fare, setFare] = useState(null);
    const [status, setStatus] = useState("open");
    //  open -> closed -> accepted -> ongoing -> completed
    const [mitra, setMitra] = useState([
        {
            mitraName: null,
            mitraRating: null,
            mitraId: null,
            mitraEmail: null,
            mobileNo: null,
            gender: null,
            rating: null,
            createdAt: null,
            updatedAt: null,
            socketId: null,
            profileImage: null
        }
    ]);// array of objects contain things like mitraName , mitraRating , mitraId and other general details 
    const [driverData, setDriverData] = useState({
        vehicleNo: null,
        driverId: null,
        fullName: null,
        mobileNo: null,
        rating: null,
        socketId: null,
        profileImage: null
    }); // driver data like name , rating , phone number , vehicle number stored as object
    // used specifically only when room is closed 
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
            driverData, setDriverData,
            pcount, setPcount
        }}>
            {children}
        </RoomContext.Provider>
    )
}

export const useRoom = () => {
    return useContext(RoomContext);
}