
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  MapPin,
  Star,
  MessageSquare,
  Clock,
  AlertCircle,
  Loader2,
  Building2,
  Ticket,
  FileType,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Timer,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";


const ReviewHistory = ({ userId, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateElapsedTime = (timestamp) => {
    if (!timestamp) return "ไม่ระบุ";
  
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
  
    const days = Math.floor(diffInSeconds / (24 * 3600));
    const hours = Math.floor((diffInSeconds % (24 * 3600)) / 3600);
  
    if (days > 0) {
      return `${days} วัน ${hours} ชั่วโมง ที่แล้ว`;
    } else if (hours > 0) {
      return `${hours} ชั่วโมง ที่แล้ว`;
    } else {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} นาที ที่แล้ว`;
    }
  };
  
  
  // ฟังก์ชันสำหรับแปลงนาทีเป็น ชั่วโมง และ นาที
  const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes} นาที`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ชั่วโมง`;
  }
  return `${hours} ชั่วโมง ${remainingMinutes} นาที`;
};

  useEffect(() => {
    if (!isOpen || !userId) return;
  
    const fetchReviewHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/review-history`,
          { params: { userId } }
        );
        console.log("📊 Raw API Response:", response.data);
  
        const formattedHistory = response.data.map((item,index) => {
          console.log("🖼️ User Uploaded Images (Before Parse):", item.user_uploaded_images);
          return {
            reviewId: item.review_id,
            order: index + 1,
            id: item.place_id,
            address: item.address,
            reviewStatus: item.review_status,
            stars: item.stars,
            comment: item.comment,
            displayName: item.display_name,
            ticketId: item.ticket_id,
            type: item.type,
            organization: item.organization,
            state: item.state,
            viewCount: item.view_count,
            likes: item.likes,
            dislikes: item.dislikes,
            durationTotal: item.duration_minutes_total,
            photo: item.photo_before,
            photoAfter: item.photo_after,
            timestamp_inprogress: item.timestamp_inprogress,
            timestamp_finished: item.timestamp_finished,
            subdistrict: item.subdistrict,
            district: item.district,
            province: item.province,
            timestamp: item.user_review_timestamp,
            userUploadedImages: Array.isArray(item.user_uploaded_images)
              ? item.user_uploaded_images
              : [],
          };
        });
  
        console.log("🛠️ Formatted History Data:", formattedHistory);
        setHistory(formattedHistory);
      } catch (err) {
        console.error("Error fetching review history:", err);
        setError("ไม่สามารถโหลดประวัติการตรวจสอบได้");
      } finally {
        setLoading(false);
      }
    };
  
    fetchReviewHistory();
  }, [isOpen, userId]);
  
  

  if (!isOpen) return null;

  const renderStars = (stars) => {
    const totalStars = 5;
    return Array.from({ length: totalStars }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < stars ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full sm:max-w-4xl rounded-2xl shadow-lg max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-emerald-800 text-white px-4 py-3 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Star className="w-5 h-5" />
            ประวัติการตรวจสอบ
          </h2>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full">
            <X className="w-5 h-5" />
          </button>
          
        </div>
          {/* Total Reviews */}
          <div className="px-4 py-2 bg-gray-100 text-gray-700 text-sm">
            คุณได้ตรวจสอบทั้งหมด <span className="font-semibold">{history.length}</span> ครั้ง
          </div>
          
          {/* Content */}
          <div className="overflow-y-auto" style={{ height: "calc(90vh - 57px)" }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Loader2 className="w-8 h-8 text-[#1a4e97] animate-spin mb-3" />
                <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-red-500">
                <AlertCircle className="w-12 h-12 mb-3" />
                <p className="text-center">{error}</p>
              </div>
            ) : history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-gray-500">
                <AlertCircle className="w-12 h-12 mb-3" />
                <p className="text-center">ไม่พบประวัติการตรวจสอบ</p>
              </div>
            ) : (
              <ul className="space-y-4 p-4">
                {history.map((item) => (
                  <motion.li
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.reviewId}
                    className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="p-4 space-y-4">
                      {/* Header with Status */}
                      <div className="flex items-center justify-between pb-3 border-b">
                        <div className="flex items-center gap-2">
                        {/* <div className="text-sm text-gray-600 font-semibold mb-2">
                        ลำดับที่: {item.order}
                      </div> */}
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          item.reviewStatus === "pass" 
                            ? "bg-green-100 text-green-700" 
                            : "bg-red-100 text-red-700"
                        }`}>
                          {item.reviewStatus === "pass" ? "ให้ผ่าน" : "ไม่ผ่าน"}
                        </div>
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded-full">

                            {renderStars(item.stars)}

                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{item.viewCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{item.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{item.dislikes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Location and Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          {/* Location */}
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 flex-shrink-0 mt-1" />
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.address}</p>
                              <p className="text-sm text-gray-600">
                                แขวง{item.subdistrict} เขต{item.district} {item.province}
                              </p>
                            </div>
                          </div>

                          {/* Ticket Info */}
                          {/* <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Ticket className="w-4 h-4" />
                            <span>{item.ticketId}</span>
                          </div> */}

                          {/* Type and Organization */}
                     {/* Type and Organization */}
<div className="space-y-2">
  {/* Type */}
  <div className="flex items-center gap-2 text-sm text-gray-600">
    <FileType className="w-4 h-4" />
    <span> <span className="font-bold">ประเภท: </span>{item.type}</span>
   
  </div>

  {/* Organization */}
  <div className="flex items-start gap-2 text-sm text-gray-600">
    <Building2 className="w-4 h-4 flex-shrink-0 mt-1" />
    <span>
      <span className="font-bold">หน่วยงาน:</span> {item.organization}
    </span>
  </div>
</div>

                        </div>

                  {/* Photos */}
<div className="flex flex-wrap gap-2">
  {/* Photo Before */}
  {item.photo && (
    <div className="relative group">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">ก่อนดำเนินการ</span>
      </div>
      <img 
        src={item.photo} 
        alt="รูปก่อนดำเนินการ"
        className="w-32 h-32 object-cover rounded-lg"
      />
    </div>
  )}

  {/* Photo After */}
  {item.photoAfter && (
    <div className="relative group">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">หลังดำเนินการ</span>
      </div>
      <img 
        src={item.photoAfter} 
        alt="รูปหลังดำเนินการ"
        className="w-32 h-32 object-cover rounded-lg"
      />
    </div>
  )}

{/* User Uploaded Images */}
{item.userUploadedImages && item.userUploadedImages.length > 0 && (
  item.userUploadedImages.map((image, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
<div key={index} className="relative group">
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
        <span className="text-white text-sm">รูปที่โหวต</span>
      </div>
      <img 
  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image}`} 
  alt={`รูปที่โหวต-${index + 1}`}
  className="w-32 h-32 object-cover rounded-lg"
/>

    </div>
  ))
)}


</div>

                      </div>

                      {/* Comment */}
                      {item.comment && (
                        <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                          <MessageSquare className="w-5 h-5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-gray-900">{item.comment}</p>
                          </div>
                        </div>
                      )}

                  {/* Footer Info */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t text-sm text-gray-600">

{/* วันที่ตรวจสอบ */}
<div className="flex flex-col bg-gray-50 p-3 rounded-lg">
  {/* Header */}
  <div className="flex items-center gap-2 mb-1">
    <Clock className="w-5 h-5 " />
    <span className="font-bold text-gray-700">ตรวจสอบเมื่อ</span>
  </div>

  {/* Timestamp */}
  <p className="text-gray-800 font-semibold">
    {item.timestamp
      ? <>
          {new Date(item.timestamp).toLocaleString('th-TH', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })} 
          <span className="text-blue-600 font-bold">
            ({calculateElapsedTime(item.timestamp)})
          </span>
        </>
      : "ไม่ระบุ"}
  </p>
</div>


{/* วันที่เสร็จสิ้น */}
{/* <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
  <div className="flex items-center gap-2 mb-1">
    <Calendar className="w-5 h-5 text-green-500" />
    <span className="font-bold text-gray-700">เริ่มดำเนินการเมื่อ</span>
  </div>
  <p className="text-gray-800 font-semibold">
    {item.timestamp_inprogress
      ? new Date(item.timestamp_inprogress).toLocaleString('th-TH', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })
      : "ไม่ระบุ"}
  </p>
</div> */}
<div className="flex flex-col bg-gray-50 p-3 rounded-lg">
  {/* Header */}
  <div className="flex items-center gap-2 mb-1">
    <Calendar className="w-5 h-5 " />
    <span className="font-bold text-gray-700">เเก้ไขเเล้วเสร็จสิ้นเมื่อ</span>
  </div>

  {/* Timestamp */}
  <p className="text-gray-800 font-semibold">
    {item.timestamp_finished
      ? <>
          {new Date(item.timestamp_finished).toLocaleString('th-TH', {
            dateStyle: 'medium',
            timeStyle: 'short',
          })}
          <span className="text-green-600 font-bold">
            ({calculateElapsedTime(item.timestamp_finished)})
          </span>
        </>
      : "ไม่ระบุ"}
  </p>
</div>


{/* ระยะเวลาดำเนินการ */}
<div className="flex flex-col bg-gray-50 p-3 rounded-lg">
  <div className="flex items-center gap-2 mb-1">
    <Timer className="w-5 h-5 " />
    <span className="font-bold text-gray-700">ระยะเวลาดำเนินการทั้งหมด</span>
  </div>
  <p className="text-gray-800 font-semibold">
  {item.durationTotal
    ? formatDuration(item.durationTotal)
    : "ไม่ระบุ"}
</p>

</div>
</div>

                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewHistory;