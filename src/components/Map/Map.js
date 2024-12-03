"use client";
import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";
import NextImage from "next/image";
import { FaMapMarkerAlt, FaDirections, FaTag } from "react-icons/fa";

const MapSearch = ({
  isLoaded,
  // userLocation,
  mapCenter,
  searchResults,
  nearbyPlaces,
  selectedPlace,
  onSelectPlace,
  fetchNearbyPlaces,
}) => {
  const mapRef = useRef(null);
  const [clickLocation, setClickLocation] = useState(null);
  const [radius, setRadius] = useState(500);
  const [directions, setDirections] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const watcherIdRef = useRef(null);

  const [destinationReached, setDestinationReached] = useState(false);
  // ฟังก์ชันจัดการเมื่อคลิกบนแผนที่
  const handleMapClick = async (event) => {
    // ดึงพิกัดที่ผู้ใช้คลิกบนแผนที่
    const { latLng } = event;
    const clickedLat = latLng.lat(); // ดึงค่า latitude จากพิกัดที่คลิก
    const clickedLng = latLng.lng(); // ดึงค่า longitude จากพิกัดที่คลิก
  
    // บันทึกตำแหน่งที่คลิกลงใน state
    setClickLocation({ lat: clickedLat, lng: clickedLng });
  
    // เรียก API เพื่อดึงข้อมูลสถานที่ใกล้เคียง
    const places = await fetchNearbyPlaces(clickedLat, clickedLng, radius);
  
    // ตรวจสอบว่า `places` เป็น array และมีข้อมูลหรือไม่
    if (Array.isArray(places) && places.length > 0) {
      const nearestPlace = places[0];
      const { latitude, longitude } = nearestPlace;
  
      // ซูมแผนที่ไปยังสถานที่ใกล้ที่สุด
      if (mapRef.current) {
        mapRef.current.panTo({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
        mapRef.current.setZoom(16); // ซูมระดับ 16
      }
    } else {
      // ไม่มีสถานที่ใกล้เคียง ซูมไปที่ตำแหน่งที่คลิก
      if (mapRef.current) {
        mapRef.current.panTo({ lat: clickedLat, lng: clickedLng });
        mapRef.current.setZoom(14); // ซูมระดับ 14
      }
    }
  };
  
    // Calculate distance between two points (Haversine formula)
    const calculateDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371e3; // Earth radius in meters
      const toRad = (value) => (value * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    };

  const calculateRoutes = useCallback((origin, destination) => {
    if (
      !origin ||
      !origin.lat ||
      !origin.lng ||
      !destination ||
      !destination.latitude ||
      !destination.longitude
    ) {
      console.error("Invalid origin or destination coordinates:", { origin, destination });
      return; // Exit early if inputs are invalid
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: Number(destination.latitude), lng: Number(destination.longitude) },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setCurrentLegIndex(0); // Reset to first step
        } else {
          console.error(`Error fetching directions: ${status}`);
        }
      }
    );
  }, []);

  useEffect(() => {
    if (selectedPlace) {
      watcherIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
         const distance = calculateDistance(
            latitude,
            longitude,
            selectedPlace.latitude,
            selectedPlace.longitude
          );

          if (distance < 50 && !destinationReached) {
            setDestinationReached(true);
            navigator.geolocation.clearWatch(watcherIdRef.current);
            alert("You have reached your destination!");
          } else if (!destinationReached) {
            calculateRoutes(newLocation, selectedPlace);
            if (mapRef.current) {
              mapRef.current.panTo(newLocation);
            }
          }
        },
        (error) => {
          console.error("Error watching position:", error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 10000,
          timeout: 5000,
        }
      );

      return () => {
        if (watcherIdRef.current) {
          navigator.geolocation.clearWatch(watcherIdRef.current);
        }
      };
    }
  }, [selectedPlace, calculateRoutes, destinationReached]);

  // ดึงตำแหน่งเริ่มต้นของผู้ใช้
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching initial location:", error)
      );
    }
  }, []);

  // Display Turn-by-Turn Directions
  const displayTurnByTurnInstructions = () => {
    if (!directions) return null;

    const steps = directions.routes[0]?.legs[0]?.steps || [];
    return steps.map((step, index) => (
      <div
        key={index}
        className={`p-2 border-b ${index === currentLegIndex ? "bg-yellow-100" : ""}`}
      >
        <div dangerouslySetInnerHTML={{ __html: step.instructions }} />
        <p className="text-gray-500 text-sm">
          {Math.round(step.distance.value / 1000)} km
        </p>
      </div>
    ));
  };

  // Automatically Update Current Step Index
  useEffect(() => {
    if (directions) {
      const steps = directions.routes[0]?.legs[0]?.steps || [];
      if (currentLegIndex < steps.length) {
        const interval = setInterval(() => {
          setCurrentLegIndex((prevIndex) => prevIndex + 1);
        }, 5000); // Move to next step every 5 seconds (for simulation)

        return () => clearInterval(interval); // Cleanup interval
      }
    }
  }, [directions, currentLegIndex]);

  useEffect(() => {
    // เมื่อ mapRef และตำแหน่งผู้ใช้พร้อม จะย้ายตำแหน่งแผนที่ไปยังตำแหน่งของผู้ใช้
    if (mapRef.current && userLocation) {
      mapRef.current.panTo(userLocation);
    }
  }, [userLocation]); // useEffect จะทำงานเมื่อ userLocation เปลี่ยนแปลง

  useEffect(() => {
    // ถ้าข้อมูลพร้อมและมีสถานที่ใกล้เคียงหรือผลลัพธ์การค้นหา จะคำนวณเส้นทาง
    if (
      isLoaded &&
      userLocation &&
      searchResults.length > 0 &&
      searchResults[0]?.latitude &&
      searchResults[0]?.longitude &&
      (searchResults.length > 0 || nearbyPlaces.length > 0)
    ) {
      calculateRoutes(userLocation, searchResults[0]);
    }
  }, [isLoaded, userLocation, searchResults, nearbyPlaces, calculateRoutes]); // useEffect จะทำงานเมื่อค่าใดๆ ใน dependency เปลี่ยน

  if (!isLoaded) {
    return null; // ถ้ายังโหลด Google Maps API ไม่เสร็จ จะไม่แสดงผลอะไรเลย
  }

  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry.fill",
      stylers: [{ color: "#fef3e2" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#b3d9ff" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#ffa726" }, { lightness: 40 }],
    },
    {
      featureType: "road",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffcc80" }],
    },
    {
      featureType: "poi",
      elementType: "geometry.fill",
      stylers: [{ color: "#ffebcc" }],
    },
    {
      featureType: "landscape",
      elementType: "geometry.fill",
      stylers: [{ color: "#fff5e6" }],
    },
    {
      featureType: "administrative",
      elementType: "geometry.stroke",
      stylers: [{ color: "#f9a825" }, { lightness: 50 }],
    },
  ];

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "calc(100vh - 200px)" }}
        center={mapCenter}
        zoom={14}
        options={{
          styles: mapStyles,
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          disableDefaultUI: false,
          clickableIcons: false,
        }}
        onClick={handleMapClick}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {/* วงกลมแสดงตำแหน่งปัจจุบันของผู้ใช้ */}
        {userLocation && (
          <>
            <Marker
              position={userLocation}
              icon={{
                url: "/icons/user.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              animation={google.maps.Animation.BOUNCE}
            />
            <Circle
              center={userLocation}
              radius={radius}
              options={{
                fillColor: "#FF7043",
                fillOpacity: 0.2,
                strokeColor: "#FF7043",
                strokeOpacity: 0.5,
                strokeWeight: 2,
              }}
            />
          </>
        )}
        {/* วงกลมแสดงตำแหน่งที่คลิกบนแผนที่ */}
        {clickLocation && (
          <>
            <Marker
              position={clickLocation}
              icon={{
                url: "/icons/tap.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              animation={google.maps.Animation.BOUNCE}
            />
            <Circle
              center={clickLocation}
              radius={radius}
              options={{
                fillColor: "#FF8A65",
                fillOpacity: 0.1,
                strokeColor: "#FF7043",
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
          </>
        )}

        {searchResults.map((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for place ID: ${place.id}`);
            return null;
          }

          return (
            <Marker
              key={place.id}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              icon={{
                // url: place.images[0]?.image_url || "/icons/location-pin.png",
                url:"/icons/location-pin.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              animation={hoveredMarkerId === place.id ? google.maps.Animation.BOUNCE : null}
              onMouseOver={() => setHoveredMarkerId(place.id)}
              onMouseOut={() => setHoveredMarkerId(null)}
              onClick={() => {
                onSelectPlace(place);
                calculateRoutes(userLocation, place);
              }}
            />
          );
        })}

        {nearbyPlaces.map((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for place ID: ${place.id}`);
            return null;
          }

          return (
            <Marker
              key={place.id}
              position={{ lat, lng }}
              icon={{
                url:
               "/icons/location-pin.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              // icon={{
              //   url:
              //     place.images && place.images[0]?.image_url
              //       ? place.images[0].image_url
              //       : "/icons/location-pin.png",
              //   scaledSize: new window.google.maps.Size(30, 30),
              // }}
              animation={
                hoveredMarkerId === place.id ? google.maps.Animation.BOUNCE : undefined
              }
              onMouseOver={() => setHoveredMarkerId(place.id)}
              onMouseOut={() => setHoveredMarkerId(null)}
              onClick={() => {
                onSelectPlace(place);
                calculateRoutes(userLocation, place);
              }}
            />
          );
        })}

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#FF7043",
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
              suppressMarkers: true, // ปิดการแสดง markers บนเส้นทาง
            }}
          />
        )}

        {selectedPlace && (
          <InfoWindow
            position={{
              lat: Number(selectedPlace.latitude),
              lng: Number(selectedPlace.longitude),
            }}
            onCloseClick={() => onSelectPlace(null)}
          >
            <div className="flex flex-col md:flex-row items-center max-w-md p-4 bg-white rounded-lg shadow-lg text-gray-800 space-y-4 md:space-y-0 md:space-x-4">
              <NextImage
                src={
                  selectedPlace.images && selectedPlace.images[0]?.image_url
                    ? selectedPlace.images[0].image_url
                    : "/icons/location-pin.png"
                }
                alt={selectedPlace.ticket_id}
                width={100}
                height={100}
                className="object-cover rounded-md shadow"
              />

              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-orange-500" />
                  ticket_id:  {selectedPlace.ticket_id}
                </h3>

                <p className="text-sm text-orange-500 font-semibold flex items-center mb-2">
                  <FaTag className="mr-2" />
                  {selectedPlace.type}
                </p>
                <p className="text-sm text-orange-500 font-semibold flex items-center mb-2">
                  <FaTag className="mr-2" />
                  {selectedPlace.organization}
                </p>
                <p className="text-sm text-orange-500 font-semibold flex items-center mb-2">
                  <FaTag className="mr-2" />
                  {selectedPlace.comment}
                </p>
                <p className="text-sm text-orange-500 font-semibold flex items-center mb-2">
                  <FaTag className="mr-2" />
                  {selectedPlace.address}
                </p>
                <div className="flex space-x-2 mt-4">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-500 text-white px-2 py-1 md:px-3 md:py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center space-x-2"
                  >
                    <FaDirections className="inline-block" />
                    <span>นำทาง</span>
                  </a>

                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Turn-by-Turn Directions Display */}
      <div className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md max-h-48 overflow-y-auto">
        {displayTurnByTurnInstructions()}
      </div>
    </div>
  );
};

export default MapSearch;
