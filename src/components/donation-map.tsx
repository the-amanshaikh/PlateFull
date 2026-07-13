import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons in bundled builds
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: () => void })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const emeraldIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:9999px;background:radial-gradient(circle at 30% 30%,#34d399,#059669);box-shadow:0 0 0 4px rgba(16,185,129,0.25),0 0 20px rgba(16,185,129,0.6);border:2px solid #fff;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const goldIcon = L.divIcon({
  className: "",
  html: `<div style="width:28px;height:28px;border-radius:9999px;background:radial-gradient(circle at 30% 30%,#fde68a,#d97706);box-shadow:0 0 0 4px rgba(217,119,6,0.25),0 0 20px rgba(217,119,6,0.55);border:2px solid #fff;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export type MapPin = {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  kind?: "donation" | "flash_sale";
  onClaim?: () => void;
};

function Recenter({ pins }: { pins: MapPin[] }) {
  const map = useMap();
  useEffect(() => {
    if (!pins.length) return;
    const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
  }, [pins, map]);
  return null;
}

export function DonationMap({ pins, height = 380 }: { pins: MapPin[]; height?: number }) {
  const center = useMemo<[number, number]>(() => {
    if (pins.length) return [pins[0].lat, pins[0].lng];
    return [20, 0];
  }, [pins]);
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10" style={{ height }}>
      <MapContainer center={center} zoom={pins.length ? 12 : 2} scrollWheelZoom style={{ height: "100%", width: "100%", background: "#0b1220" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Recenter pins={pins} />
        {pins.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={p.kind === "flash_sale" ? goldIcon : emeraldIcon}>
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{p.title}</div>
                {p.subtitle && <div style={{ fontSize: 12, color: "#64748b" }}>{p.subtitle}</div>}
                {p.onClaim && (
                  <button
                    onClick={p.onClaim}
                    style={{ marginTop: 8, width: "100%", padding: "6px 10px", borderRadius: 999, background: "#10b981", color: "#fff", fontSize: 12, fontWeight: 500, border: "none", cursor: "pointer" }}
                  >
                    Claim
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
