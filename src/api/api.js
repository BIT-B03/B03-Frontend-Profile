import axios from "axios";

const API = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Fetch all users public data
export const getAllUsers = async () => {
    try {
        const response = await API.get('/userPublic/users');
        return response.data;
    } catch (error) {
        console.error("Error fetching users data:", error);
        throw error;
    }
};

// Fetch user public data by hashed ID
export const getUserPublicData = async (userHashedId) => {
    try {
        const response = await API.get(`/userPublic/users/${userHashedId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

// Build avatar image URL from filename/path returned by API
export const getAvatarImageUrl = (filename) => {
    if (!filename) return null;
    const safe = filename.startsWith('/') ? filename.slice(1) : filename;
    return `/api/userPublic/avatars/${safe}`;
};

export default API;