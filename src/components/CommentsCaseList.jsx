import { CalendarDays, UserCircle, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const CommentsCaseList = ({ comments }) => {
  if (!comments || comments.length === 0) {
    return null; // Hide entire section if no comments
  }

  const calculateElapsedTime = (timestamp) => {
    if (!timestamp) return "ไม่ระบุเวลา";

    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);

    const days = Math.floor(diffInSeconds / (24 * 60 * 60));
    if (days > 0) return `${days} วันก่อน`;

    const hours = Math.floor(diffInSeconds / (60 * 60));
    if (hours > 0) return `${hours} ชั่วโมงก่อน`;

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes > 0) return `${minutes} นาทีที่แล้ว`;

    return "ไม่กี่วินาทีที่แล้ว";
  };

  // Filter and sort comments
  const filteredComments = comments.filter((comment) => comment.text); // Exclude comments without text
  const sortedComments = [...filteredComments].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  // If no valid comments, hide the section
  if (filteredComments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {sortedComments.map((comment, index) => (
        <div
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={index}
          className="flex items-start bg-white shadow rounded-lg border border-gray-200 p-4"
        >
         {/* User Avatar */}
         <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shadow-md">
            {comment.profileImageUrl ? (
              <img
                src={comment.profileImageUrl}
                alt={`${comment.user || "ผู้ใช้งาน"}'s profile`}
                className="object-cover w-full h-full"
              />
            ) : (
              <UserCircle className="w-full h-full text-gray-400" />
            )}
          </div>

          {/* Comment Details */}
          <div className="ml-3 flex-1">
            {/* Header */}
            <div className="flex items-center justify-between">
              {/* User Name */}
              <p className="text-base font-semibold text-gray-900">{comment.user || "ไม่ระบุชื่อ"}</p>
              {/* Timestamp */}
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-gray-400" />
                <span>
                  {comment.timestamp
                    ? new Date(comment.timestamp).toLocaleString("th-TH", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    : "ไม่ระบุเวลา"}
                </span>
              </div>
            </div>

            {/* Comment Text */}
            <div className="mt-2 flex items-start gap-3 ">
              <div className="flex-shrink-0">
                <MessageSquare className="w-5 h-5 " />
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-sm leading-relaxed break-words">{comment.text}</p>
              </div>
            </div>

            {/* Comment Icon with Elapsed Time */}
            <div className="mt-3 flex items-center gap-3">
              {comment.status === "agree" ? (
                <span className="flex items-center gap-1 text-green-600">
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-sm font-medium">เห็นด้วย</span>
                  <span className="text-sm font-medium text-gray-700">
                    ({calculateElapsedTime(comment.timestamp)})
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-red-600">
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-sm font-medium">ไม่เห็นด้วย</span>
                  <span className="text-sm font-medium text-gray-700">
                    ({calculateElapsedTime(comment.timestamp)})
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentsCaseList;
