const API_ORIGIN = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";    

export const BASE_URL = `${API_ORIGIN}/api`;

export const API_PATHS = {
  AUTH: {
    REGISTER: `${BASE_URL}/auth/register`,
    LOGIN: `${BASE_URL}/auth/login`,
    GET_ME: `${BASE_URL}/auth/me`,
    UPDATE_PROFILE: `${BASE_URL}/auth/me`,
  },

  INVOICES: {
    CREATE: `${BASE_URL}/invoices`,
    GET_ALL: `${BASE_URL}/invoices`,
    GET_BY_ID: (id) => `${BASE_URL}/invoices/${id}`,
    UPDATE: (id) => `${BASE_URL}/invoices/${id}`,
    DELETE: (id) => `${BASE_URL}/invoices/${id}`,
  },

  AI: {
    PARSE_TEXT: `${BASE_URL}/ai/parse-text`,
    GENERATE_REMINDER: `${BASE_URL}/ai/generate-remainder`,
    DASHBOARD_SUMMARY: `${BASE_URL}/ai/dashboard-summary`,
  },
};