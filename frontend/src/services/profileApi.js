import api from "./api"; // axios instance

// 🔹 MY PROFILE (Private, Edit Mode)
export const getProfile = () =>
  api.get("/users/me/profile");

export const updateProfile = (data) =>
  api.put("/users/me/profile", data);

// 🔹 PUBLIC PROFILE (View Mode for other users)
export const getPublicUserProfile = (userId) => 
  api.get(`/users/profile/${userId}`);

// 🔹 PRIVACY SETTINGS
export const getPrivacy = () =>
  api.get("/users/me/privacy");

export const updatePrivacy = (data) =>
  api.put("/users/me/privacy", data);