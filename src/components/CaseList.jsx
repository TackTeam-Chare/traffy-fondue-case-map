"use client";
import React, { useState } from "react";
import {
  MapPin, Tag, Building, Star, MessageCircle,
  Check, XCircle, Navigation, Edit, Users, ThumbsUp,
  ThumbsDown, Eye, CalendarDays
} from "lucide-react";
import NextImage from "next/image";
import ReviewModal from "@/components/ReviewModal";

const CaseList = ({ cases, isSearchActive, onSelectCase }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

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
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isSearchActive ? "ผลการค้นหา" : "เคสใกล้เคียง"}
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
            <p className="text-base font-medium">ไม่พบข้อมูลเคส</p>
            <p className="text-sm">กรุณาลองค้นหาด้วยเงื่อนไขอื่น</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cases.map((caseItem) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="group p-2.5 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all duration-200 cursor-pointer"
              >
                {/* Header with Stats */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-700 rounded-full font-medium">
                    {caseItem.ticket_id || "ไม่ระบุ ID"}
                  </span>
                  <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                    <CalendarDays className="w-3 h-3 text-blue-500" />
                    <span className="text-xs">
                      {new Date().toLocaleDateString("th-TH")}
                    </span>
                  </div>
                </div>

                {/* Images */}
                {caseItem.images?.length > 0 && (
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    {caseItem.images.slice(0, 2).map((img, index) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                        key={index}
                        className="relative aspect-video rounded-md overflow-hidden bg-gray-100"
                      >
                        <NextImage
                          src={img.image_url || "/icons/placeholder.png"}
                          alt={`รูปภาพเคส ${index + 1}`}
                          layout="fill"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Tag className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs">{caseItem.type || "ไม่ระบุประเภท"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Building className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs">{caseItem.organization || "ไม่ระบุหน่วยงาน"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-xs line-clamp-2">{caseItem.comment || "ไม่มีหมายเหตุ"}</span>
                  </div>
                </div>
                 {/* Investigators */}
                 {caseItem.investigators?.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <Users className="inline w-4 h-4 text-emerald-500 mr-1" />
                    <span>ผู้ตรวจสอบ:</span>{" "}
                    {caseItem.investigators.join(", ") || "ไม่ระบุ"}
                  </div>
                )}

                {/* Review Summary */}
                {caseItem.reviewSummary && (
                  <div className="mt-3 flex flex-wrap gap-3 text-sm">
                    {caseItem.reviewSummary.passCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded-full">
                        <Check className="w-4 h-4" />
                        เห็นด้วย: {caseItem.reviewSummary.passCount}
                      </span>
                    )}
                    {caseItem.reviewSummary.failCount > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-700 rounded-full">
                        <XCircle className="w-4 h-4" />
                        ไม่เห็นด้วย: {caseItem.reviewSummary.failCount}
                      </span>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between mt-2 border-t border-gray-200 pt-2">
                  <div className="flex items-center gap-3 text-xs">
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
                  </div>
                  <div className="flex gap-1">
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                      onClick={(e) => handleReviewClick(caseItem, e)}
                      className="flex items-center px-2 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      รีวิว
                    </button>

                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                      onClick={(e) => handleNavigateClick(caseItem, e)}
                      className="flex items-center px-2 py-1 text-xs bg-emerald-500 text-white rounded-md hover:bg-emerald-600"
                    >
                      <Navigation className="w-3 h-3 mr-1" />
                      นำทาง
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ReviewModal isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} place={selectedCase} />
    </div>
  );
};

export default CaseList;