"use client";

import { useCallback, useState } from "react";
import type { Hospital, Position } from "@/lib/types";

export function useMapInteraction() {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null,
  );
  const [mapCenter, setMapCenter] = useState<Position>([-73.9857, 40.7484]);
  const [shouldCenterMap, setShouldCenterMap] = useState(false);

  const selectHospital = useCallback(
    (hospital: Hospital, fromCard?: boolean) => {
      setSelectedHospitalId(hospital.PlaceId);
      // Only set shouldCenterMap to true if selection came from a card click
      const shouldCenter = fromCard ?? false;
      setShouldCenterMap(shouldCenter);
      if (shouldCenter) {
        setMapCenter(hospital.Position);
      }
    },
    [],
  );

  const clearSelection = useCallback(() => {
    setSelectedHospitalId(null);
    setShouldCenterMap(false);
  }, []);

  const updateMapCenter = useCallback((center: Position) => {
    setMapCenter(center);
  }, []);

  const clearShouldCenterMap = useCallback(() => {
    setShouldCenterMap(false);
  }, []);

  return {
    selectedHospitalId,
    mapCenter,
    shouldCenterMap,
    selectHospital,
    clearSelection,
    updateMapCenter,
    clearShouldCenterMap,
  };
}
