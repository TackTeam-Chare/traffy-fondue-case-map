import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

// ดึงข้อมูลและแปลงฟิลด์
export const fetchStartCases = async () => {
  try {
    const response = await api.get('api/traffy/start');
    return transformTraffyData(response.data);
  } catch (error) {
    console.error("Error fetching 'start' cases:", error);
    return [];
  }
};

export const fetchInProgressCases = async () => {
  try {
    const response = await api.get('api/traffy/inprogress');
    return transformTraffyData(response.data);
  } catch (error) {
    console.error("Error fetching 'inprogress' cases:", error);
    return [];
  }
};

// ฟังก์ชันแปลงข้อมูล
const transformTraffyData = (data) => {
  if (!data || !Array.isArray(data.features)) {
    return [];
  }

  return data.features.map((feature) => {
    const properties = feature.properties || {};
    const geometry = feature.geometry || {};

    return {
      id: properties.message_id || null,
      ticketId: properties.ticket_id || "N/A",
      type: properties.type || "ไม่ระบุ",
      description: properties.description || "ไม่มีคำอธิบาย",
      address: properties.address || "ไม่ระบุที่อยู่",
      organization: properties.org || [],
      responsibleOrg: properties.org_action || [],
      coordinates: geometry.coordinates || [],
      images: [
        ...(properties.photo_url ? [{ image_url: properties.photo_url }] : []), // รูปภาพก่อน
        ...(properties.after_photo ? [{ image_url: properties.after_photo }] : []), // รูปภาพหลัง
      ],
      // photo: properties.photo_url || null,
      // afterPhoto: properties.after_photo || null,
      timestamp: properties.timestamp || null,
      state: properties.state || "ไม่ระบุสถานะ",
      aiSummary: properties.ai?.summary || "ไม่มีข้อมูล",
      aiCategories: properties.ai?.categories || [],
      sentiment: properties.ai?.sentimental_percent || 0,
      sentimentReason: properties.ai?.sentimental_reason || "ไม่มีเหตุผล",
      likeCount: properties.like || 0,
      dislikeCount: properties.dislike || 0,
      viewCount: properties.view_count || 0,
      reopenCount: properties.count_reopen || 0,
    };
  });
};


export const fetchFilteredCases = async ({ radius, status, lat, lng }) => {
  try {
    console.log("Sending request to backend with params:", { radius, status, lat, lng }); // Debug

    const response = await api.get(`/api/traffy/nearby`, {
      params: { radius, state: status, lat, lng },
    });

    console.log("Response from backend:", response.data);
    return transformTraffyData(response.data);
  } catch (error) {
    console.error("Error fetching filtered cases:", error.response?.data || error.message);
    return [];
  }
};



