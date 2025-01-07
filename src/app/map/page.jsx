"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ReviewHistory from "@/components/ReviewHistory";
import { Circles } from "react-loader-spinner";
import Footer from "@/components/Footer";
import {
  fetchPlacesNearbyByCoordinates
} from "@/services/api";

import { useJsApiLoader } from "@react-google-maps/api";
import SearchFilter from "@/components/SearchFilter";
import { searchPlaces } from "@/services/api";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// biome-ignore lint/suspicious/noShadowRestrictedNames: <explanation>
const Map = () => {
  const [places, setPlaces] = useState([]); // ข้อมูลที่จะแสดงใน CaseList
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // ข้อมูลเคสใกล้เคียง
  const [searchResults, setSearchResults] = useState([]); // ข้อมูลการค้นหา
  const [isSearchActive, setIsSearchActive] = useState(false); // ตรวจสอบโหมดการค้นหา
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });
  
  const handleOpenHistory = () => {
    console.log("Opening History Modal");
    setIsHistoryOpen(true);
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSearch = async (filters) => {
    try {
      setLoading(true);
      const data = await searchPlaces({
        ...filters,
        latitude: userLocation?.lat,
        longitude: userLocation?.lng,
      });
      setSearchResults(data); // บันทึกผลการค้นหา
      setPlaces(data); // ใช้ผลการค้นหาเป็น places
      setIsSearchActive(true); // ระบุว่าอยู่ในโหมดการค้นหา
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Fetch the logged-in user profile from localStorage
    const storedUserProfile = localStorage.getItem("userProfile");
    if (storedUserProfile) {
      const profile = JSON.parse(storedUserProfile);
      setUserId(profile.userId); // Assuming `userId` is part of the profile
      console.log('get : userId ')
    }
  }, []);

  useEffect(() => {
    setIsClient(true); // ตั้งค่าว่าเป็น client-side (เบราว์เซอร์) โดยอัปเดต state
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const updateLocation = () => {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          const nearbyPlacesData = await fetchNearbyPlaces(latitude, longitude);
          setNearbyPlaces(nearbyPlacesData); // ตั้งค่า nearbyPlaces
          setPlaces(nearbyPlacesData); // ใช้ nearbyPlaces เป็นค่าเริ่มต้นของ places
          setIsSearchActive(false); // ระบุว่าไม่ใช่โหมดการค้นหา
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user's location:", error);
          setLoading(false);
        }
      );
    };

    updateLocation();
  }, [isClient]);


  const fetchNearbyPlaces = async (lat, lng, radius = 25000) => {
    try {
      setLoading(true);
      const data = await fetchPlacesNearbyByCoordinates(lat, lng, radius);
      return data;
    } catch (error) {
      console.error("Error fetching nearby places:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  
  return (
<div className="container relative mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Header */}
      <div className="text-center m-5">
        <h1 className="text-2xl font-bold text-green-600">ตรวจสอบตำแหน่งงานที่แก้ไข</h1>
        <p className="text-gray-500 text-sm">
       ดูข้อมูลจุดที่แก้ไขปัญหาใกล้คุณ
        </p>
      </div>

 

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Circles
            height="60"
            width="60"
            color="#15803d"
            ariaLabel="loading-indicator"
          />
        </div>
      )}
            {/* Search Modal */}
      <SearchFilter
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
        {/* MapContainer */}
        <div
        className={`flex-1 relative w-full ${loading ? "blur-sm" : ""}`}
        style={{ height: "calc(100vh - 64px)" }}
      >
        {isClient && (
          <MapComponent
            isLoaded={isLoaded}
            userLocation={userLocation}
            mapCenter={mapCenter}
            searchResults={searchResults}
            nearbyPlaces={nearbyPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
            fetchNearbyPlaces={fetchNearbyPlaces}
            isSearchActive={isSearchActive}
            places={places}
   
          />
        )}
      </div>

       {/* ReviewHistory Modal */}
       <ReviewHistory
        userId={userId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
        {/* Footer */}
      <Footer onOpenHistory={handleOpenHistory} onOpenSearch={handleOpenSearch} />
    </div>
  
  );
};

export default Map;
