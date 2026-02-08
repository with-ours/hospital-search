"use client";

import type { Hospital } from "@/lib/types";

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onClick: () => void;
  onGetDirections?: (hospital: Hospital) => void;
  isLoadingRoute?: boolean;
}

export function HospitalCard({
  hospital,
  isSelected,
  onClick,
  onGetDirections,
  isLoadingRoute,
}: HospitalCardProps) {
  return (
    <div
      className={`w-full text-left p-4 border-2 rounded-lg transition-all ${
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200 ring-offset-2"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left cursor-pointer"
      >
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {hospital.Title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{hospital.Address.Label}</p>
        {hospital.category && (
          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded mb-2">
            {hospital.category}
          </span>
        )}
        {hospital.specialty && (
          <p className="text-sm text-gray-500 mb-1">
            Specialty: {hospital.specialty}
          </p>
        )}
        {hospital.phoneNumber && (
          <p className="text-sm text-gray-500">{hospital.phoneNumber}</p>
        )}
        {hospital.Distance !== undefined && (
          <p className="text-sm font-medium text-gray-700 mt-2">
            {hospital.Distance.toFixed(1)} miles away
          </p>
        )}
      </button>
      {onGetDirections && (
        <button
          type="button"
          disabled={isLoadingRoute}
          onClick={(e) => {
            e.stopPropagation();
            onGetDirections(hospital);
          }}
          className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 rounded-lg transition-colors cursor-pointer"
        >
          {isLoadingRoute ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              Calculating...
            </>
          ) : (
            <>
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Directions</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0020 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Get Directions
            </>
          )}
        </button>
      )}
    </div>
  );
}
