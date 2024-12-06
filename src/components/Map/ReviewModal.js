import React, { useState } from "react";
import Modal from "react-modal";
import {
  CheckCircle2,
  XCircle,
  Star,
  User,
  ClipboardCheck,
  Loader2,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import { saveReview } from "@/services/api";
import { Toaster, toast } from "react-hot-toast";

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
            ? "bg-green-500 text-white shadow-md"
            : "bg-green-50 text-green-600 border border-green-300 hover:bg-green-100"
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
            ? "bg-red-500 text-white shadow-md"
            : "bg-red-50 text-red-600 border border-red-300 hover:bg-red-100"
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
          starValue <= stars ? "text-yellow-400" : "text-gray-300"
        } transition-colors duration-200 hover:text-yellow-500`}
        onClick={() => setStars(starValue)}
      />
    ))}
  </div>
);

const ReviewModal = ({ isOpen, onClose, place }) => {
  const [reviewerName, setReviewerName] = useState("");
  const [reviewStatus, setReviewStatus] = useState("pass");
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!place || !place.id) {
        throw new Error("Invalid place ID");
      }

      await saveReview(place.id, reviewerName, reviewStatus, stars, comment);

      toast.success("บันทึกข้อคิดเห็นของท่านสำเร็จ", {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#10B981",
          color: "white",
          fontWeight: "bold",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        icon: <CheckCircle className="text-white" />,
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
        <div className="bg-white w-full max-w-sm rounded-xl shadow-lg overflow-hidden transform transition-all">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
            <h2 className="text-lg font-bold flex items-center">
              <ClipboardCheck className="w-6 h-6 mr-2" />
              ตรวจสอบสถานที่
            </h2>
            <p className="text-sm mt-1">{place?.ticket_id || "Unknown Location"}</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 text-orange-500 w-5 h-5" />
              <input
                type="text"
                placeholder="ชื่อผู้ตรวจ"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Status Section */}
            <div>
              <label className="block text-sm mb-2 text-gray-600">เกณฑ์</label>
              <StatusToggle status={reviewStatus} onStatusChange={setReviewStatus} />
            </div>

            {/* Star Rating Section */}
            <div>
              <label className="block text-sm mb-2 text-gray-600">ให้ดาว</label>
              <StarRating stars={stars} setStars={setStars} />
            </div>

        {/* Comment Section */}
<div className="relative">
  <label className="block text-sm mb-2 text-gray-600 flex items-center space-x-2">
    <MessageCircle className="w-5 h-5 text-orange-500" /> {/* Added Comment Icon */}
    <span>ความคิดเห็น</span>
  </label>
  <textarea
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    rows={3}
    required
    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 resize-none"
    placeholder="กรอกความคิดเห็น..."
  ></textarea>
</div>


        {/* Action Buttons */}
<div className="grid grid-cols-2 gap-4">
  <button
    type="submit"
    disabled={loading}
    className="flex items-center justify-center bg-orange-500 text-white rounded-lg py-3 hover:bg-orange-600"
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
