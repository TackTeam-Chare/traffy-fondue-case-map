"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getUserProfile } from "@/utils/auth";

import {
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Circles } from "react-loader-spinner";

import {
  fetchPlacesNearbyByCoordinates
} from "@/services/api";

import { useJsApiLoader } from "@react-google-maps/api";

const MapComponent = dynamic(() => import("@/components/Map/Map"), {
  ssr: false
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const Home = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fetchProfile = async () => {
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };
      fetchProfile();
    }
  }, []);
  
  useEffect(() => {
    const hideLiffAlert = () => {
        const alertElement = document.querySelector(".liff-alert-class");
        if (alertElement) {
            alertElement.style.display = "none"; // ซ่อนข้อความ
        }
    };

    hideLiffAlert();

    // รอให้ DOM โหลดเสร็จและลองซ่อนอีกครั้ง
    const timeout = setTimeout(hideLiffAlert, 1000);

    return () => clearTimeout(timeout); // Cleanup
}, []);

  useEffect(() => {
    setIsClient(true); // ตั้งค่าว่าเป็น client-side (เบราว์เซอร์) โดยอัปเดต state
  }, []);

  useEffect(() => {
    // ตรวจสอบว่ากำลังรันบน client-side (เบราว์เซอร์) หรือไม่
    if (!isClient) return; // ถ้าไม่ใช่ client-side ให้หยุดการทำงานของ useEffect

    // ฟังก์ชันสำหรับอัปเดตตำแหน่งผู้ใช้
    const updateLocation = () => {
      setLoading(true); // ตั้งสถานะการโหลดเป็น true เพื่อแสดงว่าเริ่มการดึงข้อมูลตำแหน่ง

      // ใช้ navigator.geolocation เพื่อขอตำแหน่งปัจจุบันของผู้ใช้
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // ดึง latitude และ longitude จากตำแหน่งที่ได้รับ
          const { latitude, longitude } = position.coords;

          // แสดงตำแหน่งผู้ใช้ใน console สำหรับ debug
          console.log(`User's location: Latitude ${latitude}, Longitude ${longitude}`);

          // บันทึกตำแหน่งผู้ใช้ลงใน state
          setUserLocation({ lat: latitude, lng: longitude });

          // ดึงข้อมูลสถานที่ใกล้เคียงตามพิกัดที่ได้รับ
          fetchNearbyPlaces(latitude, longitude);

          setLoading(false); // ยกเลิกสถานะการโหลดหลังจากดึงข้อมูลสำเร็จ
        },
        (error) => {
          // จัดการข้อผิดพลาดเมื่อไม่สามารถดึงตำแหน่งผู้ใช้ได้
          console.error("Error getting user's location:", error); // แสดงข้อผิดพลาดใน console
          setLoading(false); // ยกเลิกสถานะการโหลดเมื่อเกิดข้อผิดพลาด
        }
      );
    };

    // เรียกใช้ฟังก์ชัน updateLocation เมื่อ useEffect ทำงาน
    updateLocation();
  }, [isClient]); // useEffect จะทำงานใหม่เมื่อค่า isClient เปลี่ยนแปลง


  const fetchNearbyPlaces = async (lat, lng, radius) => {
    try {
      setLoading(true); // ตั้งสถานะการโหลดเป็น true เพื่อแสดงว่ากำลังดึงข้อมูลสถานที่ใกล้เคียง

      // เรียกใช้ฟังก์ชัน fetchPlacesNearbyByCoordinates เพื่อดึงข้อมูลสถานที่ใกล้เคียง
      const data = await fetchPlacesNearbyByCoordinates(lat, lng, radius);
      
      setNearbyPlaces(data); // บันทึกข้อมูลสถานที่ใกล้เคียงลงใน state
      return Array.isArray(data) ? data : [];
    } catch (error) {
      // จัดการข้อผิดพลาด ถ้าการดึงข้อมูลล้มเหลว
      console.error("Error fetching nearby places:", error); // แสดงข้อผิดพลาดใน console
      setNearbyPlaces([]); // ล้างข้อมูลสถานที่ใกล้เคียงในกรณีที่เกิดข้อผิดพลาด
    } finally {
      setLoading(false); // ไม่ว่าจะสำเร็จหรือเกิดข้อผิดพลาด หยุดการโหลดเสมอ
    }
  };

  const handleCurrentLocationClick = () => {
    // ตรวจสอบว่าฟังก์ชัน geolocation รองรับโดยเบราว์เซอร์หรือไม่
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return; // หากไม่รองรับ ให้หยุดการทำงานของฟังก์ชัน
    }

    setLoading(true); // แสดงสถานะการโหลดข้อมูล

    // ขอสิทธิ์เข้าถึงตำแหน่งปัจจุบันของผู้ใช้
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // ดึง latitude และ longitude จากตำแหน่งปัจจุบันของผู้ใช้
        const { latitude, longitude } = position.coords;
        console.log(`User's updated location: Latitude ${latitude}, Longitude ${longitude}`);

        // อัปเดตตำแหน่งของผู้ใช้ใน state
        setUserLocation({ lat: latitude, lng: longitude });

        // อัปเดตตำแหน่งศูนย์กลางของแผนที่
        setMapCenter({ lat: latitude, lng: longitude });

        // ดึงข้อมูลสถานที่ใกล้เคียงตามตำแหน่งที่อัปเดต
        fetchNearbyPlaces(latitude, longitude);

        setLoading(false); // ยกเลิกสถานะการโหลด
      },
      (error) => {
        // กรณีที่เกิดข้อผิดพลาดในการดึงตำแหน่งผู้ใช้
        console.error("Error getting user's location:", error);
        setLoading(false); // ยกเลิกสถานะการโหลด
      }
    );
  };
  
  if (!userProfile) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Circles height="60" width="60" color="#15803d" ariaLabel="loading-indicator" />
        <p className="ml-4 text-gray-600">กำลังตรวจสอบสถานะการล็อกอิน</p>
      </div>
    );
  }
  
  return (
      <div className="container  relativez mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center m-5">
        <h1 className="text-2xl font-bold text-green-600">ตรวจสอบตำแหน่งงานที่แก้ไข</h1>
        <p className="text-gray-500 text-sm">
       ดูข้อมูลจุดที่แก้ไขปัญหาใกล้คุณ
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
      <button
  onClick={handleCurrentLocationClick}
  className="bg-green-600 text-white w-full sm:w-auto py-3 px-6 rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition-transform duration-150"
>
  <FaMapMarkerAlt className="inline-block mr-2" />
  ตำแหน่งของฉัน
</button>

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

      {/* MapComponent Integration */}
      <div className={`w-full h-96 mb-6 ${loading ? "blur-sm" : ""}`}>
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
          />
        )}
      </div>
   
    </div>

  );
};

export default Home;
