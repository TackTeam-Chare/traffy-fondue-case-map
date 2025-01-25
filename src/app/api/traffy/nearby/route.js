import axios from "axios";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const radius = searchParams.get("radius") || 5000;
    const state = searchParams.get("state");

    console.log("Received parameters:", { lat, lng, radius, state });

    // Validate coordinates
    if (!lat || !lng || Number.isNaN(Number(lat)) || Number.isNaN(Number(lng))) {
      return new Response(
        JSON.stringify({ error: "Invalid coordinates" }),
        { status: 400 }
      );
    }

    // Validate state
    if (!state || !["start", "inprogress", "finish"].includes(state)) {
      return new Response(
        JSON.stringify({ error: "Invalid state value" }),
        { status: 400 }
      );
    }

    const radiusValue = Number.parseInt(radius, 10);

    // API URL
    const apiUrl = `https://publicapi.traffy.in.th/premium-org-fondue/geojson/v1?org_key=bangkok&state_type=${state}`;
    console.log("Calling external API:", apiUrl);

    // Fetch data from external API
    const response = await axios.get(apiUrl, {
      headers: {
        accept: "application/json, text/plain, */*",
      },
    });

    console.log("External API response received:", response.data);

    // Filter places by radius
    const places = response.data.features.filter((place) => {
      const distance = calculateDistance(
        lat,
        lng,
        place.geometry.coordinates[1],
        place.geometry.coordinates[0]
      );
      return distance <= radiusValue;
    });

    console.log("Filtered places by radius:", places);

    // Respond with filtered places
    return new Response(
      JSON.stringify({ features: places }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /traffy/nearby:", error.message);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}

// Helper function to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}
