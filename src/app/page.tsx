"use client";

import { useCallback, useEffect, useState } from "react";
import { type FilterState, FiltersSidebar } from "@/components/filters-sidebar";
import { MapContainer } from "@/components/map-container";
import { ResultCards } from "@/components/result-cards";
import { useHospitalSearch } from "@/hooks/use-hospital-search";
import { useMapInteraction } from "@/hooks/use-map-interaction";
import { callCalculateRoutes } from "@/lib/location-api-client";
import type { Hospital, RouteData } from "@/lib/types";
import { validateAllAddresses } from "@/lib/validate-addresses";

export default function HomePage() {
  const [filters, setFilters] = useState<FilterState>({
    distance: 25,
    categories: [],
  });

  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loadingRouteForId, setLoadingRouteForId] = useState<string | null>(
    null,
  );

  const {
    selectedHospitalId,
    mapCenter,
    shouldCenterMap,
    selectHospital,
    clearShouldCenterMap,
  } = useMapInteraction();

  const { hospitals, center } = useHospitalSearch(filters, mapCenter);

  const handleHospitalSelect = (hospital: Hospital) => {
    selectHospital(hospital, true); // true indicates this came from a card click
  };

  const handleMarkerClick = (hospital: Hospital) => {
    selectHospital(hospital, false); // false indicates this came from a marker click
  };

  const handleGetDirections = useCallback(
    async (hospital: Hospital) => {
      setLoadingRouteForId(hospital.PlaceId);
      try {
        const response = await callCalculateRoutes({
          Origin: mapCenter,
          Destination: hospital.Position,
        });

        if (!response.ok) {
          console.error("Routes API error:", response.status);
          return;
        }

        const data = await response.json();
        const route = data.Routes?.[0];
        if (!route) {
          console.error("No route found");
          return;
        }

        // Collect coordinates from all legs
        const coordinates = route.Legs.flatMap(
          (leg: { Geometry: { LineString: [number, number][] } }) =>
            leg.Geometry.LineString,
        );

        setRouteData({
          coordinates,
          distanceMeters: route.Summary.Distance,
          durationSeconds: route.Summary.Duration,
        });

        // Select the hospital to highlight it
        selectHospital(hospital, false);
      } catch (error) {
        console.error("Failed to calculate route:", error);
      } finally {
        setLoadingRouteForId(null);
      }
    },
    [mapCenter, selectHospital],
  );

  const handleClearRoute = useCallback(() => {
    setRouteData(null);
  }, []);

  // Expose validation function to console for manual testing
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      // Make validation available via console
      (
        window as unknown as { validateAddresses?: () => Promise<void> }
      ).validateAddresses = () => {
        console.log("Starting address validation...");
        return validateAllAddresses();
      };
      console.log(
        "Tip: Run validateAddresses() in the console to validate all hospital addresses",
      );
    }
  }, []);

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Filters Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <FiltersSidebar filters={filters} onFiltersChange={setFilters} />
      </div>

      {/* Map and Results */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Results Cards - Left side on desktop, top on mobile */}
        <div className="w-full md:w-96 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col">
          <ResultCards
            hospitals={hospitals}
            selectedHospitalId={selectedHospitalId}
            onHospitalSelect={handleHospitalSelect}
            onGetDirections={handleGetDirections}
            loadingRouteForId={loadingRouteForId}
          />
        </div>

        {/* Map - Right side on desktop, bottom on mobile */}
        <div className="flex-1 relative">
          <MapContainer
            hospitals={hospitals}
            selectedHospitalId={selectedHospitalId}
            center={mapCenter}
            zoom={center ? 13 : 13}
            shouldCenterMap={shouldCenterMap}
            onMarkerClick={handleMarkerClick}
            onCenterComplete={clearShouldCenterMap}
            routeData={routeData}
            onClearRoute={handleClearRoute}
          />
        </div>
      </div>

      {/* Mobile Filters Button */}
      <div className="md:hidden fixed bottom-4 right-4 z-20">
        <button
          type="button"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          Filters
        </button>
      </div>
    </div>
  );
}
