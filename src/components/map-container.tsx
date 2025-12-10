"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Hospital, Position } from "@/lib/types";

interface MapContainerProps {
  hospitals: Hospital[];
  selectedHospitalId: string | null;
  center?: Position;
  zoom?: number;
  shouldCenterMap?: boolean;
  onMarkerClick: (hospital: Hospital) => void;
  onCenterComplete?: () => void;
}

export function MapContainer({
  hospitals,
  selectedHospitalId,
  center = [-73.965, 40.765],
  zoom = 13,
  shouldCenterMap = false,
  onMarkerClick,
  onCenterComplete,
}: MapContainerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initialCenter = useRef(center);
  const initialZoom = useRef(zoom);

  useEffect(() => {
    if (!mapContainer.current) return;

    const apiKey = process.env.NEXT_PUBLIC_LOCATION_SERVICES_API_KEY;
    const baseUrl =
      process.env.NEXT_PUBLIC_LOCATION_SERVICES_BASE_URL ||
      "http://localhost:3001/location-services";

    if (!apiKey) {
      console.warn("Location Services API key not found");
      return;
    }

    const styleUrl = `${baseUrl}/v2/styles/Standard/descriptor?key=${apiKey}&color-scheme=Light`;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: styleUrl,
      center: initialCenter.current,
      zoom: initialZoom.current,
      attributionControl: false,
    });

    mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

    mapInstance.on("load", () => {
      setMapLoaded(true);
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Update markers when hospitals change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    for (const marker of markersRef.current) {
      marker.remove();
    }
    markersRef.current = [];

    // Add new markers
    for (const hospital of hospitals) {
      const isSelected = selectedHospitalId === hospital.PlaceId;
      const color = isSelected ? "#ef4444" : "#3b82f6";

      const el = document.createElement("div");
      el.className = "custom-marker";
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = color;
      el.style.border = "3px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.cursor = "pointer";

      if (!map.current) continue;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(hospital.Position)
        .addTo(map.current);

      el.addEventListener("click", () => {
        onMarkerClick(hospital);
      });

      markersRef.current.push(marker);
    }
  }, [hospitals, selectedHospitalId, mapLoaded, onMarkerClick]);

  // Center map on selected hospital only if shouldCenterMap is true
  useEffect(() => {
    if (!map.current || !selectedHospitalId || !shouldCenterMap) return;

    const selectedHospital = hospitals.find(
      (h) => h.PlaceId === selectedHospitalId,
    );
    if (selectedHospital) {
      // Check if the marker is already in view
      const bounds = map.current.getBounds();
      const [lng, lat] = selectedHospital.Position;
      const isInView = bounds.contains([lng, lat]);

      // Only move the map if the marker is not in view
      if (!isInView) {
        map.current.flyTo({
          center: selectedHospital.Position,
          zoom: 15,
          duration: 1000,
        });
      }

      // Notify that centering is complete
      if (onCenterComplete) {
        onCenterComplete();
      }
    }
  }, [selectedHospitalId, hospitals, shouldCenterMap, onCenterComplete]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!process.env.NEXT_PUBLIC_LOCATION_SERVICES_API_KEY && (
        <div className="absolute top-4 left-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded shadow">
          <p className="text-sm font-medium">
            Warning: API key not configured. Map may not load.
          </p>
        </div>
      )}
    </div>
  );
}
