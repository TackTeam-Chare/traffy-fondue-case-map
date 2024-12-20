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
  Check, 
  X as XMark 
} from "lucide-react";

const ReviewHistory = ({ userId, isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchReviewHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/review-history`, {
          params: { userId },
        });
        // ตรวจสอบและแปลงข้อมูลให้ตรงกับโครงสร้างที่ต้องการ
        const formattedHistory = response.data.map(item => ({
          reviewId: item.review_id,
          id: item.place_id,
          address: item.address,
          reviewStatus: item.review_status,
          stars: item.stars,
          comment: item.comment,
          timestamp: item.timestamp,
          displayName: item.display_name,
          ticketId: item.ticket_id,
          type: item.type,
          organization: item.organization
        }));
        setHistory(formattedHistory);
        console.log("Fetched history:", formattedHistory); // Debug log
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

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl md:max-w-lg sm:max-w-sm overflow-hidden shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">ประวัติการตรวจสอบ</h2>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="ปิด"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              <span className="ml-2">กำลังโหลด...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-8 text-red-500">
              <AlertCircle className="w-6 h-6 mr-2" />
              <p>{error}</p>
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <AlertCircle className="w-8 h-8 mb-2" />
              <p>ไม่พบประวัติการตรวจสอบ</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {history.map((item) => (
                <li
                  key={item.reviewId}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <p><span className="font-semibold">สถานที่: </span>{item.address || "ไม่ระบุ"}</p>
                        <p className="text-sm text-gray-500">Ticket ID: {item.ticketId}</p>
                        <p className="text-sm text-gray-500">ประเภท: {item.type}</p>
                        <p className="text-sm text-gray-500">หน่วยงาน: {item.organization}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {item.reviewStatus === "pass" ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <XMark className="w-5 h-5 text-red-500" />
                      )}
                      <span className="font-semibold">สถานะ: </span>
                      <span className={item.reviewStatus === "pass" ? "text-green-500" : "text-red-500"}>
                        {item.reviewStatus === "pass" ? "ผ่าน" : "ไม่ผ่าน"}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold">คะแนน: </span>
                      <span>{item.stars || "ไม่ระบุ"}</span>
                    </div>

                    {/* Comment */}
                    {item.comment && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <span className="font-semibold">ความคิดเห็น: </span>
                          <span>{item.comment}</span>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                      <Clock className="w-4 h-4" />
                      <time>
                        ตรวจสอบเมื่อ: {new Date(item.timestamp).toLocaleString('th-TH', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewHistory;