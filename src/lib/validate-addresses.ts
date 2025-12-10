import { callGeocode } from "./location-api-client";
import { sampleHospitals } from "./sample-hospitals";
import type { Hospital } from "./types";

interface ValidationResult {
  hospital: Hospital;
  isValid: boolean;
  error?: string;
  geocodedPosition?: [number, number];
  distance?: number; // Distance in miles between hardcoded and geocoded position
}

function calculateDistance(
  pos1: [number, number],
  pos2: [number, number],
): number {
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

async function validateAddress(hospital: Hospital): Promise<ValidationResult> {
  const addressLabel = hospital.Address.Label;

  try {
    const response = await callGeocode({
      QueryText: addressLabel,
      MaxResults: 1,
    });

    // Check for network/fetch errors
    if (!response.ok) {
      let errorMessage = `API error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `API error: ${errorData.error.message || errorData.error.code || errorMessage}`;
        }
      } catch {
        // If we can't parse error JSON, use the status text
      }
      return {
        hospital,
        isValid: false,
        error: errorMessage,
      };
    }

    const data = await response.json();
    const resultItems = data.ResultItems || [];

    if (resultItems.length === 0) {
      return {
        hospital,
        isValid: false,
        error: "No geocoding results found",
      };
    }

    const geocodedPosition = resultItems[0].Position as [number, number];
    const hardcodedPosition = hospital.Position;
    const distance = calculateDistance(hardcodedPosition, geocodedPosition);

    // Consider valid if within 0.5 miles (addresses can vary slightly)
    const isValid = distance < 0.5;

    return {
      hospital,
      isValid,
      geocodedPosition,
      distance,
      error: isValid
        ? undefined
        : `Position mismatch: ${distance.toFixed(2)} miles away`,
    };
  } catch (error) {
    // Better error handling for fetch errors
    let errorMessage = "Unknown error";
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage =
        "Network error: Failed to fetch. Check API endpoint and CORS settings.";
    } else if (error instanceof Error) {
      errorMessage = `Exception: ${error.message}`;
    } else {
      errorMessage = `Exception: ${String(error)}`;
    }

    return {
      hospital,
      isValid: false,
      error: errorMessage,
    };
  }
}

export async function validateAllAddresses(): Promise<void> {
  console.log("🔍 Validating addresses for all hospitals...\n");
  console.log(`Total hospitals to validate: ${sampleHospitals.length}\n`);

  // Check API configuration
  const baseUrl =
    process.env.NEXT_PUBLIC_LOCATION_SERVICES_BASE_URL ||
    "http://localhost:3001/location-services";
  const apiKey = process.env.NEXT_PUBLIC_LOCATION_SERVICES_API_KEY || "";

  console.log(`API Base URL: ${baseUrl}`);
  const apiKeyDisplay = apiKey ? `${apiKey.substring(0, 8)}...` : "NOT SET";
  console.log(`API Key: ${apiKeyDisplay}\n`);

  if (!apiKey) {
    console.warn("⚠️  WARNING: API key not configured. Validation will fail.\n");
  }

  const results: ValidationResult[] = [];

  // Validate addresses with a small delay to avoid rate limiting
  for (let i = 0; i < sampleHospitals.length; i++) {
    const hospital = sampleHospitals[i];
    const result = await validateAddress(hospital);
    results.push(result);

    // Print progress
    const status = result.isValid ? "✅" : "❌";
    console.log(
      `${status} [${i + 1}/${sampleHospitals.length}] ${hospital.Title}`,
    );
    if (!result.isValid) {
      console.log(`   Address: ${hospital.Address.Label}`);
      console.log(`   Error: ${result.error}`);
      if (result.distance !== undefined && result.geocodedPosition) {
        console.log(
          `   Hardcoded: [${hospital.Position[0]}, ${hospital.Position[1]}]`,
        );
        console.log(
          `   Geocoded: [${result.geocodedPosition[0]}, ${result.geocodedPosition[1]}]`,
        );
      }
    }

    // Small delay to avoid rate limiting
    if (i < sampleHospitals.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Summary
  const validCount = results.filter((r) => r.isValid).length;
  const invalidCount = results.filter((r) => !r.isValid).length;

  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 VALIDATION SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Valid addresses: ${validCount}`);
  console.log(`❌ Invalid addresses: ${invalidCount}`);
  console.log(
    `📈 Success rate: ${((validCount / results.length) * 100).toFixed(1)}%\n`,
  );

  if (invalidCount > 0) {
    console.log("❌ INVALID ADDRESSES:");
    console.log("-".repeat(60));
    for (const result of results.filter((r) => !r.isValid)) {
      console.log(`\n${result.hospital.Title}`);
      console.log(`  PlaceId: ${result.hospital.PlaceId}`);
      console.log(`  Address: ${result.hospital.Address.Label}`);
      console.log(`  Error: ${result.error}`);
      if (result.distance !== undefined) {
        console.log(
          `  Distance from geocoded: ${result.distance.toFixed(2)} miles`,
        );
      }
    }
  }
}
