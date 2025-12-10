import { describe, expect, it } from "vitest";
import { sampleHospitals } from "./sample-hospitals";

describe("sampleHospitals", () => {
  it("should have at least 10 hospitals", () => {
    expect(sampleHospitals.length).toBeGreaterThanOrEqual(10);
  });

  it("should have at most 20 hospitals", () => {
    expect(sampleHospitals.length).toBeLessThanOrEqual(20);
  });

  it("should have valid hospital data structure", () => {
    for (const hospital of sampleHospitals) {
      expect(hospital).toHaveProperty("PlaceId");
      expect(hospital).toHaveProperty("Title");
      expect(hospital).toHaveProperty("Address");
      expect(hospital).toHaveProperty("Position");
      expect(Array.isArray(hospital.Position)).toBe(true);
      expect(hospital.Position.length).toBe(2);
    }
  });

  it("should have unique PlaceIds", () => {
    const placeIds = sampleHospitals.map((h) => h.PlaceId);
    const uniquePlaceIds = new Set(placeIds);
    expect(uniquePlaceIds.size).toBe(sampleHospitals.length);
  });
});
