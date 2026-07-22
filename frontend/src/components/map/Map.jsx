import React, { useState, useEffect, memo } from 'react';
import { OverlayView, Polyline } from '@react-google-maps/api';
import { Paper, CircularProgress, Typography, Box, useMediaQuery } from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import theme from '../../styles/theme';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useLocations } from "../../contexts/LocationsContext";
import { useRoom } from "../../contexts/RoomContext";
// we may also need roomcontext import here , the source destination permenantly marked 
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
  minZoom: 40,
  maxZoom: 18,
  zoom: 15,
  styles: theme.palette.mode === 'dark' ? getDarkMapStyles(theme) : getLightMapStyles(theme)
};

const MapComponent = () => {
  // console.log('Map rendered');
  // ...existing state declarations...
  const [map, setMap] = useState(null);

  const { 
    pickupLat, setPickupLat, 
    pickupLng, setPickupLng, 
    dropLat, setDropLat, 
    dropLng, setDropLng, 
    pickupText, setPickupText, 
    dropText, setDropText,
    driverLocation,
    directionsResponse, 
    setDirectionsResponse
  } = useLocations();

  const { status } = useRoom();

  const [pickupData, setPickupData] = useState({
    pickupLat,
    pickupLng,
    pickupText
  });

  const [dropData, setDropData] = useState({
    dropLat,
    dropLng,
    dropText
  });
  const isMobile = useMediaQuery('(max-width:1024px)');

  const [currentLocation, setCurrentLocation] = useState(null);
  const [driverToPickupDirections, setDriverToPickupDirections] = useState(null);
  const [driverPathPoints, setDriverPathPoints] = useState([]);
  const [dropPathPoints, setDropPathPoints] = useState([]);
  const [showInfoWindow, setShowInfoWindow] = useState(false);

  const [initialDriverLoc, setInitialDriverLoc] = useState(null);

  useEffect(() => {
    if (driverLocation?.lat && driverLocation?.lng && !initialDriverLoc) {
      setInitialDriverLoc({ lat: driverLocation.lat, lng: driverLocation.lng });
    }
  }, [driverLocation, initialDriverLoc]);

  useEffect(() => {
    if (map && pickupLat && pickupLng) {
      const pickupPosition = { lat: pickupLat, lng: pickupLng };
      map.panTo(pickupPosition);
    }
  }, [pickupLat, pickupLng, map]);

  useEffect(() => {
    if (map && dropLat && dropLng) {
      const dropPosition = { lat: dropLat, lng: dropLng };
      map.panTo(dropPosition);
    }
  }, [dropLat, dropLng, map]);

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

  const directionsCallback = React.useCallback((response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDirectionsResponse(response);
        const path = response.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        setDropPathPoints(path);
      } else {
        console.error('DirectionsService response: ', response);
      }
    }
  }, [setDirectionsResponse, setDropPathPoints]);

  const driverPickupDirectionsCallback = React.useCallback((response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setDriverToPickupDirections(response);
        const path = response.routes[0].overview_path.map(p => ({ lat: p.lat(), lng: p.lng() }));
        setDriverPathPoints(path);
      } else {
        console.error('Driver to Pickup Directions response: ', response);
      }
    }
  }, [setDriverToPickupDirections]);

  useEffect(() => {
    if (driverLocation && driverLocation.lat) {
      const shrinkPath = (prev) => {
        if (prev.length === 0) return prev;
        let minDistance = Infinity;
        let minIndex = 0;
        prev.forEach((point, index) => {
          const dLat = (point.lat - driverLocation.lat) * (Math.PI / 180);
          const dLon = (point.lng - driverLocation.lng) * (Math.PI / 180);
          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(driverLocation.lat * (Math.PI / 180)) * Math.cos(point.lat * (Math.PI / 180)) * 
                    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
          const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
          if (distance < minDistance) {
            minDistance = distance;
            minIndex = index;
          }
        });
        if (minIndex > 0) {
          return prev.slice(minIndex);
        }
        return prev;
      };

      if (status === 'ongoing') {
        setDropPathPoints(shrinkPath);
      } else {
        setDriverPathPoints(shrinkPath);
      }
    }
  }, [driverLocation, status]);

  useEffect(() => {
    // If pickup or drop changes, we clear directions to fetch a new route
    if (pickupLat && pickupLng && dropLat && dropLng) {
      setDirectionsResponse(null);
    }
  }, [pickupLat, pickupLng, dropLat, dropLng, setDirectionsResponse]);

  const pLat = parseFloat(pickupLat);
  const pLng = parseFloat(pickupLng);
  const dLat = parseFloat(dropLat);
  const dLng = parseFloat(dropLng);

  if (!isLoaded || (!currentLocation && !pickupLat && !driverLocation?.lat)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '400px' }}>
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

  const calculateETA = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distance = R * c; 
    return Math.ceil(distance / 0.5); // 30 km/h average speed
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
            fontFamily: theme.typography.fontFamily,
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

    <Paper sx={{
      
      height: '100%',
      width: '100%', border: '1px solid black'
    }}>
      <GoogleMap
        onLoad={onLoad}
        mapContainerStyle={{
          width: '100%',
          height: '100%'
          // height:isMobile?'400px':'100%',
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
  
  
        {/* Pickup Marker */}
        {pickupText && pickupLat && pickupLng && (
          <Marker
            position={{ lat: pickupLat, lng: pickupLng }}
            label="P"
            title={pickupText}
          />
        )}

        {/* Drop Marker */}
        {dropText && dropLat && dropLng && (
          <Marker
            position={{ lat: dropLat, lng: dropLng }}
            label="D"
            title={dropText}
          />
        )}

        {/* Driver Marker & ETA */}
        {driverLocation && driverLocation.lat && driverLocation.lng && (
          <>
            <Marker
              position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
              icon={{
                url: '/car_topview.png',
                scaledSize: new window.google.maps.Size(40, 40),
                anchor: new window.google.maps.Point(20, 20)
              }}
              title="Driver"
            />
            {status !== 'ongoing' && !isNaN(pLat) && !isNaN(pLng) && (
              <InfoWindow
                position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
                options={{ disableAutoPan: true }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                  Pickup in {calculateETA(driverLocation.lat, driverLocation.lng, pLat, pLng)} min
                </Typography>
              </InfoWindow>
            )}
            {status === 'ongoing' && !isNaN(dLat) && !isNaN(dLng) && (
              <InfoWindow
                position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
                options={{ disableAutoPan: true }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'black' }}>
                  Drop off in {calculateETA(driverLocation.lat, driverLocation.lng, dLat, dLng)} min
                </Typography>
              </InfoWindow>
            )}

            {/* Directions Service for Driver to Pickup */}
            {status !== 'ongoing' && !isNaN(pLat) && !isNaN(pLng) && initialDriverLoc && !driverToPickupDirections && (
              <DirectionsService
                options={{
                  origin: initialDriverLoc,
                  destination: { lat: pLat, lng: pLng },
                  travelMode: 'DRIVING'
                }}
                callback={driverPickupDirectionsCallback}
              />
            )}

            {/* Dynamic Polyline for Driver to Pickup */}
            {status !== 'ongoing' && driverPathPoints.length > 0 && (
              <Polyline
                path={driverPathPoints}
                options={{
                  strokeColor: '#D93025', // Red for driver-to-pickup
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                }}
              />
            )}
            
            {/* Dynamic Polyline for Driver to Drop (when ongoing) */}
            {status === 'ongoing' && dropPathPoints.length > 0 && (
              <Polyline
                path={dropPathPoints}
                options={{
                  strokeColor: '#1A73E8', // Google Blue for pickup-to-drop
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                }}
              />
            )}
          </>
        )}

        {/* Directions Service - Only runs when directionsResponse is null */}
        {!isNaN(pLat) && !isNaN(pLng) && !isNaN(dLat) && !isNaN(dLng) && !directionsResponse && (
          <DirectionsService
            options={{
              origin: { lat: pLat, lng: pLng },
              destination: { lat: dLat, lng: dLng },
              travelMode: 'DRIVING'
            }}
            callback={directionsCallback}
          />
        )}

        {/* Directions Renderer - Only show if not ongoing */}
        {status !== 'ongoing' && directionsResponse && (
          <DirectionsRenderer
            options={{
              directions: directionsResponse,
              suppressMarkers: true,
              polylineOptions: {
                strokeColor: '#1A73E8', // Google Blue for pickup-to-drop
                strokeOpacity: 0.9,
                strokeWeight: 6,
              }
            }}
          />
        )}

      </GoogleMap>

    </Paper>
  );
};

export default memo(MapComponent);
// this memo is added to prevent unnecessary child re - renders 