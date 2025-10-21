import React from "react";

export default function MapView({ mapUrl }) {
  if (!mapUrl) return null;
  return (
    <div style={{ height: "600px", border: "1px solid #ddd" }}>
      <iframe
        title="route-map"
        src={mapUrl}
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </div>
  );
}
