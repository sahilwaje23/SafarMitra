import { createContext, useContext, useState } from "react";

export const RoomContext = createContext(null);
export const RoomContextProvider = ({ children }) => {
  const [pickup, setPickup] = useState(""); // just simple text
  const [destination, setDestination] = useState(""); // just simple text
  const [roomid, setRoomid] = useState(null); // room id
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
    profileImage: null,
  }); //creator data
  const [limit, setLimit] = useState(1);
  const [pcount, setPcount] = useState(1); //stores count of participants
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [fare, setFare] = useState(null);
  const [status, setStatus] = useState("open");
  const [isSearching, setIsSearching] = useState(false);
  const [otp, setOtp] = useState(null);
  const [messages, setMessages] = useState([]); // Array of chat messages
  //  open -> closed -> accepted -> ongoing -> completed
  const [mitra, setMitra] = useState([
    {
      fullName: null,
      rating: null,
      gender: null,
      mobileNo: null,
      email: null,
      socketId: null,
      docs: {
        profileImage: null,
      },
    },
  ]); // array of objects contain things like mitraName , mitraRating , mitraId and other general details
  const [driverData, setDriverData] = useState({
    vehicleNo: null,
    driverId: null,
    fullName: null,
    mobileNo: null,
    rating: null,
    socketId: null,
    profileImage: null,
  }); // driver data like name , rating , phone number , vehicle number stored as object
  // used specifically only when room is closed

  // all closed rooms
  const [closedRooms, setClosedRooms] = useState([]);

  const formatImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    const normalizedPath = path.replace(/\\/g, '/');
    return `${import.meta.env.VITE_BASE_URL}/${normalizedPath}`;
  };

  // ~ Ritesh Made this : (took help of GPT)
  const updateEverything = (data) => {

    console.log("context ka data", data)

    if(!data) return;

    setPickup((data?.pickupAddress || data?.pickup?.text));
    setDestination((data?.dropAddress || data?.destination?.text));
    setRoomid(data?.id || data?._id);
    
    const creatorObj = data.creator || data.creatorId || {};
    setCreatorData({
      creatorId: creatorObj.id || creatorObj._id,
      fullName: creatorObj.fullName,
      email: creatorObj.email,
      mobileNo: creatorObj.mobileNo,
      gender: creatorObj.gender,
      rating: creatorObj.rating || "NA",
      createdAt: creatorObj.createdAt,
      updatedAt: creatorObj.updatedAt,
      socketId: creatorObj.socket_id || creatorObj.socketId,
      profileImage: formatImageUrl(creatorObj.docs?.profileImageUrl || creatorObj.profileImageUrl || creatorObj.profileImage),
    });

    setDistance(data.distance ?? (data.distanceMeters ? Math.round(data.distanceMeters / 100) / 10 : null));
    setDuration(data.duration ?? (data.durationSeconds ? Math.round(data.durationSeconds / 60) : null));
    setFare(data.fare);
    setStatus(data.status?.toLowerCase() || "open");
    setOtp(data.otp || null);
    
    setMitra(
      (data.mitras || data.mitra || []).map((m) => {
        const userObj = m?.user || m?.userId || {};
        return {
          fullName: userObj.fullName || null,
          rating: userObj.rating || "NA",
          gender: userObj.gender || null,
          mobileNo: userObj.mobileNo || null,
          email: userObj.email || null,
          socketId: userObj.socket_id || userObj.socketId || null,
          docs: {
            profileImage: formatImageUrl(userObj.docs?.profileImageUrl || userObj.profileImageUrl || userObj.profileImage),
          },
          id : userObj.id || userObj._id || null,
        };
      })
    );

    const driverObj = data.driver || {};
    setDriverData({
      vehicleNo: driverObj.details?.vehicleNo || driverObj.vehicleNo || null,
      driverId: driverObj.id || driverObj._id || null,
      fullName: driverObj.fullName || null,
      mobileNo: driverObj.mobileNo || null,
      rating: driverObj.rating || null,
      socketId: driverObj.socket_id || driverObj.socketId || null,
      profileImage: formatImageUrl(driverObj.docs?.profileImageUrl || driverObj.profileImageUrl || driverObj.profileImage),
    });
  };


  return (
    <RoomContext.Provider
      value={{
        pickup,
        setPickup,
        destination,
        setDestination,
        roomid,
        setRoomid,
        creatorData,
        setCreatorData,
        limit,
        setLimit,
        distance,
        setDistance,
        duration,
        setDuration,
        fare,
        setFare,
        status,
        setStatus,
        mitra,
        setMitra,
        driverData,
        setDriverData,
        pcount,
        setPcount,
        updateEverything,
        closedRooms,
        setClosedRooms,
        otp,
        setOtp,
        messages,
        setMessages,
        isSearching,
        setIsSearching,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(RoomContext);
};
