import axios from "axios";
import { MapAuthError } from "./AuthErrorHandler";

const API = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});
export const SetAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

export const ClearAuthToken = () => {
    delete API.defaults.headers.common["Authorization"];
};

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            localStorage.removeItem("auth_access_token");
            localStorage.removeItem("username");
            localStorage.removeItem("position");
            localStorage.removeItem("role");

            ClearAuthToken();
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.replace("/error");
            }
        }

        return Promise.reject(error);
    }
);

export const Login = async (payload) => {
    // payload: { username, password }
    try {
        const response = await API.post("/auth/login", payload);
        return response.data;
    } catch (error) {
        throw MapAuthError(error, "Login");
    }
};

export const Logout = async () => {
    // Requires Authorization header
    try {
        const response = await API.post("/auth/logout");
        return response.data;
    } catch (error) {
        throw MapAuthError(error, "Logout");
    }
};

export const Register = async (formData) => {
    try {
        const response = await API.post("/auth/register", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        throw MapAuthError(error, "Register");
    }
};

export const ForgotPassword = async (email) => {
    try {
        const response = await API.post("/auth/forgot-password", { email });
        return response.data; // anti-enumeration: backend always returns generic 200 except rate limit
    } catch (error) {
        throw MapAuthError(error, "ForgotPassword");
    }
};

export const VerifyResetToken = async (token) => {
    try {
        const response = await API.get(`/auth/verify-reset-token`, { params: { token } });
        return response.data;
    } catch (error) {
        throw MapAuthError(error, "VerifyResetToken");
    }
};

export const ResetPassword = async ({ token, new_password }) => {
    try {
        const response = await API.post("/auth/reset-password", { token, new_password });
        return response.data;
    } catch (error) {
        throw MapAuthError(error, "ResetPassword");
    }
};

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

// Fetch current authenticated user's profile
export const GetMyProfile = async () => {
    try {
        const response = await API.get('/auth/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch dashboard statistics for current (authenticated) user
export const GetMyStatistics = async () => {
    const response = await API.get('/statistik/me');
    return response.data;
};

export const getProjectPublicData = async (projectHashedId) => {
    try {
        const response = await API.get(`/projectPublic/projects/${projectHashedId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching project data:", error);
        throw error;
    }
};

// Build preview image URL from filename/path returned by API
export const getProjectPreviewImageUrl = (filename) => {
    if (!filename) return null;
    const safe = filename.startsWith('/') ? filename.slice(1) : filename;
    return `/api/projectPublic/previews/${safe}`;
};

// Build thumbnail image URL from filename/path returned by API
export const getProjectThumbnailImageUrl = (filename) => {
    if (!filename) return null;
    const safe = filename.startsWith('/') ? filename.slice(1) : filename;
    return `/api/projectPublic/thumbnails/${safe}`;
};

export const createKickRequest = async (userHashedId, reason) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.post(
        `/admin/kick-requests/${userHashedId}`, { reason },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    ); return response.data;
};

export default API;