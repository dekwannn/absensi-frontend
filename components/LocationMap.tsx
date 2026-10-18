"use client";

import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Office } from "@/lib/geo";

export interface MapPoint {
  lat: number;
  lng: number;
  /** akurasi GPS dalam meter (opsional) */
  accuracy?: number | null;
}

interface LocationMapProps {
  office: Office;
  point?: MapPoint | null;
  /** warna titik: hijau bila di dalam radius, merah bila di luar */
  inside?: boolean;
  pointLabel?: string;
  className?: string;
}

const BLUE = "#2563eb";
// Zoom level jalan saat peta pertama tampil
const STREET_ZOOM = 17;
// Kantor ikut dimasukkan ke layar bila jaraknya ke titik tidak lebih dari ini (meter)
const SHOW_OFFICE_WITHIN = 1500;
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * Peta OpenStreetMap: titik kantor + lingkaran radius absen, dan (opsional) satu titik
 * lokasi beserta lingkaran akurasi GPS-nya. Leaflet dimuat di browser saja (butuh window).
 */
export default function LocationMap({ office, point, inside, pointLabel = "Lokasi Anda", className = "" }: LocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<{ L: typeof Leaflet; map: Leaflet.Map } | null>(null);
  const pointLayersRef = useRef<Leaflet.Layer[]>([]);
  const fittedRef = useRef(false);
  const [ready, setReady] = useState(false);

  // Buat peta + lapisan kantor
  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return;
      const map = L.map(containerRef.current, { scrollWheelZoom: false, zoomControl: false })
        .setView([office.lat, office.lng], STREET_ZOOM);
      // Kontrol & atribusi berbahasa Indonesia (label peta OSM di Indonesia sudah memakai nama lokal)
      L.control.zoom({ zoomInTitle: "Perbesar", zoomOutTitle: "Perkecil" }).addTo(map);
      map.attributionControl.setPrefix(false);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; kontributor <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      L.circle([office.lat, office.lng], { radius: office.radius, color: BLUE, weight: 2, fillOpacity: 0.08 }).addTo(map);
      L.circleMarker([office.lat, office.lng], { radius: 7, color: "#fff", weight: 2, fillColor: BLUE, fillOpacity: 1 })
        .bindTooltip("Kantor")
        .addTo(map);
      leafletRef.current = { L, map };
      fittedRef.current = false;
      setReady(true);
    });
    return () => {
      cancelled = true;
      leafletRef.current?.map.remove();
      leafletRef.current = null;
      pointLayersRef.current = [];
      setReady(false);
    };
  }, [office.lat, office.lng, office.radius]);

  // Titik lokasi (diperbarui setiap posisi GPS berubah)
  useEffect(() => {
    const lf = leafletRef.current;
    if (!ready || !lf) return;
    const { L, map } = lf;
    pointLayersRef.current.forEach((layer) => layer.remove());
    pointLayersRef.current = [];
    if (!point) return;

    const color = inside === undefined ? BLUE : inside ? GREEN : RED;
    if (point.accuracy) {
      pointLayersRef.current.push(
        L.circle([point.lat, point.lng], { radius: point.accuracy, color, weight: 1, opacity: 0.5, fillOpacity: 0.1, dashArray: "4 4" }).addTo(map),
      );
    }
    pointLayersRef.current.push(
      L.circleMarker([point.lat, point.lng], { radius: 8, color: "#fff", weight: 3, fillColor: color, fillOpacity: 1 })
        .bindTooltip(pointLabel)
        .addTo(map),
    );

    // Atur zoom sekali saat titik pertama muncul; setelahnya biarkan user menggeser peta.
    // Fokus ke titik di level jalan; kantor ikut terlihat hanya bila letaknya dekat,
    // supaya radius yang besar tidak membuat peta melompat ke tingkat pulau/negara.
    if (!fittedRef.current) {
      const here = L.latLng(point.lat, point.lng);
      if (here.distanceTo([office.lat, office.lng]) <= SHOW_OFFICE_WITHIN) {
        map.fitBounds(here.toBounds(150).extend([office.lat, office.lng]), { padding: [32, 32], maxZoom: 18 });
      } else {
        map.setView(here, STREET_ZOOM);
      }
      fittedRef.current = true;
    }
  }, [ready, point, inside, pointLabel, office.lat, office.lng, office.radius]);

  // `isolate` agar kontrol Leaflet (z-index tinggi) tidak menutupi dialog/modal halaman
  return <div ref={containerRef} className={`isolate ${className}`} />;
}
