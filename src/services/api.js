import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinates = async (latitude, longitude, radius = 5000) => {
  try {
    const response = await api.get(`/places/nearby-by-coordinates`, {
      params: { lat: latitude, lng: longitude, radius },
    });

    const data = Array.isArray(response.data) ? response.data : [];

    return data.map((place) => ({
      id: place.id,
      ticket_id: place.ticket_id,
      type: place.type,
      organization: place.organization,
      organization_action: place.organization_action,
      comment: place.comment,
      coords: place.coords,
      latitude: parseFloat(place.coords.split(",")[1]), // Ensure proper lat parsing
      longitude: parseFloat(place.coords.split(",")[0]), // Ensure proper lng parsing
      address: place.address || "No address provided",
      images: [
        { image_url: place.photo_after || "/icons/location-pin.png" },
        ...(place.photo_after ? [{ image_url: place.photo_after }] : []),
      ],
      star: place.star || 0,
      view_count: place.view_count || 0,
    }));
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error);
    throw new Error(error.response?.data?.error || "Error fetching places nearby by coordinates");
  }
};

// ฟังก์ชัน POST เพื่อบันทึกข้อมูลรีวิว
export const saveReview = async (placeId, reviewerName, reviewStatus, stars, comment) => {
  try {
    const timestamp = new Date().toISOString(); // Current timestamp
    const response = await api.post(`/save-review`, {
      placeId,
      reviewerName,
      reviewStatus,
      stars,
      comment, // Ensure comment is included
      timestamp,
    });

    return response.data;
  } catch (error) {
    console.error("Error saving review:", error);
    throw new Error(error.response?.data?.error || "Error saving review");
  }
};

