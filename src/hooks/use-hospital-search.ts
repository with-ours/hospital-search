"use client";

import { useCallback, useEffect, useState } from "react";
import type { FilterState } from "@/components/filters-sidebar";
import { sampleHospitals } from "@/lib/sample-hospitals";
import type { Hospital, Position } from "@/lib/types";

function calculateDistance(pos1: Position, pos2: Position): number {
  const [lng1, lat1] = pos1;
  const [lng2, lat2] = pos2;
  const R = 3959; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useHospitalSearch(
  filters: FilterState,
  searchCenter?: Position,
) {
  const [hospitals, setHospitals] = useState<Hospital[]>(sampleHospitals);
  const [currentCenter] = useState<Position>(searchCenter || [-73.965, 40.765]);

  const applyFilters = useCallback(
    (hospitalsToFilter: Hospital[], center?: Position): Hospital[] => {
      let filtered = [...hospitalsToFilter];

      // Apply category filter
      if (filters.categories.length > 0) {
        filtered = filtered.filter((h) =>
          filters.categories.includes(h.category || ""),
        );
      }

      // Apply distance filter
      if (center && filters.distance > 0) {
        filtered = filtered
          .map((h) => ({
            ...h,
            Distance: calculateDistance(center, h.Position),
          }))
          .filter((h) => h.Distance <= filters.distance)
          .sort((a, b) => (a.Distance || 0) - (b.Distance || 0));
      }

      return filtered;
    },
    [filters],
  );

  // Apply filters when they change or center changes
  useEffect(() => {
    const filtered = applyFilters(sampleHospitals, currentCenter);
    setHospitals(filtered);
  }, [currentCenter, applyFilters]);

  return {
    hospitals,
    loading: false,
    error: null,
    center: currentCenter,
  };
}
