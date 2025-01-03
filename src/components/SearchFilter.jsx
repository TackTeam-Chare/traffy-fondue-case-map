"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fetchCategories } from "@/services/api";
import { Search, Filter, Calendar, Check, XCircle, Loader, ListFilter, Settings2, ChevronDown } from "lucide-react";

const SearchFilter = ({ onSearch, isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseType, setCaseType] = useState("");
  const [notInvestigated, setNotInvestigated] = useState(false);
  const [finishedDate, setFinishedDate] = useState("");
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = () => {
    onSearch({ searchTerm, caseType, notInvestigated: !notInvestigated, finishedDate });
    onClose(); // ปิด Modal หลังจากค้นหา
  };

  const handleReset = () => {
    setSearchTerm("");
    setCaseType("");
    setNotInvestigated(false);
    setFinishedDate("");
    onSearch({ searchTerm: "", caseType: "", notInvestigated: false, finishedDate: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md px-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-lg bg-white rounded-t-3xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-green-700 to-green-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <h2 className="text-lg font-semibold">ระบบค้นหาและกรองข้อมูล</h2>
          </div>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={onClose} className="hover:text-gray-300 transition-all">
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Search Input */}
          <div className="flex flex-col gap-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Search className="w-5 h-5 text-green-600" />
              คำค้นหา
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="พิมพ์เพื่อค้นหา..."
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 hover:border-green-400 transition-all"
            />
          </div>

          {/* Category Select */}
          <div className="flex flex-col gap-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-green-600" />
              ประเภทเคส
            </label>
            <select
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 hover:border-green-400 transition-all"
            >
              <option value="">ทุกประเภท</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg border border-green-200">
            <input
              type="checkbox"
              id="notInvestigated"
              checked={notInvestigated}
              onChange={() => setNotInvestigated((prev) => !prev)}
              className="w-5 h-5 text-green-600 focus:ring-green-600"
            />
            <label htmlFor="notInvestigated" className="text-sm text-gray-700 flex items-center gap-2">
              {notInvestigated ? (
                <>
                  <Check className="w-5 h-5 text-green-600" />
                  แสดงเฉพาะเคสที่ยังไม่ตรวจสอบ
                </>
              ) : (
                <>
                  <Settings2 className="w-5 h-5 text-gray-500" />
                  แสดงเฉพาะเคสที่ตรวจสอบแล้ว
                </>
              )}
            </label>
          </div>

          {/* Date Input */}
          <div className="flex flex-col gap-2">
            {/* biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
<label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              วันที่เสร็จสิ้น
            </label>
            <input
              type="date"
              value={finishedDate}
              onChange={(e) => setFinishedDate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-600 hover:border-green-400 transition-all"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 flex flex-col sm:flex-row gap-2 border-t bg-green-50">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={handleSearch}
            className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            ค้นหา
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={handleReset}
            className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
          >
            <XCircle className="w-5 h-5 text-gray-500" />
            รีเซ็ต
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="p-4 text-center text-green-600 flex items-center justify-center gap-2">
            <Loader className="w-5 h-5 animate-spin" />
            กำลังโหลดข้อมูล...
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default SearchFilter;
