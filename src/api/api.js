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

export default API;