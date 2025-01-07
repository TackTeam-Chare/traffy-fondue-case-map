"use client";
import React, { useState, useEffect } from "react";
import ReviewHistory from "@/components/ReviewHistory";
import { Circles } from "react-loader-spinner";
import Footer from "@/components/Footer";
import SearchFilter from "@/components/SearchFilter";
import { searchPlaces } from "@/services/api";

import {
    FaCoins,
    FaTasks,
    FaUsers,
    FaChartLine,
    FaAward,
    FaBell,
    FaStar,
    FaTrophy,
  } from "react-icons/fa";
  import {  GiTrophyCup,  } from "react-icons/gi";

const Home = () => {
  const [places, setPlaces] = useState([]); // ข้อมูลที่จะแสดงใน CaseList
  const [searchResults, setSearchResults] = useState([]); // ข้อมูลการค้นหา
  const [isSearchActive, setIsSearchActive] = useState(false); // ตรวจสอบโหมดการค้นหา
  const [loading, setLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userId, setUserId] = useState(null);

  const [activeTab, setActiveTab] = useState("overview");

  // Mock Data
  const points = 1250;
  const badges = 5;
  const rewards = ["คูปองส่วนลด", "บัตรกำนัล"];
  const dailyMissions = [
    { id: 1, title: "รายงานปัญหาในพื้นที่ห่างไกล", status: "completed" },
    { id: 2, title: "อัปโหลดภาพปัญหา", status: "in-progress" },
  ];
  const leaderboard = [
    { id: 1, name: "User A", points: 2500 },
    { id: 2, name: "User B", points: 2000 },
    { id: 3, name: "User C", points: 1750 },
  ];

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

  



  return (
    <div className="min-h-screen  p-4 ">
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

      {/* Community Tab */}
      {activeTab === "community" && (
        <section className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">🏅 กระดานผู้นำ</h2>
          <ul>
            {leaderboard.map((user, index) => (
              <li
                key={user.id}
                className="flex justify-between items-center p-2 border-b"
              >
                <span>
                  #{index + 1} {user.name}
                </span>
                <span className="text-emerald-600 font-semibold">
                  {user.points} แต้ม
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Rewards Tab */}
      {activeTab === "rewards" && (
        <section className="mt-6 p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">🎁 รางวัลที่ได้รับ</h2>
          <ul>
            {rewards.map((reward, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="p-2 border-b flex items-center gap-2"
              >
                <GiTrophyCup className="text-yellow-500 text-xl" />
                {reward}
              </li>
            ))}
          </ul>
        </section>
      )}
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

export default Home ;
