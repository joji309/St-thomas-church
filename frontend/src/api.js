import axios from 'axios';

// Get API base URL from environment or use relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── HOME PAGE ───────────────────────────
export const heroAPI = {
    getAll: () => api.get('/hero-slides/'),
};

export const massTimingAPI = {
    getAll: () => api.get('/mass-timings/'),
};

export const welcomeAPI = {
    get: () => api.get('/welcome-message/'),
};

export const announcementAPI = {
    getAll: () => api.get('/announcements/'),
};

// ─── ABOUT PAGE ──────────────────────────
export const timelineAPI = {
    getAll: () => api.get('/timeline/'),
};

export const teamAPI = {
    getAll: () => api.get('/team/'),
};

export const aboutPageAPI = {
    get: () => api.get('/about-page/'),
};

// ─── GALLERY ─────────────────────────────
export const galleryCategoryAPI = {
    getAll: () => api.get('/gallery-categories/'),
};

export const galleryAPI = {
    getAll: () => api.get('/gallery/'),
};


// ─── BLOG ────────────────────────────────
export const blogAPI = {
    getAll: () => api.get('/blog/'),
    getBySlug: (slug) => api.get(`/blog/${slug}/`),
};


// ─── CONTACT ─────────────────────────────
export const contactInfoAPI = {
    get: () => api.get('/contact-info/'),
};

export const contactMessageAPI = {
    submit: (data) => api.post('/contact-messages/', data),
};

// ─── COMMON ──────────────────────────────
export const noticeAPI = {
    getAll: () => api.get('/notices/'),
};

export const prayerAPI = {
    submit: (data) => api.post('/prayer-requests/', data),
};

export const siteSettingsAPI = {
    get: () => api.get('/site-settings/'),
};

export default api;

