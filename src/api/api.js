// src/api/api.js
const BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function uploadFile(file, soName, soErp, onProgress) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("so_name", soName);
  fd.append("so_erp", soErp);

  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    body: fd
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({detail: res.statusText}));
    throw new Error(err.detail || "Upload failed");
  }
  return res.json();
}
