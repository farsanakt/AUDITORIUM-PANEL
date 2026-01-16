import { useEffect, useState } from "react";
import { LocationIQResponse, LocationResult } from "./types";

export const useLocationIQ = (query: string) => {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
const res = await fetch(
  `${import.meta.env.VITE_USER_API_URL}/api/locations/search?q=${encodeURIComponent(query)}`
);


        const data: LocationIQResponse[] = await res.json();

        const formatted: LocationResult[] = data.map((item) => ({
          displayName: item.display_name,
          lat: Number(item.lat),
          lon: Number(item.lon),
        }));

        setResults(formatted);
      } catch (error) {
        console.error("Location fetch error", error);
      } finally {
        setLoading(false);
      }
    }, 400)

    return () => clearTimeout(timer);
  }, [query]);

  return { results, loading };
};
