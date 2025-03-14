import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import theme from "../../styles/theme";
import Room from "../room/Room";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputWithSuggestions from "../../components/user/SuggestionsList.jsx";
import { useLocations } from "../../contexts/LocationsContext.jsx";
import { useRoom } from "../../contexts/RoomContext.jsx";
// link this thing so that whatever information entered here is carried forwaded to the room context 
// basically once hitted create room herre information entered so far forwaded to roomcontext 
const RoomActivities = () => {
  const [roomData, setRoomData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantsLimit, setParticipantsLimit] = useState(1);
  const navigate = useNavigate();

  // useLocations context Data
  const {
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
  } = useLocations();

  // useRoom context data
  const {
    pickup,
    destination,
    setPickup,
    setDestination,
    limit,
    setLimit,
    roomid,
    setRoomid,
    creatorData,
    setCreatorData,
    distance,
    setDistance,
    duration,
    setDuration,
    fare,
    setFare
  } = useRoom();
  const [pickupData, setPickupData] = useState({
    pickupLat,
    pickupLng,
    pickupText,
  });

  const [dropData, setDropData] = useState({
    dropLat,
    dropLng,
    dropText,
  });

  useEffect(() => {
    // Update context values when pickupData or dropData changes
    setPickupLat(pickupData.pickupLat);
    setPickupLng(pickupData.pickupLng);
    setDropLat(dropData.dropLat);
    setDropLng(dropData.dropLng);
    setPickupText(pickupData.pickupText);
    setDropText(dropData.dropText);
  }, [pickupData, dropData]);

  useEffect(() => {
    console.log("Pickup Data", pickupData);
    console.log("Drop Data", dropData);
  }, [pickupData, dropData]);

  // Log updated roomData whenever it changes
  // useEffect(() => {
  //   console.log("Updated roomData:", roomData);
  // }, [roomData]);

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot fetch rooms");
      navigate("/user/signin");
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/get-all-open-rooms`,

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log("All rooms from API ", res.data); // Check what the API returns
      setRoomData(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      alert(err);
    }
  };

  const createRoom = async (roomData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot create room");
      navigate("/user-signin");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/create-room`,
        roomData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // "Content-Type": "application/json"
          },
          withCredentials: true,
        }
      );
      console.log("Room created successfully:", res.data);
      // Handle state update if needed, e.g., updating the room list
      setRoomData((prevRooms) => [...prevRooms, res.data.newRoom]);
      // now that room is created the corresponding roomid addded in context , also initialise room parameters , like fare  distance duration default particpant always set to 1 this will be updated soon inside join room 
      setRoomid(res.data.newRoom._id);
      setFare(res.data.newRoom.fare);
      setDuration(res.data.newRoom.duration);
      setDistance(res.data.newRoom.distance);
      setPcount(1); // this line is redundant since creator will always join with 1 count , now the joining side will update the other things as disscussed
      // now handle other room parameters like fare , duration , distance , pcount is always 1 since begining only the joining side will update it hence just initialise the first 3 parameters 



      // also initialise creator id here retrive from local storage 
      const userData = JSON.parse(localStorage.getItem("USER"))?.user;

      if (userData) {
        setCreatorData({
          creatorId: userData._id,
          fullName: userData.fullName,
          email: userData.email,
          mobileNo: userData.mobileNo,
          gender: userData.gender,
          rating: userData.rating,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          socketId: localStorage.getItem("socket_id") || userData.socket_id
        });
      }

    } catch (err) {
      console.error("Error creating room:", err);
      if (err.response && err.response.status === 401) {
        navigate("/signin");
      }
    }
  };

  const handleCreateRoom = () => {
    const roomData = {
      pickupLat: pickupLat,
      pickupLng: pickupLng,
      dropLat: dropLat,
      dropLng: dropLng,
      pickupText: pickupText,
      dropText: dropText,
    };
    createRoom(roomData);
    // the above will also initialize the roomid
    setPickup(pickupText);
    setDestination(dropText);
    setLimit(participantsLimit);
    // the joining part will update the partiticpants count their information 
    // driver details and mitra details also updated 
    navigate("/room-int");
  };

  useEffect(() => {
    fetchRooms();
  }, [dropText]);

  const handlePickupSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setPickupLat(value.lat);
      setPickupLng(value.lng);
      setPickupText(value.description);
      setPickupData({
        pickupText: value.description,
        pickupLat: value.lat,
        pickupLng: value.lng,
      });
    } else {
      console.error("Selected value does not have the required structure.");
    }
  };

  const handleDropSelect = (value) => {
    if (value && value.lat && value.lng && value.description) {
      setDropLat(value.lat);
      setDropLng(value.lng);
      setDropText(value.description);
      setDropData({
        dropText: value.description,
        dropLat: value.lat,
        dropLng: value.lng,
      });
    } else {
      console.error("Selected value does not have the required structure.");
    }
  };

  const handlePickupChange = (e) => {
    setPickupText(e.target.value);
  };

  const handleDropChange = (e) => {
    setDropText(e.target.value);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] min-w-[100vw] grid grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col items-center justify-center w-full h-full max-h-screen gap-y-8">
        <div className="hidden md:flex flex-col gap-y-3 w-full justify-center items-center pb-2">
          <label
            className="text-start w-full max-w-[342px] pl-1 text-xl"
            htmlFor=""
          >
            Source :
          </label>
          <InputWithSuggestions
            inputId="source"
            placeholder={pickupText}
            onSelect={handlePickupSelect}
            value={pickupText}
            onChange={handlePickupChange}
          />
          <label
            className="text-start w-full max-w-[342px] pl-1 text-xl"
            htmlFor=""
          >
            Destination :
          </label>
          <InputWithSuggestions
            inputId="destination"
            placeholder={dropText}
            onSelect={handleDropSelect}
            value={dropText}
            onChange={handleDropChange}
          />
          <label
            className="text-start w-full max-w-[342px] pl-1 text-xl"
            htmlFor=""
          >
            Passenger Limit :
          </label>
          <input
            type="number"
            max={4}
            min={1}
            id="limit"
            className="bg-[#333] px-4 py-3 w-full rounded-md outline-none hover:bg-[rgb(40,40,40)] focus:bg-[rgb(40,40,40)] max-w-[342px] focus:outline-white/50 outline-offset-0 outline-2"
            placeholder="Passenger Limit"
            value={participantsLimit}
            onChange={(e) =>
              setParticipantsLimit(Math.min(Math.max(1, e.target.value), 4))
            }
          />
        </div>
        <div className="flex flex-col gap-y-3 w-full justify-center items-center mt-12 md:mt-0">
          <Button
            sx={{
              height: "3.3rem",
              backgroundColor: theme.palette.primaryColor.main,
              text: "center",
              width: "100%",
              maxWidth: "342px",
            }}
            variant="contained"
            type="submit"
            fullWidth
            onClick={handleCreateRoom}
          >
            <Typography sx={{ fontSize: "large", fontWeight: "bold" }}>
              Create Room
            </Typography>
          </Button>
        </div>
      </div>
      <div className="md:hidden text-center my-10 grid grid-cols-[1fr,auto,1fr] place-content-center items-center">
        <div className="bg-white/30 h-[0.5px] w-full"></div>
        <div className="text-center text-white px-4 ">OR</div>
        <div className="bg-white/30 h-[0.5px] w-full"></div>
      </div>
      <div className="border-2 rounded-lg border-white/30 m-1 max-h-screen h-auto flex flex-col gap-y-3 overflow-y-scroll overflow-x-hidden">
        <Room roomData={roomData} />
      </div>
    </div>
  );
};

export default RoomActivities;