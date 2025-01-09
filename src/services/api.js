import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Function to fetch places nearby by coordinates, including review summaries
export const fetchPlacesNearbyByCoordinates = async (latitude, longitude, radius = 25000) => {
  try {
    // Make a GET request to the backend endpoint
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await api.get(`/places/nearby-by-coordinates`, {
      params: { lat: latitude, lng: longitude, radius },
    });

    const data = Array.isArray(response.data) ? response.data : [];

    // Map and transform the data to include review summaries
    return data.map((place) => ({
      id: place.id,
      vote_status: place.vote_status, 
      ticket_id: place.ticket_id,
      type: place.type,
      organization: place.organization,
      organization_action: place.organization_action,
      comment: place.comment,
      coords: place.coords,
      latitude: Number.parseFloat(place.coords.split(",")[1]), // Parse latitude
      longitude: Number.parseFloat(place.coords.split(",")[0]), // Parse longitude
      address: place.address || "No address provided",
      images: [
        ...(place.photo ? [{ image_url: place.photo }] : []), // รูปภาพก่อน
        ...(place.photo_after ? [{ image_url: place.photo_after }] : []), // รูปภาพหลัง
      ],
      star: place.star || 0,
      view_count: place.view_count || 0,
      reviewSummary: {
        totalReviews: place.reviewSummary?.total_reviews || 0,
        passCount: place.reviewSummary?.pass_count || 0,
        failCount: place.reviewSummary?.fail_count || 0,
        averageStars: place.reviewSummary?.average_stars
          ? Number.parseFloat(place.reviewSummary.average_stars) // Ensure it's a float
          : 0, // Default to 0 if null or invalid
      },
      investigators: place.investigators || [],
      agreeComments: place.agreeComments || [],
      disagreeComments: place.disagreeComments || [],
    }));
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error);
    throw new Error(error.response?.data?.error || "Error fetching places nearby by coordinates");
  }
};

export const saveReview = async (formData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/save-review`, {
      method: "POST",
      body: formData, // Pass FormData directly as the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to save review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error saving review:", error);
    throw error;
  }
};

export const searchPlaces = async ({ searchTerm, caseType, notInvestigated, finishedDate, latitude, longitude, radius }) => {
  try {
    const response = await api.get('/places/search', {
      params: {
        searchTerm,
        caseType,
        notInvestigated: notInvestigated ? 'true' : 'false',
        finishedDate,
        lat: latitude,
        lng: longitude,
        radius
      }
    });

    const data = Array.isArray(response.data) ? response.data : [];
    return data.map((place) => ({
      id: place.id,
      ticket_id: place.ticket_id,
      type: place.type,
      organization: place.organization,
      comment: place.comment,
      latitude: Number.parseFloat(place.coords.split(",")[1]),
      longitude: Number.parseFloat(place.coords.split(",")[0]),
      address: place.address,
      state: place.state,
      star: place.star,
      timestamp: place.timestamp,
      timestamp_finished: place.timestamp_finished,
      images: [
        ...(place.photo ? [{ image_url: place.photo }] : []),
        ...(place.photo_after ? [{ image_url: place.photo_after }] : []),
      ],
    }));
  } catch (error) {
    console.error('Error searching places:', error);
    throw new Error(error.response?.data?.error || 'Failed to search places');
  }
};




export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch categories');
  }
};

export const fetchUserDashboard = async (userId) => {
  try {
    const response = await api.get(`/dashboard/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch categories');
  }
};
