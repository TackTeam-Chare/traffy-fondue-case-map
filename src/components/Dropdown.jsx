import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const Dropdown = ({ icon: Icon, label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border ${
          isOpen ? "border-black" : "border-orange-500"
        } text-orange-500 rounded-full shadow-sm transition-all duration-300 hover:bg-orange-100`}
      >
        <Icon className="w-4 h-4" />
        <span>{label}</span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`p-2 cursor-pointer hover:bg-orange-100 ${
                value === option.value ? "bg-orange-50 font-bold" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
