import { useEffect, useState } from "react";
import { RobinSightings } from "../types";
import { fillMissingDates, splitIntoWeeks } from "../utils/dateUtils";

export const useRobinData = (fetchData: number) => {
  const [weeklyData, setWeeklyData] = useState<RobinSightings[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingDates, setMissingDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(
      "https://my-json-server.typicode.com/Louis-Procode/ufo-Sightings/ufoSightings"
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((fetchedData: RobinSightings[]) => {
        // Fill missing dates before setting the data
        const { filledData, missingDates } = fillMissingDates(fetchedData);
        const weeks = splitIntoWeeks(filledData);
        setWeeklyData(weeks);
        setMissingDates(missingDates);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [fetchData]);

  return { weeklyData, loading, error, missingDates };
};
