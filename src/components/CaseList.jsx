"use client";
import React, { useState } from "react";
import {
  MapPin, Tag, Building, Star, MessageCircle,
  Check, XCircle, Navigation, Edit, Users, ThumbsUp,
  ThumbsDown, Eye, CalendarDays, Maximize2, Minimize2,MessageSquare
} from "lucide-react";
import NextImage from "next/image";
import ReviewModal from "@/components/ReviewModal";
import CommentsCaseList from "@/components/CommentsCaseList";

const CaseList = ({ cases, isSearchActive, onSelectCase }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [expandedComments, setExpandedComments] = useState(new Set());
  const [expandedCases, setExpandedCases] = useState(new Set());
  
  const calculateElapsedTime = (timestamp) => {
    if (!timestamp) return "ไม่ระบุ";
  
    const caseDate = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - caseDate) / 1000);
  
    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60);
    const seconds = diffInSeconds % 60;
  
    return `เมื่อ ${days} วันที่เเล้ว`;
    // return `เมื่อ ${days} วัน ${hours} ชม. ${minutes} นาที ${seconds} วิ ที่ผ่านมา`;
  };
  
  


const processedCases = cases.map((caseItem) => {
  const agreeCommentsWithText = caseItem.agreeComments?.filter((comment) => comment.text) || [];
  const disagreeCommentsWithText = caseItem.disagreeComments?.filter((comment) => comment.text) || [];

  const totalComments = agreeCommentsWithText.length + disagreeCommentsWithText.length;

  console.log(`Case ID: ${caseItem.id}, Total Valid Comments: ${totalComments}`);

  return {
    ...caseItem,
    agreeComments: agreeCommentsWithText, // Replace with filtered agreeComments
    disagreeComments: disagreeCommentsWithText, // Replace with filtered disagreeComments
    totalComments, // Use filtered comments count
  };
});



  const toggleComments = (caseId, e) => {
    e.stopPropagation(); // Prevent case selection when clicking comments
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(caseId)) {
        newSet.delete(caseId);
      } else {
        newSet.add(caseId);
      }
      return newSet;
    });
  };

  const handleReviewClick = (caseItem, e) => {
    e.stopPropagation();
    setSelectedCase(caseItem);
    setIsReviewOpen(true);
  };

  const handleNavigateClick = (caseItem, e) => {
    e.stopPropagation();
    if (caseItem.latitude && caseItem.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${caseItem.latitude},${caseItem.longitude}`;
      window.open(url, "_blank");
    } else {
      alert("ไม่พบพิกัดของสถานที่นี้");
    }
  };
  

  return (
    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm max-w-screen-sm mx-auto overflow-x-hidden">
    {/* Header */}
    <div className="p-3 border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="p-1.5 bg-emerald-100 rounded-lg">
            <MapPin className="w-4 h-4 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">
            {isSearchActive ? "ค้นหา" : "ใกล้เคียง"}
          </h2>
        </div>
        <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full">
          {cases.length} รายการ
        </span>
      </div>
    </div>
  
    {/* Content */}
    <div className="p-2 overflow-y-auto max-h-[calc(100vh-180px)]">
      {cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <MapPin className="w-10 h-10 mb-2 text-gray-300" />
          <h3 className="text-lg font-semibold">ไม่พบเคสในบริเวณนี้</h3>
          <p className="text-sm text-gray-400 text-center break-words">
            กรุณาลองค้นหาด้วยเงื่อนไขอื่น หรือขยายระยะทาง
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {processedCases.map((caseItem) => (
            <div
              key={caseItem.id}
              className="group p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer"
            >
              {/* Header with Stats */}
              <div className="flex justify-between items-center mb-2">
                <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full font-medium">
                  {caseItem.ticketId || "ไม่ระบุ ID"}
                </span>
                <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                  <CalendarDays className="w-3 h-3 text-emerald-700" />
                  <span className="text-xs">
                    {caseItem.timestamp
                      ? `${new Date(caseItem.timestamp).toLocaleString(
                          "th-TH",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}`
                      : "ไม่ระบุ"}
                  </span>
                </div>
              </div>
  
              {/* Images */}
              {caseItem.images?.length > 0 ? (
                <div className="grid grid-cols-2 gap-1 mb-2">
                  {caseItem.images.map((img, index) => (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={index}
                      className="relative aspect-video rounded-md overflow-hidden bg-gray-100"
                    >
                      <NextImage
                        src={img.image_url || "/icons/placeholder.png"}
                        alt={`รูปภาพ${index === 0 ? "ก่อน" : "หลัง"}แก้ไข`}
                        layout="fill"
                        className="object-cover max-w-full"
                      />
                      <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1">
                        {index === 0 ? "ก่อนแก้ไข" : "หลังแก้ไข"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50">
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    ไม่มีภาพก่อนหรือหลังการแก้ไข
                  </div>
                </div>
              )}
  
              {/* Description */}
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm text-gray-800 break-words w-full">
                  {caseItem.description || "ไม่มีหมายเหตุ"}
                </div>
              </div>
  
              {/* Details */}
              <div className="space-y-3 mt-2">
                {/* Responsible Organization */}
                <div className="flex items-start gap-2 text-gray-800">
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold">
                    หน่วยงานรับผิดชอบ:{" "}
                    <span className="font-normal">
                      {caseItem.responsibleOrg || "ไม่ระบุหน่วยงาน"}
                    </span>
                  </span>
                </div>
  
                {/* Type */}
                <div className="flex items-start gap-2 text-gray-800">
                  <Tag className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm font-semibold">
                    ประเภท:{" "}
                    <span className="font-normal">
                      {caseItem.type || "ไม่ระบุประเภท"}
                    </span>
                  </span>
                </div>
  
                {/* Address */}
                <div className="flex items-start gap-2 text-gray-800">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="text-sm font-semibold block">
                      {caseItem.address || "ไม่ระบุที่อยู่"}
                    </span>
                  </div>
                </div>
              </div>
  
              {/* Actions */}
              <div className="flex justify-end items-center mt-2 border-t border-gray-200 pt-2">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                  onClick={(e) => handleNavigateClick(caseItem, e)}
                  className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  <Navigation className="w-4 h-4" />
                  นำทาง
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  
  );
};

export default CaseList;