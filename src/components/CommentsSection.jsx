import React from "react";
import { Check, XCircle, MessageSquare } from "lucide-react";

const CommentsSection = ({ comments, status }) => {
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

  // Function for formatting the date and time in Thai format
  const formatDate = (timestamp) => {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
      timeZone: "Asia/Bangkok", // Set timezone to Thailand
    };
    return new Date(timestamp).toLocaleDateString("th-TH", options);
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
              {comments.length} ความคิดเห็น
            </span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                key={index}
                className="bg-white rounded-md shadow-sm p-4 flex items-start space-x-4 transition-all duration-300 hover:shadow-md"
              >
                {/* Avatar Section */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-800 font-bold shadow-md">
                    {comment.user.charAt(0).toUpperCase()}
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-semibold text-gray-900">{comment.user}</h4>
                    <time className="text-xs text-gray-500">{formatDate(comment.timestamp)}</time>
                  </div>
                  <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-lg p-6 text-center shadow-md">
            <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">ยังไม่มีความคิดเห็น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;
