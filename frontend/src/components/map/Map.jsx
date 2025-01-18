import React, { useState, useEffect,memo } from 'react';
import { OverlayView } from '@react-google-maps/api';
import { Paper, CircularProgress, Typography, Box, useMediaQuery } from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import theme from '../../styles/theme';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const libraries = ['places'];

const defaultCenter = {
  lat: 18.9398,
  lng: 72.8354
};
const getLightMapStyles = (theme) => [
  // {
  //   featureType: "all",
  //   elementType: "geometry",
  //   stylers: [{ color: "#ffffff" }]
  // },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#e9e9e9" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#808080" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: theme.palette.primaryColor.main }]
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

const getDarkMapStyles = (theme) => [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [{ color: "#242f3e" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: theme.palette.primaryColor.main }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }]
  },
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#242f3e" }]
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#ffffff" }]
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }]
  }
];

const mapOptions = {
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  minZoom: 16,
  maxZoom: 18,
  zoom: 15,
  styles: theme.palette.mode === 'dark' ? getDarkMapStyles(theme) : getLightMapStyles(theme)
};

const MapComponent = () => {
  console.log('Map rendered'); 
  // ...existing state declarations...
  const [map, setMap] = useState(null);


  const isMobile = useMediaQuery('(max-width:1024px)');

  const [currentLocation, setCurrentLocation] = useState(null);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries
  });
  const onLoad = (map) => {
    setMap(map);
  };
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error:", error);
        }
      );
    }
  }, []);

  if (!isLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }
  const handleMarkerClick = () => {
    if (map && currentLocation) {
      map.panTo(currentLocation);
      map.setZoom(20); // Maximum zoom on click
    }
 
  };

  const CustomMarker = ({ position, onClick }) => (
    <OverlayView
      position={position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
      getPixelPositionOffset={(width, height) => ({
        x: -(width / 2),
        y: -height
      })}
    >
      <div onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography 
        variant="caption" 
        sx={{ 
          // color: theme.palette.txtcol,
          padding: '2px 4px',
          marginBottom: '0px',
          fontFamily:theme.typography.fontFamily,
          fontWeight: 'bold' 
        }}
      >
        YOU!
      </Typography>
        <LocationOnIcon
          sx={{
            color: theme.palette.primaryColor.main,
            fontSize: 40,
            filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,0.3))',
            cursor: 'pointer',
            '&:hover': {
              transform: 'scale(1.1)',
              transition: 'transform 0.2s'
            }
          }}
        />
      </div>
    </OverlayView>
  );

  return (

    <Paper sx={{ height: isMobile ? '400px' : '100%', width: '100%', border: '1px solid black' }}>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{
          width: '100%',
          height: '100%'
        }}
        center={currentLocation || defaultCenter}
        zoom={15}
        options={mapOptions}
      >
        {currentLocation && (
          <>
            <CustomMarker
              position={currentLocation}
              onClick={handleMarkerClick}
            />
            {showInfoWindow && (
              <InfoWindow
                position={currentLocation}
                onCloseClick={() => setShowInfoWindow(false)}
              >
                <Typography>Current Location</Typography>
              </InfoWindow>
            )}
          </>
        )}
      </GoogleMap>

    </Paper>
  );
};

export default memo(MapComponent);
// this memo is added to prevent unnecessary child re - renders 