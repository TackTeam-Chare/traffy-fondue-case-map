"use client";
import React, { useState, useEffect } from "react";
import ReviewHistory from "@/components/ReviewHistory";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import { fetchUserDashboard } from "@/services/db/api";
import liff from "@line/liff";
import { searchPlaces } from "@/services/db/api";

import {
  FaCoins,
  FaTasks,
  FaUsers,
  FaChartLine,
  FaAward,
  FaBell,
  FaStar,
} from "react-icons/fa";

const Home = () => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]); 
  const [places, setPlaces] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

   const handleOpenHistory = () => {
      setIsHistoryOpen(true);
    };
  
    const handleOpenSearch = () => {
      setIsSearchOpen(true);
    };

    const handleSearch = async (filters) => {
      try {
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
      } 
    };
  
  const dailyMissions = [
    { id: 1, title: "รายงานปัญหาในพื้นที่ห่างไกล", status: "completed" },
    { id: 2, title: "อัปโหลดภาพปัญหา", status: "in-progress" },
  ];

  // ✅ ดึงโปรไฟล์ LINE
  const fetchUserProfile = async () => {
    try {
      const storedProfile = localStorage.getItem("userProfile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUserProfile(profile);
        setUserId(profile.userId);
      } else {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setUserProfile(profile);
          setUserId(profile.userId);
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
      }
    } catch (error) {
      console.error("LINE Login Error:", error);
    }
  };

  // ✅ ดึงข้อมูลแต้มจาก Backend
  const fetchUserDashboardData = async (userId) => {
    try {
      const data = await fetchUserDashboard(userId);
      setPoints(data.points || 0);
      setBadges(data.badges || 0);
    } catch (error) {
      console.error("Failed to fetch user dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const initialize = async () => {
      await fetchUserProfile();
    };
    initialize();
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (userId) {
      fetchUserDashboardData(userId);
    }
  }, [userId]);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-emerald-700 text-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold">📊 ระบบแต้มและรางวัล</h1>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button>
          <FaBell className="text-2xl" />
        </button>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex justify-around mt-4 border-b">
        {[
          { id: "overview", label: "ภาพรวม", icon: <FaChartLine /> },
          { id: "missions", label: "ภารกิจ", icon: <FaTasks /> },
          { id: "community", label: "ชุมชน", icon: <FaUsers /> },
          { id: "rewards", label: "รางวัล", icon: <FaAward /> },
        ].map((tab) => (
          // biome-ignore lint/a11y/useButtonType: <explanation>
<button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1 p-2 ${
              activeTab === tab.id
                ? "text-emerald-800 border-b-2 border-emerald-600"
                : "text-gray-500"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <section className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">🏆 ภาพรวมการสะสมแต้ม</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-yellow-100 rounded-lg flex flex-col items-center">
              <FaCoins className="text-4xl text-yellow-500 mb-2" />
              <p className="text-xl font-bold">{points}</p>
              <span className="text-gray-600">คะแนนสะสม</span>
            </div>
            <div className="p-4 bg-green-100 rounded-lg flex flex-col items-center">
              <FaStar className="text-4xl text-green-500 mb-2" />
              <p className="text-xl font-bold">{badges}</p>
              <span className="text-gray-600">เหรียญตรา</span>
            </div>
          </div>
        </section>
      )}

      {/* Missions Tab */}
      {activeTab === "missions" && (
        <section className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">📅 ภารกิจประจำวัน</h2>
          {dailyMissions.map((mission) => (
            <div
              key={mission.id}
              className={`p-3 mb-2 rounded-lg ${
                mission.status === "completed"
                  ? "bg-green-100"
                  : "bg-yellow-100"
              }`}
            >
              <h3 className="text-md font-semibold">{mission.title}</h3>
              <p
                className={`text-sm ${
                  mission.status === "completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                }`}
              >
                {mission.status === "completed" ? "สำเร็จแล้ว" : "กำลังดำเนินการ"}
              </p>
            </div>
          ))}
        </section>
      )}

         {/* Search Modal */}
         <SearchFilter
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSearch={handleSearch}
      />
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
