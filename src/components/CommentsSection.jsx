import React from "react";
import Image from 'next/image'
import { Check, XCircle, MessageSquare } from "lucide-react";

const CommentsSection = ({ comments, status }) => {
  // Filter valid comments
  const validComments = comments.filter((comment) => comment.text?.trim());

  // Hide the section if no valid comments exist
  if (validComments.length === 0) return null;

  const icon =
    status === "agree" ? (
      <Check className="w-6 h-6 text-green-600" />
    ) : (
      <XCircle className="w-6 h-6 text-red-600" />
    );

  const title =
    status === "agree" ? "ความคิดเห็นที่เห็นด้วย" : "ความคิดเห็นที่ไม่เห็นด้วย";

  const bgColor = status === "agree" ? "bg-green-50" : "bg-red-50";
  const borderColor =
    status === "agree" ? "border-green-200" : "border-red-200";

  const formatDate = (timestamp) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    };
    return new Date(timestamp).toLocaleDateString("th-TH", options);
  };

  const timeSince = (timestamp) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - new Date(timestamp).getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} วินาทีที่แล้ว`;
    }if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} นาทีที่แล้ว`;
    }if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ชั่วโมงที่แล้ว`;
    }
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} วันที่แล้ว`;
  };

  return (
    <div
      className={`${bgColor} border ${borderColor} rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl`}
    >
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon}
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-600">
              {validComments.length} ความคิดเห็น
            </span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <ul className="space-y-4">
          {validComments.map((comment, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index}
              className="bg-white rounded-md shadow-sm p-4 flex items-start space-x-4 transition-all duration-300 hover:shadow-md"
            >
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                {comment.profileImageUrl ? (
                  <Image
                    width={500}
                    height={500}
                    src={comment.profileImageUrl}
                    alt={`${comment.user || "ผู้ใช้งาน"}'s profile`}
                    className="w-12 h-12 rounded-full object-cover shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-800 font-bold shadow-md">
                    {comment.user?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {comment.user || "ไม่ระบุชื่อ"}
                  </h4>
                  <time
                    className="text-xs text-gray-500"
                    title={formatDate(comment.timestamp)} // Show full timestamp on hover
                  >
                    {timeSince(comment.timestamp)} ({formatDate(comment.timestamp)})
                  </time>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommentsSection;
