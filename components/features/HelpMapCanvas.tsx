"use client";

import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { KIGALI_CENTER, type HelpPlace } from "@/lib/help";
import { t } from "@/lib/i18n";

type HelpMapCanvasProps = {
  places: HelpPlace[];
  matchedIds: string[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function pinIcon(kind: HelpPlace["kind"], matched: boolean, selected: boolean) {
  const color = kind === "org" ? "#B9A7E8" : "#F2836B";
  const size = selected ? 32 : matched ? 28 : 18;
  const glow = matched || selected ? `0 0 0 8px ${color}55` : "0 0 0 2px #FFFFFF";
  return L.divIcon({
    className: "menya-pin-wrap",
    html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};box-shadow:${glow};border:2px solid #FFFFFF"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
}

function FlyToSelected({
  places,
  selectedId,
}: {
  places: HelpPlace[];
  selectedId: string | null;
}) {
  const map = useMap();
  useEffect(() => {
    const place = places.find((item) => item.id === selectedId);
    if (!place) return;
    map.flyTo([place.lat, place.lng], 14, { duration: 0.6 });
    window.setTimeout(() => {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          const latlng = layer.getLatLng();
          if (latlng.lat === place.lat && latlng.lng === place.lng) {
            layer.openPopup();
          }
        }
      });
    }, 350);
  }, [map, places, selectedId]);
  return null;
}

export default function HelpMapCanvas({ places, matchedIds, selectedId, onSelect }: HelpMapCanvasProps) {
  return (
    <MapContainer
      center={KIGALI_CENTER}
      zoom={13}
      className="h-full w-full rounded-2xl"
      scrollWheelZoom
    >
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <FlyToSelected places={places} selectedId={selectedId} />
      {places.map((place) => {
        const matched = matchedIds.includes(place.id);
        const selected = selectedId === place.id;
        return (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={pinIcon(place.kind, matched, selected)}
            eventHandlers={{
              click: () => onSelect(place.id),
            }}
          >
            <Popup>
              <p className="font-label-md text-label-md text-text">{place.name}</p>
              <p className="font-body-sm text-body-sm text-muted">
                {place.kind === "org" ? t("help.pinOrg") : t("help.pinGroup")} · {place.city}
              </p>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
