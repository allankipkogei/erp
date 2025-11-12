import API from "../api/axios";

export const fetchCurrentUser = async () => {
  try {
    const res = await API.get("users/me/");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
};
