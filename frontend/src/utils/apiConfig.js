/**
 * Dynamic API Base URL Resolver for AWS EC2, ALB, CloudFront & Local Environments
 * 
 * Automatically derives the API endpoint from the current browser address bar:
 * 1. AWS Application Load Balancer (ALB) or Nginx reverse proxy (port 80/443):
 *    Uses `${window.location.origin}/api`
 * 2. AWS EC2 Public IP / DNS on custom ports (e.g. frontend on :3000, backend on :5000):
 *    Automatically detects window.location.hostname and connects to `${protocol}//${hostname}:5000/api`
 * 3. Local Development:
 *    Uses relative `/api` via Vite proxy, with automatic fallback to port 5000
 * 4. Manual Override:
 *    Supports VITE_API_URL in .env or window.__API_URL__ runtime configuration
 */

let resolvedApiBaseUrl = null;

export const getApiBaseUrl = () => {
  // 1. Explicit override via build-time or runtime environment
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined' && window.__API_URL__ && window.__API_URL__.trim() !== '') {
    return window.__API_URL__.trim().replace(/\/+$/, '');
  }

  // 2. Browser dynamic URL resolution
  if (typeof window !== 'undefined') {
    if (resolvedApiBaseUrl) {
      return resolvedApiBaseUrl;
    }

    const { protocol, hostname, port } = window.location;

    // Direct access to an AWS Public IP or AWS DNS name on a custom frontend port (e.g. :3000)
    // Automatically route API calls to port 5000 on that same AWS host/IP
    if (port && port !== '80' && port !== '443' && port !== '5000') {
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        resolvedApiBaseUrl = `${protocol}//${hostname}:5000/api`;
        return resolvedApiBaseUrl;
      }
    }

    // Standard ALB / Domain / Reverse Proxy deployment (same origin)
    const portPart = port && port !== '80' && port !== '443' ? `:${port}` : '';
    resolvedApiBaseUrl = `${protocol}//${hostname}${portPart}/api`;
    return resolvedApiBaseUrl;
  }

  return '/api';
};

/**
 * Builds a clean, fully-qualified or relative endpoint URL
 */
export const buildApiUrl = (endpoint) => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  // If base ends with /api and cleanEndpoint starts with /api, prevent duplication
  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api')) {
    return `${base.slice(0, -4)}${cleanEndpoint}`;
  }
  return `${base}${cleanEndpoint}`;
};

/**
 * Resilient fetch that executes against the resolved browser URL,
 * with automatic fallback to the alternative port if running standalone on EC2.
 */
export const apiFetch = async (endpoint, options = {}) => {
  const primaryUrl = buildApiUrl(endpoint);

  try {
    const res = await fetch(primaryUrl, options);
    return res;
  } catch (primaryErr) {
    // If primary relative/host call failed on a custom port, probe port 5000 on the same browser host
    if (typeof window !== 'undefined') {
      const { protocol, hostname, port } = window.location;
      if (port && port !== '5000') {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const normalizedEndpoint = cleanEndpoint.startsWith('/api') ? cleanEndpoint : `/api${cleanEndpoint}`;
        const altUrl = `${protocol}//${hostname}:5000${normalizedEndpoint}`;

        if (altUrl !== primaryUrl) {
          try {
            const fallbackRes = await fetch(altUrl, options);
            if (fallbackRes.ok) {
              resolvedApiBaseUrl = `${protocol}//${hostname}:5000/api`;
              return fallbackRes;
            }
          } catch {
            // Re-throw original error
          }
        }
      }
    }
    throw primaryErr;
  }
};

