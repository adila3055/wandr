import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useStore from "../store/useStore";
 
// Fix default marker icons (leaflet bug)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
 
export function MapPanel({ trip }) {
  const itinerary = trip?.itinerary || [];
  const center = trip?.mapCenter || { lat: -8.4095, lng: 115.1889 }; // Default: Bali
 
  return (
    <div>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 700, marginBottom: 16 }}>📍 Live Map</h2>
      <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid var(--border)", height: 480 }}>
        <MapContainer center={[center.lat, center.lng]} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {itinerary.filter(i => i.lat && i.lng).map((item) => (
            <Marker key={item._id} position={[item.lat, item.lng]}>
              <Popup><strong>{item.title}</strong><br />{item.location}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <p style={{ fontSize: 12, color: "var(--text-light)", marginTop: 8 }}>
        Powered by OpenStreetMap — free, no API key needed!
      </p>
    </div>
  );
}
 
export default MapPanel;