import type {
  AutocompleteParams,
  CalculateRoutesParams,
  GeocodeParams,
  SearchNearbyParams,
  SearchTextParams,
} from "./types";

const baseUrl =
  process.env.NEXT_PUBLIC_LOCATION_SERVICES_BASE_URL ||
  "http://localhost:3001/location-services";
const apiKey = process.env.NEXT_PUBLIC_LOCATION_SERVICES_API_KEY || "";

export const callAutocomplete = async (
  params: AutocompleteParams,
): Promise<Response> => {
  const url = `${baseUrl}/v2/autocomplete?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

export const callGeocode = async (params: GeocodeParams): Promise<Response> => {
  const url = `${baseUrl}/v2/geocode?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

export const callGetPlace = async (placeId: string): Promise<Response> => {
  const encodedPlaceId = encodeURIComponent(placeId);
  const url = `${baseUrl}/v2/place/${encodedPlaceId}?key=${apiKey}`;
  return fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  });
};

export const callSearchText = async (
  params: SearchTextParams,
): Promise<Response> => {
  const url = `${baseUrl}/v2/search-text?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

export const callSearchNearby = async (
  params: SearchNearbyParams,
): Promise<Response> => {
  const url = `${baseUrl}/v2/search-nearby?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
};

export const callCalculateRoutes = async (
  params: CalculateRoutesParams,
): Promise<Response> => {
  const url = `${baseUrl}/v2/routes?key=${apiKey}`;
  return fetch(url, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...params,
      LegGeometryFormat: "Simple",
    }),
  });
};
