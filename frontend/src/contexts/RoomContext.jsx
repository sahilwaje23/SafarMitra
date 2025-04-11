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

  // ~ Ritesh Made this : (took help of GPT)
  const updateEverything = (data) => {
    setPickup(data.pickup.text);
    setDestination(data.destination.text);
    setRoomid(data._id);
    setCreatorData({
      creatorId: data.creatorId?._id,
      fullName: data.creatorId?.fullName,
      email: data.creatorId?.email,
      mobileNo: data.creatorId?.mobileNo,
      gender: data.creatorId.gender,
      rating: data.creatorId.rating || "NA",
      createdAt: data.creatorId.createdAt,
      updatedAt: data.creatorId.updatedAt,
      socketId: data.creatorId.socketId,
      profileImage: data.creatorId.profileImage,
    });
    // setLimit(data.limit || 1);
    // setPcount(data.pcount || 1);
    setDistance(data.distance);
    setDuration(data.duration);
    setFare(data.fare);
    setStatus(data.status || "open");
    setMitra(
      (data.mitra || []).map((m) => ({
        fullName: m?.userId?.fullName || null,
        rating: m?.userId?.rating || "NA",
        gender: m?.userId?.gender || null,
        mobileNo: m?.userId?.mobileNo || null,
        email: m?.userId?.email || null,
        socketId: m?.userId?.socket_id || null,
        docs: {
          profileImage: m?.userId?.docs?.profileImageUrl || null,
        },
      }))
    );
    setDriverData({
      // vehicleNo: data.driver?.vehicleNo || null,
      // driverId: data.driver?._id || null,
      // fullName: data.driver?.fullName || null,
      // mobileNo: data.driver?.mobileNo || null,
      // rating: data.driver?.rating || null,
      // socketId: data.driver?.socketId || null,
      // profileImage: data.driver?.profileImage || null,

      vehicleNo: data.driver?.details?.vehicleNo || null,
      driverId: data.driver?._id || null,
      fullName: data.driver?.fullName || null,
      mobileNo: data.driver?.mobileNo || null,
      rating: data.driver?.rating || null,
      socketId: data.driver?.socket_id || null,
      profileImage: data.driver?.docs?.profileImageUrl || null,
    });
  };
  const [amit, setAmit] = useState(false);

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
        // closedRooms,
        // setClosedRooms,
        amit,
        setAmit,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  return useContext(RoomContext);
};
