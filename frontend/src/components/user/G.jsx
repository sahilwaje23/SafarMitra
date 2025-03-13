import React, { useState, useEffect, memo } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import {
  Paper,
  CircularProgress,
  Box,
} from "@mui/material";

const libraries = ["places"];

const defaultCenter = { lat: 18.9398, lng: 72.8354 }; // Mumbai default center

const dummyPickup = { lat: 18.9407, lng: 72.8354, text: "CSMT, Mumbai" };
const dummyDrop = { lat: 18.9220, lng: 72.8347, text: "Gateway of India, Mumbai" };

const mapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  minZoom: 10,
  maxZoom: 18,
  zoom: 15,
};

const MapComponent = () => {
  console.log("Map rendered");

  const [map, setMap] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch route from Google Directions API
  useEffect(() => {
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: dummyPickup.lat, lng: dummyPickup.lng },
        destination: { lat: dummyDrop.lat, lng: dummyDrop.lng },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error("Directions request failed due to:", status);
        }
      }
    );
  }, []);

  if (!isLoaded) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: "100%", width: "100%", border: "1px solid black" }}>
      <GoogleMap
        onLoad={(map) => setMap(map)}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={currentLocation || defaultCenter}
        zoom={15}
        options={mapOptions}
      >
        {/* Pickup Marker */}
        <Marker position={{ lat: dummyPickup.lat, lng: dummyPickup.lng }} label="P" title={dummyPickup.text} />

        {/* Drop Marker */}
        <Marker position={{ lat: dummyDrop.lat, lng: dummyDrop.lng }} label="D" title={dummyDrop.text} />

        {/* Render Route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </Paper>
  );
};

export default memo(MapComponent);
