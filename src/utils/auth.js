import liff from "@line/liff";
export const getUserProfile = async () => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      return JSON.parse(storedProfile); // Return stored profile if exists
    }
    try {
      await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID });
      if (!liff.isLoggedIn()) {
        liff.login();
      } else {
        const profile = await liff.getProfile();
        localStorage.setItem("userProfile", JSON.stringify(profile)); // Save profile to localStorage
        return profile;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to fetch user profile");
    }
  };
  
  export const logout = () => {
    liff.logout();
    localStorage.removeItem("userProfile");
  };
  