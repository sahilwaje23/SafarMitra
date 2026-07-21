import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { SocketContext } from "../contexts/Socket";
import { useNavigate, Outlet } from "react-router-dom";
import axios from "axios";
import { LinearProgress } from "@mui/material";

const DriverProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { entity, setEntity } = useContext(EntityContext);
  const { sendMessage } = useContext(SocketContext);
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
        sendMessage("join", { userType: "DRIVER", userId: res.data._id || res.data.userId });
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
    const driverId = entity?._id || JSON.parse(localStorage.getItem("DRIVER"))?._id;
    if (!driverId || !token || loading) return;

    const updateLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("Global driver location updated:", position.coords);
          sendMessage("update-location-driver", {
            driverId,
            location: {
              ltd: position.coords.latitude,
              lng: position.coords.longitude,
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
