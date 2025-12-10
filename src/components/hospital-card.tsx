"use client";

import type { Hospital } from "@/lib/types";

interface HospitalCardProps {
  hospital: Hospital;
  isSelected: boolean;
  onClick: () => void;
}

export function HospitalCard({
  hospital,
  isSelected,
  onClick,
}: HospitalCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-primary-500 bg-primary-50 shadow-lg ring-2 ring-primary-200 ring-offset-2"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
      }`}
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
  );
}
