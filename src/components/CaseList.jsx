"use client";
import React, { useState } from "react";
import {
  MapPin,
  Tag,
  Building,
  Star,
  ChevronRight,
  MessageCircle,
  Check,
  XCircle,
  Navigation,
  Edit,
  Users,
  ThumbsUp,
  ThumbsDown,
  Eye,
  CalendarDays
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
    <div className="mt-4 sm:mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-3 sm:p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              {isSearchActive ? "ผลการค้นหา" : "เคสใกล้เคียง"}
            </h2>
          </div>
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
            {cases.length} รายการ
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 overflow-y-auto max-h-[60vh]">
        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">ไม่พบข้อมูลเคส</p>
            <p className="text-sm">กรุณาลองค้นหาด้วยเงื่อนไขอื่น</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="group p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md"
              >
                {/* Header with Stats */}
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                  {/* Left Section: ID, Date, and Average Rating */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-full font-medium">
                      {caseItem.ticket_id || "ไม่ระบุ ID"}
                    </span>
                    <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      <CalendarDays className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">
                        {new Date().toLocaleDateString("th-TH")}
                      </span>
                    </div>
                    {caseItem.reviewSummary?.averageStars > 0 && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">
                          {Number.parseFloat(caseItem.reviewSummary.averageStars).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right Section: Engagement Stats */}
                  <div className="flex items-center gap-3 ml-auto">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{caseItem.likes || "0"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsDown className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{caseItem.dislikes || "0"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">{caseItem.view_count || "0"}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>

                {/* Images */}
                {caseItem.images?.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 mb-2">
                    {caseItem.images.slice(0, 2).map((img, index) => (
                      <div
                        key={index}
                        className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
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
                <div className="space-y-2 mt-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Tag className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{caseItem.type || "ไม่ระบุประเภท"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Building className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{caseItem.organization || "ไม่ระบุหน่วยงาน"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{caseItem.comment || "ไม่มีหมายเหตุ"}</span>
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

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={(e) => handleReviewClick(caseItem, e)}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    รีวิว
                  </button>
                  <button
                    onClick={(e) => handleNavigateClick(caseItem, e)}
                    className="flex items-center px-3 py-1.5 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    <Navigation className="w-4 h-4 mr-1" />
                    นำทาง
                  </button>
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