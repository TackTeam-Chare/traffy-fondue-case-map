import React from 'react';
import { 
  MapPin, Tag, Building, MessageCircle, CalendarDays, 
  Users, Navigation 
} from 'lucide-react';

const CaseListSkeleton = () => {
  return (
    <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-sm max-w-screen-sm mx-auto">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1.5 bg-gray-100 rounded-lg animate-pulse">
              <MapPin className="w-4 h-4 text-gray-300" />
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-180px)]">
        <div className="space-y-2">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="p-2.5 bg-gray-50 rounded-lg border border-gray-200 animate-pulse"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="h-5 w-20 bg-gray-200 rounded"></div>
                <div className="h-5 w-36 bg-gray-200 rounded"></div>
              </div>

              {/* Image Placeholder */}
              <div className="grid grid-cols-2 gap-1 mb-2">
                <div className="aspect-video bg-gray-200 rounded-md"></div>
                <div className="aspect-video bg-gray-200 rounded-md"></div>
              </div>

              {/* Description Placeholder */}
              <div className="flex items-start gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-gray-300" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>

              {/* Details Placeholders */}
              <div className="space-y-3">
                {[Building, Tag, MapPin].map((Icon, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Icon className="w-4 h-4 text-gray-300" />
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>

           

              {/* Actions */}
              <div className="flex justify-end items-center mt-2 border-t border-gray-200 pt-2">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button className="flex items-center gap-1 px-4 py-2 bg-gray-200 text-gray-200 rounded-md">
                  <Navigation className="w-4 h-4" />
                  นำทาง
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseListSkeleton;