const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");

const getErrorMessage = async (response) => {
  try {
    const body = await response.json();
    return body.error || body.message || "Something went wrong. Please try again.";
  } catch {
    return "Something went wrong. Please try again.";
  }
};

export const api = async (path, { token, body, headers, ...options } = {}) => {
  const requestHeaders = new Headers(headers);
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);
  if (body && !(body instanceof FormData)) requestHeaders.set("Content-Type", "application/json");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: requestHeaders,
    body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
  });
  if (!response.ok) throw new Error(await getErrorMessage(response));
  return response.status === 204 ? null : response.json();
};

export const apiUrl = API_URL;
export const assetUrl = (url) => (!url || /^https?:\/\//.test(url) ? url : `${API_URL}${url}`);
