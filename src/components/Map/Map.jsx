"use client";
import React, { useRef, useEffect, useState, useCallback,Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
} from "@react-google-maps/api";
import { 
  MapPin, 
  Tag, 
  Navigation, 
  Check, 
  Building, 
  MessageCircle, 
  Star,
  ClipboardCheck ,
  XCircle
} from "lucide-react";
import NextImage from "next/image";
import ReviewModal from "@/components/Map/ReviewModal";
import CommentsSection  from "@/components/Map/CommentsSection";
const MapSearch = ({
  isLoaded,

  mapCenter,
  searchResults,
  nearbyPlaces,
  selectedPlace,
  onSelectPlace,
  fetchNearbyPlaces,
}) => {
  const mapRef = useRef(null);
  const [clickLocation, setClickLocation] = useState(null);
  const [radius, setRadius] = useState(30000);
  const [directions, setDirections] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const watcherIdRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // For ReviewModal
  const [isDialogOpen, setIsDialogOpen] = useState(true); // For Dialog modal
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false); // Comments modal state
  const [commentsData, setCommentsData] = useState({ comments: [], title: "" }); // Selected comments

  const handleViewComments = (comments, title) => {
    setCommentsData({ comments, title });
    setIsCommentsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setIsCommentsModalOpen(false);
    setCommentsData({ comments: [], title: "" });
  };
  
  const fetchComments = (type) => {
    const comments = type === "agree" ? selectedPlace.agreeComments : selectedPlace.disagreeComments;
    return comments || [];
  };

  // Handle opening the ReviewModal and closing the main Dialog
  const handleReviewButtonClick = () => {
    setIsDialogOpen(false); // Close the Dialog
    setIsModalOpen(true); // Open the ReviewModal
  };

  // Handle marker clicks
  const handleMarkerClick = (place) => {
    onSelectPlace(place); // Set the selected place directly
    setIsDialogOpen(true); // Ensure the Dialog opens when a place is selected
  };

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
        mapRef.current.panTo({ lat: Number.parseFloat(latitude), lng: Number.parseFloat(longitude) });
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
      if (selectedPlace) {
        if (!navigator.geolocation) {
          console.error("Geolocation is not supported by this browser.");
          return;
        }
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
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert("Permission denied for location access.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location unavailable.");
              break;
            case error.TIMEOUT:
              alert("Location request timed out.");
              break;
            default:
              alert("An unknown error occurred.");
              break;
          }
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
  const checkGeolocationPermission = async () => {
    if (!navigator.permissions || !navigator.geolocation) {
      console.error("Permissions API or Geolocation is not supported by this browser.");
      return;
    }

    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
      if (permissionStatus.state === "granted") {
        // ถ้าได้รับอนุญาตแล้ว ให้ดึงตำแหน่งปัจจุบัน
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.error("Error fetching initial location:", error),
          { enableHighAccuracy: true }
        );
      } else if (permissionStatus.state === "prompt") {
        // ถ้าสถานะคือ prompt ให้ขอสิทธิ์จากผู้ใช้
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (error) => console.error("Error fetching initial location:", error),
          { enableHighAccuracy: true }
        );
      } else {
        console.warn("Geolocation permission denied.");
      }

      // Listen for changes in permission state
      permissionStatus.onchange = () => {
        console.log(`Permission state changed to: ${permissionStatus.state}`);
      };
    } catch (error) {
      console.error("Error checking geolocation permissions:", error);
    }
  };

  checkGeolocationPermission();
}, []);


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

  return (
    <div className="relative h-screen">
      <GoogleMap
        mapContainerStyle={{ width: "100%",  height: "100vh", }}
        center={mapCenter}
        zoom={14}
        options={{
          zoomControl: true,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          disableDefaultUI: false,
          clickableIcons: false,
          gestureHandling: "greedy", 
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
                fillColor: "#15803d",
                fillOpacity: 0.2,
                strokeColor: "#15803d",
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
                fillColor: "#84cc16",
                fillOpacity: 0.1,
                strokeColor: "#84cc16",
                strokeOpacity: 0.3,
                strokeWeight: 2,
              }}
            />
          </>
        )}

        {searchResults.map((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
          if (isNaN(lat) || isNaN(lng)) {
            console.warn(`Invalid coordinates for place ID: ${place.id}`);
            return null;
          }

          return (
            <Marker
              key={place.id}
              position={{ lat: Number(place.latitude), lng: Number(place.longitude) }}
              icon={{
                url:"/icons/location-pin.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
              animation={hoveredMarkerId === place.id ? google.maps.Animation.BOUNCE : null}
              onMouseOver={() => setHoveredMarkerId(place.id)}
              onMouseOut={() => setHoveredMarkerId(null)}
              onClick={() => {
                handleMarkerClick(place);
                // onSelectPlace(place);
                calculateRoutes(userLocation, place);
              }}
            />
          );
        })}

        {nearbyPlaces.map((place) => {
          const lat = Number(place.latitude);
          const lng = Number(place.longitude);

          // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
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
                strokeColor: "#166534",
                strokeOpacity: 0.8,
                strokeWeight: 6,
              },
              suppressMarkers: true,
            }}
          />
        )}
      </GoogleMap>
   {/* Dialog Modal for Selected Place */}
   {selectedPlace && isDialogOpen && (
      <Transition as={Fragment} show={true}>
        <Dialog as="div" className="relative z-50" onClose={() => onSelectPlace(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-emerald-900 bg-opacity-40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                   <Dialog.Panel className="bg-white rounded-xl p-4 max-w-sm shadow-xl w-full">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-6 h-6 text-emerald-600" />
                      <h3 className="text-xl font-bold text-emerald-800">
                        {selectedPlace?.ticket_id || "สถานที่ไม่ระบุ"}
                      </h3>
                    </div>
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                      onClick={() => onSelectPlace(null)}
                      className="text-emerald-500 hover:text-emerald-700 transition-colors"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
               {/* Image Section */}
<div className="mb-6 grid grid-cols-2 gap-4">
  {/* รูปภาพก่อน */}
  <div className="rounded-xl overflow-hidden border border-emerald-100">
    <NextImage
      src={selectedPlace?.images?.[0]?.image_url || "/icons/location-pin.png"} // รูปภาพก่อน
      alt="รูปภาพก่อน"
      width={300}
      height={200}
      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
    />
    <div className="text-center bg-emerald-50 py-2 text-emerald-800 font-semibold">
      รูปภาพก่อน
    </div>
  </div>

  {/* รูปภาพหลัง */}
  <div className="rounded-xl overflow-hidden border border-emerald-100">
    <NextImage
      src={selectedPlace?.images?.[1]?.image_url || "/icons/location-pin.png"} // รูปภาพหลัง
      alt="รูปภาพหลัง"
      width={300}
      height={200}
      className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
    />
    <div className="text-center bg-emerald-50 py-2 text-emerald-800 font-semibold">
      รูปภาพหลัง
    </div>
  </div>
</div>


                  {/* Details Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
                        <Tag className="w-5 h-5 text-emerald-500" />
                        <span className="text-emerald-800">ประเภท: {selectedPlace?.type || "ไม่ระบุ"}</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
                        <Building className="w-5 h-5 text-emerald-600" />
                        <span className="text-emerald-800">หน่วยงาน: {selectedPlace?.organization || "ไม่ระบุ"}</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-emerald-50 p-3 rounded-lg">
                        <MessageCircle className="w-5 h-5 text-emerald-500" />
                        <span className="text-emerald-800">หมายเหตุ: {selectedPlace?.comment || "ไม่มีหมายเหตุ"}</span>
                      </div>
                    </div>
                  {/* Investigators Section */}
{selectedPlace?.investigators && selectedPlace.investigators.length > 0 && (
  <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 space-y-4">
    <h4 className="text-lg font-bold text-emerald-800">รายชื่อผู้ตรวจสอบ</h4>
    <p className="text-emerald-700">
      {selectedPlace.investigators.slice(0, 2).join(", ")}
      {selectedPlace.investigators.length > 2 && (
        <> + {selectedPlace.investigators.length - 2} คน </>
      )}
    </p>
  </div>
)}

                  {/* Review Summary */}

{selectedPlace?.reviewSummary &&
  (selectedPlace.reviewSummary.passCount > 0 || selectedPlace.reviewSummary.failCount > 0) && (
    <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 space-y-4">
      <div className="text-center">
        <h4 className="text-lg font-bold text-emerald-800">สรุปผลโหวต</h4>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {/* Pass Section */}
        <div className="flex flex-col items-center bg-green-100 p-3 rounded-lg">
          <Check className="w-7 h-7 text-green-600 mb-2" />
          <p className="text-green-800 font-semibold">
            ผ่าน: {selectedPlace.reviewSummary.passCount || 0}
          </p>
          <p className="text-sm text-gray-600">
            ความคิดเห็น: {selectedPlace?.agreeComments?.length || 0}
          </p>
          {selectedPlace?.agreeComments?.length > 0 && (
            // biome-ignore lint/a11y/useButtonType: <explanation>
<button
              onClick={() =>
                handleViewComments(selectedPlace.agreeComments, "ความคิดเห็นที่เห็นด้วย")
              }
              className="text-green-700 underline text-sm mt-2"
            >
              ดูความคิดเห็น
            </button>
          )}
        </div>

        {/* Fail Section */}
        <div className="flex flex-col items-center bg-red-100 p-3 rounded-lg">
          <XCircle className="w-7 h-7 text-red-600 mb-2" />
          <p className="text-red-800 font-semibold">
            ไม่ผ่าน: {selectedPlace.reviewSummary.failCount || 0}
          </p>
          <p className="text-sm text-gray-600">
            ความคิดเห็น: {selectedPlace?.disagreeComments?.length || 0}
          </p>
          {selectedPlace?.disagreeComments?.length > 0 && (
            // biome-ignore lint/a11y/useButtonType: <explanation>
<button
              onClick={() =>
                handleViewComments(selectedPlace.disagreeComments, "ความคิดเห็นที่ไม่เห็นด้วย")
              }
              className="text-red-700 underline text-sm mt-2"
            >
              ดูความคิดเห็น
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center justify-center bg-yellow-100 p-3 rounded-lg">
        <Star className="w-6 h-6 text-yellow-500 mr-2" />
        <p className="text-emerald-900 font-bold">
          คะแนนเฉลี่ย:{" "}
          <span className="text-emerald-700">
            {selectedPlace?.reviewSummary?.averageStars
              ? Number.parseFloat(selectedPlace.reviewSummary.averageStars).toFixed(1)
              : "N/A"}
          </span>
        </p>
      </div>
    </div>
  )}


                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex justify-end space-x-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation?.lat},${userLocation?.lng}&destination=${selectedPlace?.latitude},${selectedPlace?.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 flex items-center space-x-2 transition-colors"
                    >
                      <Navigation className="w-5 h-5" />
                      <span>นำทาง</span>
                    </a>
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                      onClick={handleReviewButtonClick}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2 transition-colors"
                    >
                      <ClipboardCheck className="w-5 h-5" />
                      <span>โหวต</span>
                      </button>
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                      onClick={() => onSelectPlace(null)}
                      className="bg-gray-200 text-emerald-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center space-x-2 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>ปิด</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    )}
      {selectedPlace && (
      <ReviewModal
      isOpen={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setIsDialogOpen(true); // Reopen the Dialog after closing the ReviewModal
      }}
      place={selectedPlace}
        userLocation={userLocation}
        
      />
   
    )}
     {/* Comments Modal */}
     {isCommentsModalOpen && (
        <Dialog
          as="div"
          className="relative z-50"
          open={isCommentsModalOpen}
          onClose={closeCommentsModal}
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="bg-white p-4 rounded-xl w-full max-w-md shadow-lg">
              <CommentsSection
                comments={commentsData.comments}
                status={commentsData.title.includes("เห็นด้วย") ? "agree" : "disagree"}
              />
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={closeCommentsModal} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg">
                ปิด
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </div>
  
  );
};

export default MapSearch;