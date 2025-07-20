import { useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ExploreIcon from "@mui/icons-material/Explore";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useNavigate } from "react-router-dom";


// this thing isnt responsive

export default function ActiveRideComponent({ info }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleRedirect = () => {
    const isUser = localStorage.getItem("USER");
    const isDriver = localStorage.getItem("DRIVER");

    if (isUser) {
      navigate("/room-int");
    } else if (isDriver) {
      navigate("/captain-room-int");
    }
  };

  return (
    <div className="bg-black text-white p-4 rounded-lg max-w-md">
      <div className="bg-gray-900 rounded-lg p-4">
        {/* Header - Always visible */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center">
            <h2 className="text-xl font-bold mr-2">Current Active Ride</h2>
            <span className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
              ACTIVE
            </span>
          </div>
          <div
            className="cursor-pointer p-1 hover:bg-gray-800 rounded-full"
            onClick={toggleExpand}
          >
            {expanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </div>
        </div>

        {/* Condensed view - Always visible */}
        <div className="mt-2 mb-2">
          <div className="flex items-start">
            <div className="mt-1 mr-3">
              <div className="bg-green-500 w-2 h-2 rounded-full"></div>
              <div className="w-0.5 h-8 bg-gray-600 mx-auto"></div>
              <div className="bg-yellow-400 w-2 h-2 rounded-full"></div>
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <div className="text-gray-400 text-xs">FROM</div>
                <div className="font-medium text-sm">{info?.pickup.text}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">TO</div>
                <div className="font-medium text-sm">
                  {info?.destination.text}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 border-t border-gray-800 pt-3">
            {/* Ride stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 mb-1">
                  <AccessTimeIcon style={{ fontSize: 16, marginRight: 4 }} />
                  <span className="text-xs">Status</span>
                </div>
                <div className="font-bold text-lg">{info.status}</div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 mb-1">
                  <ExploreIcon style={{ fontSize: 16, marginRight: 4 }} />
                  <span className="text-xs">DISTANCE</span>
                </div>
                <div className="font-bold text-lg">{info.distance} km</div>
              </div>

              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="flex items-center text-gray-400 mb-1">
                  <AttachMoneyIcon style={{ fontSize: 16, marginRight: 4 }} />
                  <span className="text-xs">FARE</span>
                </div>
                <div className="font-bold text-lg">Rs.{info.fare}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-gray-800 py-2 rounded-lg font-medium hover:bg-gray-700 transition">
                Cancel Ride
              </button>
              <button
                className="bg-yellow-400 text-black py-2 rounded-lg font-medium hover:bg-yellow-500 transition"
                onClick={() => handleRedirect()}
              >
                View Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
