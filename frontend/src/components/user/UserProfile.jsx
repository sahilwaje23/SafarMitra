import {
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  LinearProgress,
} from "@mui/material";
import { LogoutOutlined, Star, LocationOn } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import theme from "../../styles/theme";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const yellowTheme = theme.palette.primaryColor.main;
  const [profile, setProfile] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true); // Show loader
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/my-profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setProfile(res.data); // Update profile state
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false); // Hide loader
      }
    };

    fetchProfile();
  }, [token]);

  const handleLogOut = async () => {
    console.log("Logging out...");
    setIsLoading(true);
    localStorage.removeItem("token");
    try {
      await axios.get(`${import.meta.env.VITE_BASE_URL}/logout`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoading(false);
    }
    navigate("/user-signin", { state: { msgForUser: "Log Out Successful" } });
  };

  if (isLoading) return <LinearProgress />;

  if (!profile) {
    return (
      <div className="text-center mt-8">
        <Typography variant="h6" color="textSecondary">
          Unable to load profile data.
        </Typography>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[35px,auto,auto,1fr] items-start justify-center min-h-[calc(100vh-56px)] md:min-h-[calc(100vh-64px)] w-screen bg-gradient-to-b from-gray-900/5 to-transparent p-4">
      <div className="w-[inherit] text-right">
        <Button
          variant="contained"
          startIcon={<LogoutOutlined />}
          sx={{
            background: yellowTheme,
            "&:hover": {
              background: yellowTheme,
              opacity: 0.9,
            },
            marginRight: 2,
            textTransform: "none",
            fontWeight: 500,
          }}
          onClick={handleLogOut}
        >
          Log Out
        </Button>
      </div>

      {/* Profile Image Section */}
      <div className="grid grid-cols-[1fr,auto,1fr] w-[inherit] justify-between items-center mt-4">
        <div className="bg-white/30 h-[1px]"></div>
        <div className="relative">
          <img
            className="rounded-full h-28 w-28 object-cover border-4 border-white shadow-lg"
            src={`${import.meta.env.VITE_BASE_URL}/${
              profile?.docs?.profileImageUrl || "default-avatar.jpg"
            }`}
            alt="Profile"
          />
        </div>
        <div className="bg-white/30 h-[1px]"></div>
      </div>

      {/* Name and Rating Section */}
      <div className="text-center px-1 mt-4 space-y-2 capitalize">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            fontSize: { xs: "1.75rem", md: "2rem" },
          }}
        >
          {profile.fullName}
        </Typography>
        <div className="flex items-center justify-center gap-1">
          <Star sx={{ color: "#FFD700", fontSize: 24 }} />
          <Typography variant="h6">{profile.rating || "0"}</Typography>
        </div>
      </div>

      {/* Details Section */}
      <div className="w-full max-w-4xl mx-auto space-y-8 mt-8">
        <div className="grid gap-6 max-w-[500px] mx-auto px-4">
          <TextField label="Email" variant="standard" value={profile.email} />
          <TextField
            label="Phone Number"
            variant="standard"
            value={profile.mobileNo}
          />
          <TextField label="Gender" variant="standard" value={profile.gender} />
        </div>

        {/* Rides Section */}
        <div className="px-4">
          <Typography variant="h5" className="font-semibold mb-4">
            Recent Rides
          </Typography>

          {!profile.ridesBooked || profile.ridesBooked.length === 0 ? (
            <Card className="bg-white/95 shadow-md">
              <CardContent>
                <Typography
                  variant="body1"
                  className="text-center text-gray-500 py-8"
                >
                  You haven't booked any rides yet.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {profile.ridesBooked.map((ride) => (
                <Card key={ride._id} className="bg-white/95 shadow-md">
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <LocationOn
                              sx={{ color: "#FF4444", fontSize: 20 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              From: {ride.pickup}
                            </Typography>
                          </div>
                          <div className="flex items-center gap-2">
                            <LocationOn
                              sx={{ color: "#4CAF50", fontSize: 20 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              To: {ride.destination}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Typography variant="h6">₹{ride.fare}</Typography>
                          <Typography
                            variant="caption"
                            className="capitalize px-2 py-1 bg-[#FEC400] rounded-full"
                            color="secondaryColor"
                          >
                            {ride.status}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex justify-between flex-row-reverse">
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {new Date(ride.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">{ride.distance}</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;