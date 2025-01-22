"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, MapPin, Filter } from "lucide-react";
import CaseList from "@/components/CaseList";
import { fetchFilteredCases } from "@/services/traffy-fondue/api";
import { ClipLoader } from "react-spinners"; // Import spinner

const Home = () => {
  const [radius, setRadius] = useState(50000); // Default to 50 km
  const [status, setStatus] = useState("start"); // Default status
  const [filteredCases, setFilteredCases] = useState([]); // Filtered cases
  const [userLocation, setUserLocation] = useState(null); // User's location
  const [isRadiusOpen, setIsRadiusOpen] = useState(false); // Dropdown state for radius
  const [isStatusOpen, setIsStatusOpen] = useState(false); // Dropdown state for status
  const [isSearchActive, setIsSearchActive] = useState(false); // To differentiate between nearby & search cases
  const [isLoading, setIsLoading] = useState(true); // Loading state

  const handleFilterChange = async () => {
    if (!userLocation) return;

    setIsLoading(true); // Show loading spinner
    try {
      const cases = await fetchFilteredCases({
        radius,
        status,
        lat: userLocation.lat,
        lng: userLocation.lng,
      });
      setFilteredCases(cases);
      setIsSearchActive(true);
    } catch (error) {
      console.error("Error fetching filtered cases:", error);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Fetch nearby cases on initial load using current user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
      },
      (error) => console.error("Error getting user's location:", error)
    );
  }, []);

  // Fetch nearby cases on location load
  useEffect(() => {
    if (userLocation && !isSearchActive) {
      handleFilterChange();
    }
  }, [userLocation, isSearchActive]);

  // Fetch cases whenever radius or status changes
  useEffect(() => {
    if (userLocation) {
      handleFilterChange();
    }
  }, [radius, status]);

  const radiusOptions = [
    { value: 5000, label: "5 กิโลเมตร" },
    { value: 7000, label: "7 กิโลเมตร" },
    { value: 10000, label: "10 กิโลเมตร" },
    { value: 20000, label: "20 กิโลเมตร" },
    { value: 50000, label: "50 กิโลเมตร" },
    { value: 100000, label: "100 กิโลเมตร" },
  ];

  const statusOptions = [
    { value: "start", label: "รอรับเรื่อง" },
    { value: "inprogress", label: "กำลังดำเนินการ" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-4 text-center bg-gradient-to-r from-green-500 to-green-700 p-4 shadow-md text-white rounded-lg">
        <h1 className="text-2xl font-bold">ทราฟฟี่ ฟองดูว์</h1>
        <p className="text-sm">ระบบแจ้งปัญหาและติดตามสถานะการดำเนินงานในพื้นที่</p>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-6">
        {/* Radius Filter */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsRadiusOpen(!isRadiusOpen)}
            className={`flex items-center gap-2 px-4 py-2 border ${
              isRadiusOpen ? "border-green-700" : "border-green-500"
            } text-white rounded-full shadow-md bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 hover:from-green-500 hover:to-green-700`}
          >
            <MapPin className="w-4 h-4" />
            <span>{radiusOptions.find((opt) => opt.value === radius)?.label}</span>
            {isRadiusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isRadiusOpen && (
            <div className="absolute mt-2 w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {radiusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setRadius(option.value);
                    setIsRadiusOpen(false);
                  }}
                  className={`p-2 cursor-pointer hover:bg-green-100 ${
                    radius === option.value ? "bg-green-50 font-bold" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className={`flex items-center gap-2 px-4 py-2 border ${
              isStatusOpen ? "border-green-700" : "border-green-500"
            } text-white rounded-full shadow-md bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300 hover:from-green-500 hover:to-green-700`}
          >
            <Filter className="w-4 h-4" />
            <span>{statusOptions.find((opt) => opt.value === status)?.label}</span>
            {isStatusOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {isStatusOpen && (
            <div className="absolute mt-2 w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => {
                    setStatus(option.value);
                    setIsStatusOpen(false);
                  }}
                  className={`p-2 cursor-pointer hover:bg-green-100 ${
                    status === option.value ? "bg-green-50 font-bold" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Loading Animation */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <ClipLoader color="#22c55e" size={50} />
          <span className="ml-4 text-green-500 font-medium">กำลังโหลดข้อมูล รอสักครู่...</span>
        </div>
      ) : (
        // Case List
        <section className="mb-6">
          <CaseList cases={filteredCases} isSearchActive={isSearchActive} />
        </section>
      )}
    </div>
  );
};

export default Home;
