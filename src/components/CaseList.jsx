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
    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="p-3 border-b ">
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
            <p className="text-sm text-gray-400">
              กรุณาลองค้นหาด้วยเงื่อนไขอื่น หรือขยายระยะทาง
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {processedCases.map((caseItem) => (
              
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
                key={caseItem.id}
                // onClick={() => onSelectCase(caseItem)}
                className={`group p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer ${
                  expandedCases.has(caseItem.id) ? 'ring-2 ring-blue-200' : ''
                }`}
              >
                {/* Header with Stats and Expand Button */}
                <div className="flex justify-between items-center mb-2">
        
                    <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full font-medium">
                      {/* {caseItem.ticket_id || "ไม่ระบุ ID"} */}
                      {caseItem.ticketId || "ไม่ระบุ ID"}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
    <CalendarDays className="w-3 h-3 text-emerald-700" />
    <span className="text-xs">
      {caseItem.timestamp
        ? `${new Date(caseItem.timestamp).toLocaleString("th-TH", {
            dateStyle: "medium",
            timeStyle: "short",
          })} (${calculateElapsedTime(caseItem.timestamp)})`
        : "ไม่ระบุ"}
    </span>
  </div>

                  </div>


                

                {/* Images */}
                {caseItem.images?.length > 0 ? (
  <div className="grid grid-cols-2 gap-1 mb-2">
    {caseItem.images.map((img, index) => (
      <div
        key={index}
        className="relative aspect-video rounded-md overflow-hidden bg-gray-100"
      >
        <NextImage
          src={img.image_url || "/icons/placeholder.png"}
          alt={`รูปภาพ${index === 0 ? "ก่อน" : "หลัง"}แก้ไข`}
          layout="fill"
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1">
          {index === 0 ? "ก่อนแก้ไข" : "หลังแก้ไข"}
        </div>
      </div>
    ))}
    {caseItem.images.length < 2 && (
      <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50">
        <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
          ไม่มีภาพหลังการแก้ไข
        </div>
      </div>
    )}
  </div>
) : (
  <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50">
    <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
      ไม่มีภาพก่อนหรือหลังการแก้ไข
    </div>
  </div>
)}

  

<div className="flex items-start gap-2">
  <div className="flex-shrink-0">
    <MessageCircle className="w-4 h-4 text-emerald-600" />
  </div>
  <div className="text-sm text-gray-800">
    {caseItem.description && caseItem.description.trim() !== ""
      ? (
        <p className="text-sm leading-5">
          {caseItem.description}
        </p>
      )
      : (
        <p className="text-sm text-gray-400 italic">
          ไม่มีหมายเหตุ
        </p>
      )}
  </div>
</div>



                {/* Details */}
                <div className="space-y-3">
  

  {/* หน่วยงานที่รับผิดชอบ */}
  <div className="flex items-start gap-2 text-gray-800">
    <Building className="w-4 h-4 text-emerald-600" />
    {/* <span className="text-sm font-semibold">
      หน่วยงานรับผิดชอบ: <span className="font-normal">{caseItem.organization_action || "ไม่ระบุหน่วยงาน"}</span>
    </span> */}
    <span className="text-sm font-semibold">
      หน่วยงานรับผิดชอบ: <span className="font-normal">{caseItem.responsibleOrg || "ไม่ระบุหน่วยงาน"}</span>
    </span>
  </div>

  {/* ประเภท */}
  <div className="flex items-start gap-2 text-gray-800">
    <Tag className="w-4 h-4 text-emerald-600" />
    <span className="text-sm font-semibold">
      ประเภท: <span className="font-normal">{caseItem.type || "ไม่ระบุประเภท"}</span>
    </span>
  </div>
  <div className="flex items-start gap-2 text-gray-800">
    <MapPin className="w-4 h-4 text-emerald-600" />
    <div>
      <span className="text-sm font-semibold block">     {caseItem.address || "ไม่ระบุที่อยู่"}</span>
    </div>
  </div>
</div>

                     {/* Investigators */}
                     {caseItem.investigators?.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <Users className="inline w-4 h-4 text-emerald-500 mr-1" />
                    {caseItem.investigators.length === 1 ? (
                      <span>{caseItem.investigators[0]}</span>
                    ) : (
                      <span>
                      {caseItem.investigators[0]} <span className="text-emerald-600">+{caseItem.investigators.length - 1} คน</span>
                    </span>
                    )}
                  </div>
                )}


                    {/* Review Summary */}
                    {caseItem.reviewSummary && (
                      <div className="mt-3 flex flex-wrap gap-3 text-sm">
                        {caseItem.reviewSummary.passCount > 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                            <Check className="w-4 h-4" />
                            เห็นด้วย {caseItem.reviewSummary.passCount} คน
                          </span>
                        )}
                        {caseItem.reviewSummary.failCount > 0 && (
                          <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
                            <XCircle className="w-4 h-4" />
                            ไม่เห็นด้วย {caseItem.reviewSummary.failCount} คน
                          </span>
                        )}
                      </div>
                    )}
             
                {/* Stats and Actions */}
                <div className="flex justify-end items-center mt-2 border-t border-gray-200 pt-2">
                  {/* <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-green-500" />
                      <span>{caseItem.likes || "0"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-3 h-3 text-red-500" />
                      <span>{caseItem.dislikes || "0"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3 text-blue-500" />
                      <span>{caseItem.view_count || "0"}</span>
                    </div>
                    {caseItem.reviewSummary?.averageStars > 0 && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-3 h-3" />
                        <span>{Number.parseFloat(caseItem.reviewSummary.averageStars).toFixed(1)}</span>
                      </div>
                    )}
                  </div> */}
                  <div className="flex gap-1">
          
      
        {/* {caseItem.reviewSummary.passCount > 0 && (
          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-green-50 text-green-700 rounded-full">
            <Check className="w-3 h-3" />
            <span>ผ่าน{caseItem.reviewSummary.passCount}</span>
          </button>
        )}
        {caseItem.reviewSummary.failCount > 0 && (
          <button className="flex items-center gap-1 px-2 py-1 text-xs bg-red-50 text-red-700 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>ไม่ผ่าน{caseItem.reviewSummary.failCount}</span>
          </button>
        )} */}
                {/* Comments Button */}

                {caseItem.totalComments > 0 && (
  // biome-ignore lint/a11y/useButtonType: <explanation>
<button
    onClick={(e) => toggleComments(caseItem.id, e)}
    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
  >
    <MessageSquare className="w-3 h-3" />
    {expandedComments.has(caseItem.id)
      ? `ซ่อน (${caseItem.totalComments})`
      : `ความคิดเห็น (${caseItem.totalComments})`}
  </button>
)}


                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
{/* <button
                      onClick={(e) => handleReviewClick(caseItem, e)}
                      className="flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      รีวิว
                    </button> */}
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
{/* <button
                      onClick={(e) => handleNavigateClick(caseItem, e)}
                      className="flex items-center px-2 py-1 text-xs bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      นำทาง
                    </button> */}
                     {/* Navigate Button */}
        
                  <button
                    onClick={(e) => handleNavigateClick(caseItem, e)}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    <Navigation className="w-4 h-4" />
                    นำทาง
                  </button>
               
                  </div>
                </div>
{/* Comments Section */}
{expandedComments.has(caseItem.id) && (
  <div className="mt-6">
    <CommentsCaseList
      comments={[
        ...caseItem.agreeComments.map((c) => ({ ...c, status: "agree" })),
        ...caseItem.disagreeComments.map((c) => ({ ...c, status: "disagree" })),
      ]}
    />
  </div>
)}


              </div>
            ))}
          </div>
          
        )}
        
      </div>

      {/* Review Modal */}
      {isReviewOpen && selectedCase && (
        <ReviewModal 
          isOpen={isReviewOpen} 
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedCase(null);
          }} 
          place={selectedCase} 
        />
      )}
    </div>
  );
};

export default CaseList;