import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LinearProgress } from "@mui/material";
import { SocketContext } from "../contexts/Socket";

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setEntity } = useContext(EntityContext);
  const [loading, setLoading] = useState(true);
  const { sendMessage, recieveMessage, stopRecieveMessage } =
      useContext(SocketContext);

  useEffect(() => {
    if (!token) {
      navigate("/user-signin", {
        state: { msgForUser: "You must be logged in to access the page" },
      });
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/check`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        console.log("we are only getting",res.data);
        setEntity(res.data);
      
        
        sendMessage("join", { userType: "USER", userId : res.data.id || res.data._id || res.data.userId });

      } catch (err) {
        console.error(err);
        navigate("/user-signin", {
          state: { msgForUser: "You must be logged in to access the page" },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <LinearProgress sx={{ width: "100%", height: "2px" }} />;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
