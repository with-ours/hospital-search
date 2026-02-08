// AWS Location Services API Response Types

export type Position = [number, number]; // [longitude, latitude]

export type Address = {
  Label: string;
  AddressNumber?: string;
  Street?: string;
  Municipality?: string;
  Region?: string;
  PostalCode?: string;
  Country?: string;
};

export type Place = {
  PlaceId: string;
  Title: string;
  PlaceType?: string;
  Address: Address;
  Position: Position;
  Distance?: number;
  Categories?: string[];
  MapView?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
};

export type ResultItems = {
  ResultItems: Place[];
};

export type AutocompleteParams = {
  QueryText: string;
  BiasPosition?: Position;
  MaxResults?: number;
  Filter?: {
    IncludeCountries?: string[];
  };
};

export type GeocodeParams = {
  QueryText: string;
  MaxResults?: number;
};

export type SearchTextParams = {
  QueryText: string;
  BiasPosition?: Position;
  MaxResults?: number;
};

export type SearchNearbyParams = {
  QueryPosition: Position;
  MaxResults?: number;
  FilterCategories?: string[];
  Distance?: number;
};

// Extended Hospital type with additional fields
export type Hospital = Place & {
  phoneNumber?: string;
  specialty?: string;
  hours?: string;
  category?: string;
};

// Routes API types
export type CalculateRoutesParams = {
  Origin: Position;
  Destination: Position;
  TravelMode?: "Car" | "Pedestrian" | "Truck";
};

export type RouteLeg = {
  Geometry: {
    LineString: Position[];
  };
  Distance: number;
  DurationSeconds: number;
};

export type Route = {
  Legs: RouteLeg[];
  Summary: {
    Distance: number;
    Duration: number;
  };
};

export type CalculateRoutesResponse = {
  Routes: Route[];
};

export type RouteData = {
  coordinates: Position[];
  distanceMeters: number;
  durationSeconds: number;
};
