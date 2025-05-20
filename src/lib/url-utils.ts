// src/lib/url-utils.ts
export const encodeObjectForUrl = (obj: unknown): string => {
  const jsonString = JSON.stringify(obj);
  // For environments where TextEncoder might not be available or for simplicity:
  // const base64String = btoa(unescape(encodeURIComponent(jsonString)));
  // Using TextEncoder for robustness with UTF-8 characters
  const uint8Array = new TextEncoder().encode(jsonString);
  const base64String = btoa(String.fromCharCode(...uint8Array));
  return encodeURIComponent(base64String); 
};

export const decodeObjectFromUrl = <T>(encodedStr: string | null | undefined): T | null => {
  if (!encodedStr) return null;
  try {
    const base64String = decodeURIComponent(encodedStr);
    // For environments where TextDecoder might not be available or for simplicity:
    // const jsonString = decodeURIComponent(escape(atob(base64String)));
    // Using TextDecoder for robustness with UTF-8 characters
    const uint8Array = Uint8Array.from(atob(base64String), c => c.charCodeAt(0));
    const jsonString = new TextDecoder().decode(uint8Array);
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to decode object from URL:", error);
    return null;
  }
};
