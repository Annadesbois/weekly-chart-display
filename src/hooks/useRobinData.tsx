import { fillMissingDates, splitIntoWeeks } from "../utils/dateUtils";
import { useCallback, useEffect, useState } from "react";

import { RobinSightings } from "../types";

export const useRobinData = () => {
  const [weeklyData, setWeeklyData] = useState<RobinSightings[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [missingDates, setMissingDates] = useState<Set<string>>(new Set());

  const url =
    "https://raw.githubusercontent.com/Annadesbois/robin-data/refs/heads/main/robinSightings.json";

  const fetchSightings = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error, status: ${res.status}`);

      const fetchedData: RobinSightings[] = await res.json();

      // Fill missing dates before setting the data
      const { filledData, missingDates } = fillMissingDates(fetchedData);
      const weeks = splitIntoWeeks(filledData);

      setWeeklyData(weeks);
      setMissingDates(missingDates);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSightings();
  }, [fetchSightings]);

  return { weeklyData, loading, error, missingDates, reload: fetchSightings };
};
