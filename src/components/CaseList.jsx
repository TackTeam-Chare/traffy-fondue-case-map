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
} from "lucide-react";
import NextImage from "next/image";
import ReviewModal from "@/components/ReviewModal";

const CaseList = ({ cases, isSearchActive, onSelectCase }) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // เปิด Modal รีวิว
  const handleReviewClick = (caseItem, e) => {
    e.stopPropagation(); // ป้องกัน onSelectCase ถูกเรียก
    setSelectedCase(caseItem);
    setIsReviewOpen(true);
  };

  // เปิด Google Maps
  const handleNavigateClick = (caseItem, e) => {
    e.stopPropagation(); // ป้องกัน onSelectCase ถูกเรียก
    if (caseItem.latitude && caseItem.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${caseItem.latitude},${caseItem.longitude}`;
      window.open(url, "_blank");
    } else {
      alert("ไม่พบพิกัดของสถานที่นี้");
    }
  };

  return (
    <div className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <MapPin className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              {isSearchActive ? "ผลการค้นหา" : "เคสใกล้เคียง"}
            </h2>
          </div>
          <span className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full">
            {cases.length} รายการ
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[60vh]">
        {cases.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <MapPin className="w-12 h-12 mb-3 text-gray-300" />
            <p className="text-lg font-medium">ไม่พบข้อมูลเคส</p>
            <p className="text-sm">กรุณาลองค้นหาด้วยเงื่อนไขอื่น</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
                key={caseItem.id}
                onClick={() => onSelectCase(caseItem)}
                className="group p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 text-sm bg-emerald-50 text-emerald-700 rounded-full font-medium">
                      {caseItem.ticket_id || "ไม่ระบุ ID"}
                    </span>
                    <span className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-full">
                      {new Date().toLocaleDateString("th-TH")}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                    {/* Images */}
                    {caseItem.images?.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2 mb-2 p-2">
                      {caseItem.images.slice(0, 2).map((img, index) => (
                        <div
                          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Tag className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{caseItem.type || "ไม่ระบุประเภท"}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Building className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{caseItem.organization || "ไม่ระบุหน่วยงาน"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm font-medium">{caseItem.star || "0"}</span>
                      <span className="text-sm text-gray-500">คะแนน</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm">{caseItem.comment || "ไม่มีหมายเหตุ"}</span>
                    </div>
                  </div>

              
                </div>

                {/* รายชื่อผู้ตรวจสอบ */}
                {caseItem.investigators?.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <Users className="inline w-4 h-4 text-emerald-500 mr-1" />
                    <span>ผู้ตรวจสอบ:</span>{" "}
                    {caseItem.investigators.join(", ") || "ไม่ระบุ"}
                  </div>
                )}

{/* Review Summary */}
{caseItem.reviewSummary && (
  <>
    {Boolean(caseItem.reviewSummary.passCount) ||
    Boolean(caseItem.reviewSummary.failCount) ||
    Boolean(caseItem.reviewSummary.averageStars) ? (
      <div className="mt-3 space-y-1 text-sm text-gray-600">
        {/* แสดงเฉพาะเมื่อมี passCount และไม่เป็น 0 */}
        {caseItem.reviewSummary.passCount > 0 && (
          <p>
            <Check className="inline w-4 h-4 text-green-500" /> เห็นด้วย:{" "}
            {caseItem.reviewSummary.passCount}
          </p>
        )}

        {/* แสดงเฉพาะเมื่อมี failCount และไม่เป็น 0 */}
        {caseItem.reviewSummary.failCount > 0 && (
          <p>
            <XCircle className="inline w-4 h-4 text-red-500" /> ไม่เห็นด้วย:{" "}
            {caseItem.reviewSummary.failCount}
          </p>
        )}

        {/* แสดงเฉพาะเมื่อมี averageStars และไม่เป็น 0 */}
        {caseItem.reviewSummary.averageStars > 0 && (
          <p>
            <Star className="inline w-4 h-4 text-yellow-400" /> คะแนนเฉลี่ย:{" "}
            {Number.parseFloat(caseItem.reviewSummary.averageStars).toFixed(1)}
          </p>
        )}
      </div>
    ) : null}
  </>
)}


                {/* Buttons ชิดขวา */}
                <div className="flex gap-2 mt-4 justify-end">
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={(e) => handleReviewClick(caseItem, e)}
                    className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    รีวิว
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
                    onClick={(e) => handleNavigateClick(caseItem, e)}
                    className="flex items-center px-3 py-1 text-sm bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
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
