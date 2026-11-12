/**
 * API Configuration for AWS Application Load Balancer (ALB) & Path-Based Routing
 * 
 * Setup:
 * - Single Internet-Facing ALB (1 DNS name, 0 CORS issues)
 * - Listener Rule 1: Path `/api/*` -> Backend Target Group (Port 5000, Health check `/api/health`)
 * - Default Rule: Path `/*`        -> Frontend Target Group (Port 80, Health check `/`)
 * 
 * In this design, the browser accesses both the website and the backend API through the same ALB origin.
 * Therefore, all API requests use relative `/api` paths:
 * e.g., `fetch('/api/packages')`, `fetch('/api/bookings')`
 */

export const getApiBaseUrl = () => {
  // 1. Explicit override via build-time or runtime environment (optional)
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.__API_URL__ && window.__API_URL__.trim() !== '') {
    return window.__API_URL__.trim().replace(/\/+$/, '');
  }

  // 2. Default: Relative `/api`
  // Automatically routes through the ALB's path-based listener rule (`/api/*` -> Backend Target Group)
  // Also works with local Vite proxy during development
  return '/api';
};

/**
 * Normalizes and builds clean `/api/...` endpoints
 */
export const buildApiUrl = (endpoint) => {
  const base = getApiBaseUrl();
  const clean = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If base is relative `/api` and endpoint already starts with `/api`, prevent duplicate `/api/api`
  if (base === '/api') {
    return clean.startsWith('/api') ? clean : `/api${clean}`;
  }

  if (base.endsWith('/api') && clean.startsWith('/api')) {
    return `${base.slice(0, -4)}${clean}`;
  }

  return `${base}${clean}`;
};

/**
 * Standard fetch wrapper for all API operations
 */
export const apiFetch = async (endpoint, options = {}) => {
  const url = buildApiUrl(endpoint);
  return fetch(url, options);
};
