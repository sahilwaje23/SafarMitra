import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import theme from "../../styles/theme";
import Room from "../room/Room";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputWithSuggestions from "../../components/user/SuggestionsList.jsx"
// frontend\src\components\user\SuggestionsList.jsx
const RoomActivities = () => {
  const [roomData, setroomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
      navigate("/user/signin"); // Redirect if unauthorized
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    const token = localStorage.getItem("token"); // Retrieve the token
  
    if (!token) {
      console.error("No token found, cannot fetch rooms");
      navigate("/user/signin"); // Redirect if no token
      return;
    }
  
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-all-open-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setroomData(res.data);
      console.log(res.data);
      
    } catch (err) {
      console.error("Error fetching rooms:", err);
      if (err.response && err.response.status === 401) {
        navigate("/user/signin"); // Redirect to login if unauthorized
      }
    }
  };

  useEffect(() => {
    fetchProfile(); // Fetch user profile on mount
    fetchRooms(); // Fetch all open rooms on mount
  }, []);

  useEffect(() => {
    if (source.trim() !== "" && destination.trim() !== "") {
      fetchRooms();
    }
  }, [source, destination]); // Refetch rooms when both fields are filled

  const {pickupLat,setPickupLat,pickupLng,setPickupLng,dropLat,setDropLat,dropLng,setDropLng,pickupText,setPickupText,dropText,setDropText} = useLocations();
      // chaitanya use this varibles
  // since we are focusing on mobile for now , so i will do the pickup and drop in userHomepage (chaitanya kindly remove that dialog box of create room and join room)

  return (
    <div className="w-full h-[calc(100vh-64px)] min-w-[100vw] grid grid-cols-1 md:grid-cols-2">
      {/* Left: Create Room Form */}
      <div className="flex flex-col items-center justify-center w-full h-full max-h-screen gap-y-8">
        {/* Input Fields */}
        <div className="hidden md:flex flex-col gap-y-3 w-full justify-center items-center pb-2">
          
          {/* source */}
          <label
            className="text-start w-full max-w-[342px] pl-1 text-xl"
            htmlFor=""
          >
            Source :
          </label>
          <InputWithSuggestions inputId="source" placeholder="Enter Source" onSelect={{setPickupLat,setPickupLng,setPickupText}} />
          {/* chaitanya make setPickupData  */}
          
          {/* destination */}
          <label
            className="text-start w-full max-w-[342px] pl-1 text-xl"
            htmlFor=""
          >
            Destination :
          </label>
          <InputWithSuggestions inputId="destination" placeholder="Enter Destination" onSelect={{setDropLat,setDropLng,setDropText}} />
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
          />
        </div>

        {/* Create Room Button */}
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

      {/* Right: Display Relevant Rooms */}
      <div className="border-2 rounded-lg border-white/30 m-1 max-h-screen h-auto flex flex-col gap-y-3 overflow-y-scroll overflow-x-hidden">
        <Room roomData={roomData} />
      </div>
    </div>
  );
};

export default RoomActivities;
