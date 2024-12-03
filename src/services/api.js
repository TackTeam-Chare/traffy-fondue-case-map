import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
})

// Function to fetch places nearby by coordinates
export const fetchPlacesNearbyByCoordinates = async (latitude, longitude, radius = 500) => {
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
      comment: place.comment,
      coords: place.coords,
      latitude: parseFloat(place.coords.split(",")[1]), // Ensure proper lat parsing
      longitude: parseFloat(place.coords.split(",")[0]), // Ensure proper lng parsing
      address: place.address || "No address provided",
      // photo: place.photo || "/default-photo.png", // Fallback image
      // photo_after: place.photo_after || null,
      // photo: place.photo?.photo_url || "/default-photo.png", // Fallback image
      // photo_after: place.photo_after?.photo_url || null,
      images: [
        { image_url: place.photo || "/default-photo.png" },
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

