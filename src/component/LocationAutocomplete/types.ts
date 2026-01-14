export interface LocationResult {
  displayName: string;
  lat: number;
  lon: number;
}

export interface LocationIQResponse {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
}
