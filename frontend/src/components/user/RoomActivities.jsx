import React, { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";
import theme from "../../styles/theme";
import Room from "../room/Room";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputWithSuggestions from "../../components/user/SuggestionsList.jsx";
import { useLocations } from "../../contexts/LocationsContext.jsx";

const RoomActivities = () => {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantsLimit, setParticipantsLimit] = useState(1);
  const navigate = useNavigate();

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
  useEffect(() => {
    console.log("Updated roomData:", roomData);
  }, [roomData]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/check`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
      navigate("/user/signin");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot fetch rooms");
      navigate("/user/signin");
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-all-open-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("API response:", res.data); // Check what the API returns
      setRoomData(res.data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      if (err.response && err.response.status === 401) {
        navigate("/user/signin");
      }
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchRooms();
  }, []);

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
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">
            Source :
          </label>
          <InputWithSuggestions
            inputId="source"
            placeholder="Enter Source"
            onSelect={handlePickupSelect}
            value={pickupText}
            onChange={handlePickupChange}
          />
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">
            Destination :
          </label>
          <InputWithSuggestions
            inputId="destination"
            placeholder="Enter Destination"
            onSelect={handleDropSelect}
            value={dropText}
            onChange={handleDropChange}
          />
          <label className="text-start w-full max-w-[342px] pl-1 text-xl" htmlFor="">
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
            onChange={(e) => setParticipantsLimit(Math.min(Math.max(1, e.target.value), 4))}
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
