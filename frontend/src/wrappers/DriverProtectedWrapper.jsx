import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { SocketContext } from "../contexts/Socket";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import { useLocations } from "../contexts/LocationsContext";

const DriverProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { entity, setEntity } = useContext(EntityContext);
  const { sendMessage } = useContext(SocketContext);
  const { setDriverLocation } = useLocations();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/captain-signin", {
        state: { msgForUser: "You must be logged in to access the page " },
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/driver/check`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setEntity(res.data);
        sendMessage("join", { userType: "DRIVER", userId: res.data.id || res.data._id });
      } catch (err) {
        console.error(err);
        navigate("/captain-signin", {
          state: { msgForUser: "You must be logged in to access the page" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate, setEntity, sendMessage]);

  useEffect(() => {
    const driverId = entity?.id || entity?._id || JSON.parse(localStorage.getItem("DRIVER"))?.id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
    if (!driverId || !token || loading) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        // console.log("updating location ...")
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("Global driver location updated:", position.coords);
          const locationData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setDriverLocation(locationData);
          sendMessage("update-location-driver", {
            driverId,
            location: {
              ltd: locationData.lat,
              lng: locationData.lng,
            },
          });
        });
      }
    };

    const locationInterval = setInterval(updateLocation, 15000);
    updateLocation();

    return () => clearInterval(locationInterval);
  }, [entity, loading, token, sendMessage]);

  if (loading) {
    return <LinearProgress sx={{ width: "100%", height: "2px" }} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default DriverProtectedWrapper;
