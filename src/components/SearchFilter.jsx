import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchCategories } from '@/services/api';

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [caseType, setCaseType] = useState("");
  const [notInvestigated, setNotInvestigated] = useState(false);
  const [finishedDate, setFinishedDate] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSearch = () => {
    onSearch({ searchTerm, caseType,  notInvestigated: !notInvestigated, finishedDate });
  };

  const handleReset = () => {
    setSearchTerm("");
    setCaseType("");
    setNotInvestigated(false);
    setFinishedDate("");
    onSearch({ searchTerm: "", caseType: "", notInvestigated: false, finishedDate: "" });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Elegant Header */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
<div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-600 to-teal-600 cursor-pointer hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg 
                className="w-5 h-5 text-white"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">ระบบค้นหาและกรองข้อมูล</h2>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white/20 p-2 rounded-lg"
          >
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg 
              className="w-5 h-5 text-white"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </motion.div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 space-y-6 bg-gradient-to-b from-gray-50 to-white">
                {/* Search Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg 
                      className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาเคส..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 hover:border-emerald-500"
                  />
                </div>

                {/* Category Select */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg 
                      className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7"/>
                    </svg>
                  </div>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-emerald-500 bg-white appearance-none cursor-pointer"
                  >
                    <option value="">ทุกประเภท</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Checkbox */}
<div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="notInvestigated"
                    checked={notInvestigated}
                    onChange={() => setNotInvestigated((prev) => !prev)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 transition-colors duration-200"
                  />
                  <label htmlFor="notInvestigated" className="text-sm text-gray-700 cursor-pointer">
                    {notInvestigated
                    ? "แสดงเฉพาะเคสที่ยังไม่ตรวจสอบ"
                      : "แสดงเฉพาะเคสที่ตรวจสอบแล้ว"}
                      </label>
                </div>



                  {/* Date Input */}
                  <div className="relative group md:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                        <svg 
                        className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <input
                      type="date"
                      value={finishedDate}
                      onChange={(e) => setFinishedDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 hover:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={handleSearch}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-emerald-100 hover:shadow-emerald-200"
                  >
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                    <span>ค้นหา</span>
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={handleReset}
                    className="flex-1 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 hover:bg-gray-50"
                  >
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <span>รีเซ็ต</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchFilter;