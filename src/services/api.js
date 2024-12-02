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
    
    // Validate data structure and filter out invalid entries
    return data.filter(place => place.latitude && place.longitude).map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`,
          }))
        : [],
    }));
  } catch (error) {
    console.error("Error fetching places nearby by coordinates:", error);
    throw new Error(
      error.response?.data?.error || "Error fetching places nearby by coordinates"
    );
  }
};




// Unified search for all criteria
export const searchTouristEntitiesUnified = async params => {
  try {
    const response = await api.get("/search", { params })
    const data = Array.isArray(response.data) ? response.data : []

    return data.map(place => ({
      ...place,
      images: place.images
        ? place.images.map(image => ({
            image_path: image.image_path,
            image_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${image.image_path}`
          }))
        : [] // Default to an empty array if no images
    }))
  } catch (error) {
    console.error("Error fetching tourist entities with unified search:", error)
    throw new Error(
      error.response?.data?.error ||
        "Error fetching tourist entities with unified search"
    )
  }
}

// Fetch all filters (seasons, districts, categories)
export const fetchAllFilters = async () => {
  try {
    const response = await api.get("/filters")
    return response.data
  } catch (error) {
    console.error("Error fetching all filters:", error)
    throw new Error(error.response?.data?.error || "Error fetching all filters")
  }
}