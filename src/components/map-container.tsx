"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Hospital, Position, RouteData } from "@/lib/types";

interface MapContainerProps {
  hospitals: Hospital[];
  selectedHospitalId: string | null;
  center?: Position;
  zoom?: number;
  shouldCenterMap?: boolean;
  onMarkerClick: (hospital: Hospital) => void;
  onCenterComplete?: () => void;
  routeData?: RouteData | null;
  onClearRoute?: () => void;
}

const ROUTE_SOURCE_ID = "route-line";
const ROUTE_LAYER_ID = "route-line-layer";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }
  return `${minutes} min`;
}

function formatDistance(meters: number): string {
  const miles = meters / 1609.344;
  return `${miles.toFixed(1)} mi`;
}

export function MapContainer({
  hospitals,
  selectedHospitalId,
  center = [-73.965, 40.765],
  zoom = 13,
  shouldCenterMap = false,
  onMarkerClick,
  onCenterComplete,
  routeData,
  onClearRoute,
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

  // Render route polyline
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    const m = map.current;

    // Remove existing route layer and source
    if (m.getLayer(ROUTE_LAYER_ID)) {
      m.removeLayer(ROUTE_LAYER_ID);
    }
    if (m.getSource(ROUTE_SOURCE_ID)) {
      m.removeSource(ROUTE_SOURCE_ID);
    }

    if (!routeData || routeData.coordinates.length === 0) return;

    // Add route source
    m.addSource(ROUTE_SOURCE_ID, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: routeData.coordinates,
        },
      },
    });

    // Add route layer
    m.addLayer({
      id: ROUTE_LAYER_ID,
      type: "line",
      source: ROUTE_SOURCE_ID,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#2563eb",
        "line-width": 5,
        "line-opacity": 0.8,
      },
    });

    // Fit map to route bounds
    const bounds = new maplibregl.LngLatBounds();
    for (const coord of routeData.coordinates) {
      bounds.extend(coord as [number, number]);
    }
    m.fitBounds(bounds, { padding: 80, duration: 1000 });
  }, [routeData, mapLoaded]);

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
      {routeData && onClearRoute && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-4 z-10">
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 text-primary-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Route</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0020 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <div>
              <span className="font-semibold text-gray-900">
                {formatDistance(routeData.distanceMeters)}
              </span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-gray-600">
                {formatDuration(routeData.durationSeconds)}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClearRoute}
            className="ml-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Clear route</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
