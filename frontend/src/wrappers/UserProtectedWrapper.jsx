import React, { useContext, useEffect, useState } from "react";
import { EntityContext } from "../contexts/EntityContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
        navigate("/user/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectedWrapper;
