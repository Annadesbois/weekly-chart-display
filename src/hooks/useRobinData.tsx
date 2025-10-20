import { RobinSightings } from "../types";
import { useState } from "react";

export const useRobinData = (fetchData: number) => {
  const [weeklyData, setWeeklyData] = useState<RobinSightings[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missingDates, setMissingDates] = useState<Set<string>>(new Set());

  return { weeklyData, loading, error, missingDates };
};
