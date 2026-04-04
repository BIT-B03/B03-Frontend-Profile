import axios from "axios";
import { MapAuthError } from "./AuthErrorHandler";

const API = axios.create({
    baseURL: "/api",
});

if (typeof window !== "undefined") {
    const existingToken = localStorage.getItem("auth_access_token");
    if (existingToken) {
        API.defaults.headers.common["Authorization"] = `Bearer ${existingToken}`;
    }
}
export const SetAuthToken = (token) => {
    if (token) {
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
};

export const ClearAuthToken = () => {
    delete API.defaults.headers.common["Authorization"];
};

API.interceptors.request.use((config) => {
    if (typeof window === "undefined") return config;
    const token = localStorage.getItem("auth_access_token");
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        };
    }
    return config;
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            const serverMessage =
                error?.response?.data?.message ||
                'Sesi Anda mungkin telah berakhir. Silakan login kembali.';
            try {
                sessionStorage.setItem('auth_expired_message', String(serverMessage));
            } catch {
                // ignore storage errors
            }
            localStorage.removeItem("auth_access_token");
            localStorage.removeItem("username");
            localStorage.removeItem("hashed_id");
            localStorage.removeItem("position");
            localStorage.removeItem("role");

            ClearAuthToken();
            if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
                window.location.replace("/login");
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
export const getAllUsers = async (params = undefined) => {
    try {
        const response = await API.get('/userPublic/users', params ? { params } : undefined);
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
        const response = await API.get('/user/me');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update current authenticated user's profile (multipart/form-data)
export const UpdateMyProfile = async (formData) => {
    try {
        const response = await API.put('/user/me', formData);

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

// GET /api/projectPublic/projects?created_by=:hashedId  →  projects milik creator tertentu
export const getProjectsByCreator = async (creatorHashId) => {
    const response = await API.get('/projectPublic/projects', {
        params: { created_by: creatorHashId },
    });
    return response.data;
};

export const getPublicProjects = async (params = undefined) => {
    const response = await API.get('/projectPublic/projects', params ? { params } : undefined);
    return response.data;
};

export const getPublicProjectStats = async () => {
    const response = await API.get('/projectPublic/projects/stats');
    return response.data;
};

export const getInvitedProjects = async () => {
    const response = await API.get('/project/projects/invited');
    return response.data;
};

export const getProjectDetail = async (idHash) => {
    const response = await API.get(`/project/projects/${idHash}`);
    return response.data;
};

export const createProject = async (formData) => {
    const response = await API.post('/project/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const editProject = async (idHash, formData) => {
    const response = await API.put(`/project/projects/${idHash}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const deleteProject = async (idHash) => {
    const response = await API.delete(`/project/projects/${idHash}`);
    return response.data;
};

// ADMIN SETTINGS
export const getApplicantRetention = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.get(
        '/admin/settings/pelamar-retention',
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const updateApplicantRetention = async (days) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.put(
        '/admin/settings/pelamar-retention',
        { days },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const getDefaultGeneration = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.get(
        '/admin/settings/default-generation',
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const updateDefaultGeneration = async (generation) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.put(
        '/admin/settings/default-generation',
        { generation },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

// ADMIN MEMBER
export const getKickRequests = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.get(
        '/admin/kick-requests',
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const createKickRequest = async (userHashedId, reason) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.post(
        `/admin/kick-requests/${userHashedId}`, { reason },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    ); return response.data;
};

export const getAdminMembers = async (params = undefined) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.get(
        '/admin/members',
        params
            ? { params, headers: token ? { Authorization: `Bearer ${token}` } : {} }
            : { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const getAdminMemberDetail = async (userHashedId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.get(
        `/admin/members/${userHashedId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const updateAdminMember = async (userHashedId, payload) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.put(
        `/admin/updateMember/${userHashedId}`,
        payload,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const approveKickRequest = async (kickHashId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.put(
        `/admin/kick-requests/approve/${kickHashId}`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const rejectKickRequest = async (kickHashId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.put(
        `/admin/kick-requests/reject/${kickHashId}`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};


export const uploadMemberDisplay = async (userHashedId, file) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const formData = new FormData();
    formData.append('display', file);
    const response = await API.post(
        `/admin/members/display/${userHashedId}`,
        formData,
        {
            headers: Object.assign(
                { 'Content-Type': 'multipart/form-data' },
                token ? { Authorization: `Bearer ${token}` } : {}
            ),
        }
    );
    return response.data;
};

export const editMemberDisplay = async (userHashedId, file) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const formData = new FormData();
    formData.append('display', file);
    const response = await API.put(
        `/admin/members/display/${userHashedId}`,
        formData,
        {
            headers: Object.assign(
                { 'Content-Type': 'multipart/form-data' },
                token ? { Authorization: `Bearer ${token}` } : {}
            ),
        }
    );
    return response.data;
};

export const deleteMemberDisplay = async (userHashedId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;
    const response = await API.delete(
        `/admin/members/display/${userHashedId}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const getMemberDisplayPublicUrl = (filename) => {
    if (!filename) return null;
    const safe = filename.startsWith('/') ? filename.slice(1) : filename;
    return `/api/userPublic/display/${safe}`;
};

// ADMIN PELAMAR
const getAdminToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('auth_access_token') : null;

export const getAdminPelamar = async () => {
    const token = getAdminToken();
    const response = await API.get(
        '/admin/pelamar',
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const getAdminPelamarDetail = async (idHash) => {
    const token = getAdminToken();
    const response = await API.get(
        `/admin/pelamar/${idHash}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const getAdminPelamarCV = async (idHash) => {
    const token = getAdminToken();
    const response = await API.get(
        `/admin/pelamar/${idHash}/cv`,
        {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            responseType: 'blob',
        }
    );
    return response.data; // Blob
};

export const confirmPelamar = async (idHash) => {
    const token = getAdminToken();
    const response = await API.put(
        `/admin/pelamar/confirm/${idHash}`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export const rejectPelamar = async (idHash) => {
    const token = getAdminToken();
    const response = await API.put(
        `/admin/pelamar/reject/${idHash}`,
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
};

export default API;