"use client";
import React from "react";
import Link from 'next/link'
import { MdHome, MdSearch, MdHistory } from "react-icons/md";
import { FaMapMarkedAlt } from "react-icons/fa";
import { GiAchievement } from "react-icons/gi";

const Footer = ({ onOpenHistory, onOpenSearch }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-emerald-800/90 backdrop-blur-md text-white flex justify-around items-center py-3 shadow-lg z-50">
      {/* หน้าแรก */}
      <Link href="/" className="flex flex-col items-center text-sm hover:text-yellow-400 transition">
        <MdHome size={24} />
        <span>หน้าแรก</span>
      </Link>

      {/* ค้นหา */}
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
        onClick={onOpenSearch}
        className="flex flex-col items-center text-sm hover:text-yellow-400 transition"
      >
        <MdSearch size={24} />
        <span>ค้นหา</span>
      </button>

      {/* แผนที่ */}
      <Link href="/map" className="flex flex-col items-center text-sm hover:text-yellow-400 transition">
        <FaMapMarkedAlt size={24} />
        <span>แผนที่</span>
      </Link>

      {/* ภารกิจ */}
      <Link href="/missions" className="flex flex-col items-center text-sm hover:text-yellow-400 transition">
        <GiAchievement size={24} />
        <span>ภารกิจ</span>
      </Link>

      {/* ประวัติการตรวจสอบ */}
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
        onClick={onOpenHistory}
        className="flex flex-col items-center text-sm hover:text-yellow-400 transition"
      >
        <MdHistory size={24} />
        <span>ประวัติ</span>
      </button>
    </footer>
  );
};

export default Footer;
