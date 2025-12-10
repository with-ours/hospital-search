"use client";

import type { Hospital } from "@/lib/types";
import { useEffect, useRef } from "react";
import { HospitalCard } from "./hospital-card";

interface ResultCardsProps {
  hospitals: Hospital[];
  selectedHospitalId: string | null;
  onHospitalSelect: (hospital: Hospital) => void;
}

export function ResultCards({
  hospitals,
  selectedHospitalId,
  onHospitalSelect,
}: ResultCardsProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedHospitalId) {
      const cardElement = cardRefs.current.get(selectedHospitalId);
      if (cardElement && containerRef.current) {
        const container = containerRef.current;
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Calculate if the card is not fully visible
        const isAboveViewport = cardRect.top < containerRect.top;
        const isBelowViewport = cardRect.bottom > containerRect.bottom;

        if (isAboveViewport || isBelowViewport) {
          cardElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [selectedHospitalId]);

  const setCardRef = (id: string, element: HTMLDivElement | null) => {
    if (element) {
      cardRefs.current.set(id, element);
    } else {
      cardRefs.current.delete(id);
    }
  };

  if (hospitals.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No hospitals found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto p-4 space-y-4 snap-y snap-mandatory"
    >
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {hospitals.length} {hospitals.length === 1 ? "Result" : "Results"}
        </h2>
      </div>
      {hospitals.map((hospital) => (
        <div
          key={hospital.PlaceId}
          ref={(el) => setCardRef(hospital.PlaceId, el)}
          className="snap-start"
        >
          <HospitalCard
            hospital={hospital}
            isSelected={selectedHospitalId === hospital.PlaceId}
            onClick={() => onHospitalSelect(hospital)}
          />
        </div>
      ))}
    </div>
  );
}
