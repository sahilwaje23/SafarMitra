import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
<<<<<<< HEAD
=======
import { LinearProgress } from "@mui/material";
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e

const UserProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { setEntity } = useContext(EntityContext);
  const [loading, setLoading] = useState(true);

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
        setEntity(res.data);
      } catch (err) {
        console.error(err);
<<<<<<< HEAD
        navigate("/user-signin");
=======
        navigate("/user-signin", {
          state: { msgForUser: "You must be logged in to access the page" },
        });
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
<<<<<<< HEAD
    return <div>Loading...</div>;
=======
    return <LinearProgress sx={{ width: "100%", height: "2px" }} />;
>>>>>>> 77ed55fb68c2da91b25542c1acb8ac87c1a5585e
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
