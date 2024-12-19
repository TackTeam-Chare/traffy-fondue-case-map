import { Check, XCircle } from "lucide-react";

const CommentsSection = ({ comments, status }) => {
  const icon =
    status === "agree" ? <Check className="text-green-500" /> : <XCircle className="text-red-500" />;
  const title = status === "agree" ? "ความคิดเห็นที่เห็นด้วย" : "ความคิดเห็นที่ไม่เห็นด้วย";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 my-4 max-h-64 overflow-y-auto">
      <h3 className="flex items-center space-x-2 text-lg font-semibold text-gray-800">
        {icon}
        <span>{title}</span>
      </h3>
      {comments.length > 0 ? (
        <ul className="space-y-4 mt-4">
          {comments.map((comment, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              key={index} // Using index as key since the comments list may not have unique IDs
              className="flex items-start space-x-4 bg-gray-50 p-3 rounded-lg hover:shadow-md transition-shadow duration-200"
            >
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-lg">
                {comment.user.charAt(0).toUpperCase()}
              </div>
              {/* Comment Content */}
              <div className="flex-1">
                <p className="text-sm text-gray-700">{comment.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  โดย {comment.user} • {new Date(comment.timestamp).toLocaleString("th-TH")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 mt-4">ไม่มีความคิดเห็นในขณะนี้</p>
      )}
    </div>
  );
};

export default CommentsSection;
