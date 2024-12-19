import React from 'react';
import { Check, XCircle, MessageSquare } from "lucide-react";

const CommentsSection = ({ comments, status }) => {
  const icon = status === "agree" ? 
    <Check className="w-6 h-6 text-emerald-500" /> : 
    <XCircle className="w-6 h-6 text-rose-500" />;
    
  const title = status === "agree" ? "ความคิดเห็นที่เห็นด้วย" : "ความคิดเห็นที่ไม่เห็นด้วย";
  
  const bgColor = status === "agree" ? "bg-emerald-50" : "bg-rose-50";
  const borderColor = status === "agree" ? "border-emerald-200" : "border-rose-200";

  return (
    <div className={`${bgColor} border ${borderColor} rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl`}>
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {icon}
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">
              {comments.length} ความคิดเห็น
            </span>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="p-6">
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li 
                key={index} 
                className="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-start space-x-4">
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-700 font-bold text-lg shadow-sm">
                      {comment.user.charAt(0).toUpperCase()}
                    </div>
                  </div>

                  {/* Comment Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-base font-semibold text-gray-900">
                        {comment.user}
                      </h4>
                      <span className="text-sm text-gray-400">•</span>
                      <time className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleString('th-TH')}
                      </time>
                    </div>
                    <p className="mt-2 text-gray-700 leading-relaxed">
                      {comment.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">ยังไม่มีความคิดเห็น</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentsSection;