import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import {
  CheckCircle2,
  XCircle,
  Star,
  ClipboardCheck,
  Loader2,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import { saveReview } from "@/services/api";
import { Toaster, toast } from "react-hot-toast";
import liff from "@line/liff";
import { getUserProfile } from "@/utils/auth";
if (typeof window !== "undefined") {
  Modal.setAppElement("body");
}

const StatusToggle = ({ status, onStatusChange }) => (
  <div className="grid grid-cols-2 gap-4">
    <button
      type="button"
      onClick={() => onStatusChange("pass")}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 
        ${
          status === "pass"
            ? "bg-emerald-600 text-white shadow-md"
            : "bg-emerald-100 text-emerald-600 border border-emerald-300 hover:bg-emerald-200"
        }`}
    >
      <CheckCircle2 className="w-5 h-5" />
      <span>ผ่าน</span>
    </button>
    <button
      type="button"
      onClick={() => onStatusChange("fail")}
      className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm transition-all duration-300 
        ${
          status === "fail"
            ? "bg-red-600 text-white shadow-md"
            : "bg-red-100 text-red-600 border border-red-300 hover:bg-red-200"
        }`}
    >
      <XCircle className="w-5 h-5" />
      <span>ไม่ผ่าน</span>
    </button>
  </div>
);

const StarRating = ({ stars, setStars }) => (
  <div className="grid grid-cols-5 gap-2 justify-items-center">
    {[1, 2, 3, 4, 5].map((starValue) => (
      <Star
        key={starValue}
        className={`cursor-pointer w-6 h-6 sm:w-8 sm:h-8 ${
          starValue <= stars ? "text-green-700" : "text-gray-300"
        } transition-colors duration-200 hover:text-green-500`}
        onClick={() => setStars(starValue)}
      />
    ))}
  </div>
);

const ReviewModal = ({ isOpen, onClose, place }) => {
  const [reviewStatus, setReviewStatus] = useState(null);
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");
  const [userProfile, setUserProfile] = useState(null);
  
  useEffect(() => {
    if (place) {
      setReviewStatus(null);
      setStars(0);
      setComment("");
    }
  }, [place]);

  
    useEffect(() => {
      if (typeof window !== "undefined") {
        const fetchProfile = async () => {
          try {
            const profile = await getUserProfile();
            setUserProfile(profile);
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
          }
        };
        fetchProfile();
      }
    }, []);
    
    useEffect(() => {
      const hideLiffAlert = () => {
          const alertElement = document.querySelector(".liff-alert-class");
          if (alertElement) {
              alertElement.style.display = "none"; // ซ่อนข้อความ
          }
      };
  
      hideLiffAlert();
  
      // รอให้ DOM โหลดเสร็จและลองซ่อนอีกครั้ง
      const timeout = setTimeout(hideLiffAlert, 1000);
  
      return () => clearTimeout(timeout); // Cleanup
  }, []);

  const fetchUserProfile = async () => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setUserProfile(JSON.parse(storedProfile));
    } else {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });
        if (!liff.isLoggedIn()) {
          liff.login();
        } else {
          const profile = await liff.getProfile();
          setUserProfile(profile);
          localStorage.setItem("userProfile", JSON.stringify(profile));
        }
      } catch (error) {
        console.error("LINE Login Error:", error);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!reviewStatus) {
      toast.error("กรุณาเลือกเกณฑ์ (ผ่าน/ไม่ผ่าน)", {
        style: { background: "#DC2626", color: "white" },
      });
      setLoading(false);
      return;
    }
    try {
      await saveReview(
        place.id,
        userProfile.userId,
        userProfile.displayName,
        reviewStatus,
        stars,
        comment
      );

      toast.success("บันทึกข้อคิดเห็นของท่านสำเร็จ", {
        style: {
          background: "#059669",
          color: "white",
          fontWeight: "bold",
        },
      });

      onClose();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด! โปรดลองอีกครั้ง", {
        style: { background: "#DC2626", color: "white" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster />
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        contentLabel="Review Modal"
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white w-full max-w-sm rounded-xl shadow-lg transform transition-all">
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-6 text-white">
            <h2 className="text-lg font-bold flex items-center">
              <ClipboardCheck className="w-6 h-6 mr-2" />
              ตรวจสอบสถานที่
            </h2>
            <p className="text-sm mt-1">{place?.ticket_id || "Unknown Location"}</p>
            {userProfile && (
              <div className="flex items-center space-x-3 mt-3">
                <img
                  src={userProfile.pictureUrl}
                  alt={userProfile.displayName}
                  className="w-10 h-10 rounded-full shadow-lg"
                />
                <span className="text-sm font-semibold">{userProfile.displayName}</span>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-600">
                เกณฑ์ <span className="text-red-500">*</span>
              </label>
              <StatusToggle status={reviewStatus} onStatusChange={setReviewStatus} />
              {!reviewStatus && (
                <p className="text-red-500 text-xs mt-1">กรุณาเลือกเกณฑ์ (ผ่าน/ไม่ผ่าน)</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-600">ให้ดาว</label>
              <StarRating stars={stars} setStars={setStars} />
            </div>

            <div className="relative">
              <label className="block text-sm mb-2 text-gray-600 flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>ความคิดเห็น</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 resize-none"
                placeholder="กรอกความคิดเห็น..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={!reviewStatus || loading}
                className={`flex items-center justify-center py-3 rounded-lg transition-all duration-300 ${
                  !reviewStatus || loading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                ) : (
                  <>
                    <CheckCircle className="mr-2 w-5 h-5" />
                    บันทึก
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex items-center justify-center bg-gray-200 text-gray-600 rounded-lg py-3 hover:bg-gray-300"
              >
                <XCircle className="mr-2 w-5 h-5" />
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default ReviewModal;
