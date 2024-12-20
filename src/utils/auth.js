import liff from "@line/liff";

export const getUserProfile = async () => {
  const storedProfile = localStorage.getItem("userProfile");
  if (storedProfile) {
    console.log("User profile loaded from localStorage:", JSON.parse(storedProfile));
    return JSON.parse(storedProfile); // Return stored profile if exists
  }
  try {
    console.log("Initializing LINE LIFF...");
    await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });

    if (!liff.isLoggedIn()) {
      console.log("User is not logged in. Redirecting to LINE login...");
      liff.login();
    } else {
      console.log("User is logged in. Fetching profile...");
      const profile = await liff.getProfile();

      console.log("LINE Profile fetched:", profile);
      console.log("UserID:", profile.userId);
      console.log("Display Name:", profile.displayName);
      console.log("Picture URL:", profile.pictureUrl);

      // Save to localStorage
      localStorage.setItem("userProfile", JSON.stringify(profile));
      
      // Optional: Redirect to home page
      window.location.href = "/";

      return profile;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};


