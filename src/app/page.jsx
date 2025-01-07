"use client";
import React, { useState, useEffect } from "react";
import ReviewHistory from "@/components/ReviewHistory";
import { Circles } from "react-loader-spinner";
import Footer from "@/components/Footer";
import { fetchPlacesNearbyByCoordinates } from "@/services/api";
import SearchFilter from "@/components/SearchFilter";
import { searchPlaces } from "@/services/api";
import CaseList from "@/components/CaseList";
import ReviewModal from "@/components/ReviewModal";

const Home = () => {
  
  const [places, setPlaces] = useState([]); // ข้อมูลที่จะแสดงใน CaseList
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]); // ข้อมูลเคสใกล้เคียง
  const [searchResults, setSearchResults] = useState([]); // ข้อมูลการค้นหา
  const [isSearchActive, setIsSearchActive] = useState(false); // ตรวจสอบโหมดการค้นหา
  const [selectedPlace, setSelectedPlace] = useState(null); // สำหรับแสดง Modal
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const handleOpenHistory = () => {
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
    const storedUserProfile = localStorage.getItem("userProfile");
    if (storedUserProfile) {
      const profile = JSON.parse(storedUserProfile);
      setUserId(profile.userId); // Assuming `userId` is part of the profile
    }
  }, []);

  useEffect(() => {
    setIsClient(true); // ระบุว่าเป็น client-side
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
          setIsSearchActive(false);
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

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <Circles height="60" width="60" color="#15803d" ariaLabel="loading-indicator" />
        </div>
      )}

      {/* Search Modal */}
      <SearchFilter
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* Case List */}
      <div className="mt-4">
        <CaseList
          cases={isSearchActive ? searchResults : nearbyPlaces} // แยกกรณีค้นหาและเคสใกล้เคียง
          isSearchActive={isSearchActive}
          onSelectCase={setSelectedPlace}
        />
      </div>

      {/* Modal แสดงรายละเอียดเคส */}
      {selectedPlace && (
        <ReviewModal
          isOpen={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          place={selectedPlace}
          userLocation={userLocation}
        />
      )}

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

export default Home;
