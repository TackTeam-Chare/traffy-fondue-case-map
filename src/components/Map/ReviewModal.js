import React, { useState } from "react";
import Modal from "react-modal";
import { 
  CheckCircle2, 
  XCircle, 
  Star, 
  User, 
  ClipboardCheck, 
  Loader2,
  CheckCircle 
} from "lucide-react";
import { saveReview } from "@/services/api";
import { Toaster, toast } from "react-hot-toast";
// Set the app element for react-modal
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

// Responsive Status Toggle Component
const StatusToggle = ({ status, onStatusChange }) => {
  return (
    <div className="flex justify-center space-x-2 sm:space-x-4">
      <button
        type="button"
        onClick={() => onStatusChange('pass')}
        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-all duration-300 
          ${status === 'pass' 
            ? 'bg-green-500 text-white' 
            : 'bg-green-50 text-green-500 border border-green-300 hover:bg-green-100'}`}
      >
        <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>ผ่าน</span>
      </button>
      
      <button
        type="button"
        onClick={() => onStatusChange('fail')}
        className={`flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base transition-all duration-300 
          ${status === 'fail' 
            ? 'bg-red-500 text-white' 
            : 'bg-red-50 text-red-500 border border-red-300 hover:bg-red-100'}`}
      >
        <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>ไม่ผ่าน</span>
      </button>
    </div>
  );
};

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

      const result = await saveReview(place.id, reviewerName, reviewStatus, stars,comment);
      // alert("Review saved successfully!");
      console.log(result);
        // Professional toast notification for success
        toast.success('บันทึนข้อคิดเห็นของท่านสำเร็จ', {
          duration: 4000,
          position: 'bottom-center',
          style: {
            background: '#10B981',
            color: 'white',
            fontWeight: 'bold',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          },
          icon: <CheckCircle className="text-white" />,
        });
  
      onClose();
    } catch (error) {
      console.error("Error saving review:", error);
      alert("Failed to save review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Responsive Star Rating Component
  const StarRating = () => {
    return (
      <div className="flex space-x-1 sm:space-x-2 justify-center">
        {[1, 2, 3, 4, 5].map((starValue) => (
          <Star 
            key={starValue}
            className={`cursor-pointer w-6 h-6 sm:w-8 sm:h-8 ${
              starValue <= stars 
                ? 'text-orange-500 fill-orange-500' 
                : 'text-gray-300'
            } transition-colors duration-200 hover:text-orange-600`}
            onClick={() => setStars(starValue)}
          />
        ))}
      </div>
    );
  };

  return (
  <>  <Toaster />
  <Modal 
    isOpen={isOpen} 
    onRequestClose={onClose}
    contentLabel="Review Modal"
    className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
    overlayClassName="fixed inset-0 bg-black bg-opacity-60 z-40"
  >
    <div className="bg-white w-full max-w-sm sm:max-w-md mx-auto rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl 
      overflow-hidden transform transition-all duration-300 ease-in-out 
      scale-100 hover:scale-[1.02] sm:hover:scale-105">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6 text-white">
        <h2 className="text-xl sm:text-2xl font-bold flex items-center">
          <ClipboardCheck className="mr-2 sm:mr-3 w-6 h-6 sm:w-8 sm:h-8" />
          ตรวจสอบสถานที่
        </h2>
        <p className="text-xs sm:text-sm mt-1 sm:mt-2 opacity-80">
          {place?.ticket_id || "Unknown Location"}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Reviewer Name */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <input
            type="text"
            placeholder="ชื่อผู้ตรวจ"
            value={reviewerName}
            onChange={(e) => setReviewerName(e.target.value)}
            required
            className="w-full pl-8 sm:pl-10 p-2 sm:p-3 text-sm sm:text-base 
            border-2 border-orange-100 rounded-lg 
            focus:ring-2 focus:ring-orange-300 
            transition-all duration-300"
          />
        </div>

        {/* Status Toggle */}
        <div className="space-y-1 sm:space-y-2">
          <label className="block text-center text-xs sm:text-sm text-gray-600">
            ยืนยันการเเก้ไข
          </label>
          <StatusToggle 
            status={reviewStatus} 
            onStatusChange={setReviewStatus} 
          />
        </div>

        {/* Star Rating */}
        <div className="space-y-1 sm:space-y-2">
          <label className="block text-center text-xs sm:text-sm text-gray-600">
            ให้ดาว ({stars} / 5)
          </label>
          <StarRating />
        </div>
        <textarea
value={comment}
onChange={(e) => setComment(e.target.value)}
rows={3}
required
className="w-full p-2 border rounded-lg"
placeholder="กรอกความคิดเห็น..."
></textarea>
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full p-2 sm:p-3 
            text-sm sm:text-base
            bg-gradient-to-r from-orange-500 to-red-500 
            text-white rounded-lg 
            hover:from-orange-600 hover:to-red-600 
            disabled:opacity-50 transition-all duration-300 
            space-x-1 sm:space-x-2"
          >
            {loading ? (
              <Loader2 className="mr-1 sm:mr-2 animate-spin" />
            ) : (
              <ClipboardCheck className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            )}
            {loading ? "กำลังบันทึก..." : "บันทึกการตรวจสอบ"}
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full p-2 sm:p-3 text-sm sm:text-base
            border-2 border-orange-500 
            text-orange-500 rounded-lg 
            hover:bg-orange-50 
            transition-all duration-300"
          >
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  </Modal></>
  );
};

export default ReviewModal;