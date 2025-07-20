import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LinearProgress } from "@mui/material";

const DriverProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setEntity } = useContext(EntityContext);
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
  }, [token]);

  if (loading) {
    return <LinearProgress sx={{ width: "100%", height: "2px" }} />;
  }

  return <>{children}</>;
};

export default DriverProtectedWrapper;
