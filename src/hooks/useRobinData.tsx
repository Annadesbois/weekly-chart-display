import { useCallback, useEffect, useState } from "react";
import { RobinSightings } from "../types";
import { fillMissingDates, splitIntoWeeks } from "../utils/dateUtils";

export const useRobinData = () => {
  const [weeklyData, setWeeklyData] = useState<RobinSightings[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingDates, setMissingDates] = useState<Set<string>>(new Set());

  const url =
    "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings";

  const fetchSightings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error, status: ${res.status}`);

      const fetchedData: RobinSightings[] = await res.json();

      // Fill missing dates before setting the data
      const { filledData, missingDates } = fillMissingDates(fetchedData);
      const weeks = splitIntoWeeks(filledData);

      setWeeklyData(weeks);
      setMissingDates(missingDates);
    } catch (err) {
      setError((err as Error).message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  return { weeklyData, loading, error, missingDates, reload: fetchSightings };
};
