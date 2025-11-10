import { renderHook, waitFor } from "@testing-library/react";

import type { RobinSightings } from "@/types";
import { useRobinData } from "@/hooks/useRobinData";

const mockRawData: RobinSightings[] = [
  { date: "30/09/2025", sightings: 2 },
  { date: "01/10/2025", sightings: 3 },
  { date: "02/10/2025", sightings: 5 },
  { date: "03/10/2025", sightings: 1 },
];

const originalFetch = global.fetch;

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe("useRobinData", () => {
  describe("when fetch succeeds", () => {
    beforeEach(() => {
      // Mock a successful fetch for this group
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRawData),
        } as Response)
      );
    });

    // Shared helper: render and wait for loading to finish
    const renderLoaded = async () => {
      const { result } = renderHook(() => useRobinData());
      await waitFor(() => expect(result.current.loading).toBe(false));
      return result;
    };

    test("successfully fetches and processes data", async () => {
      const result = await renderLoaded();

      expect(result.current.error).toBe(false);
      expect(result.current.weeklyData.length).toBeGreaterThan(0);
      expect(Array.isArray(result.current.weeklyData[0])).toBe(true);
    });

    test("fills missing dates and splits into weeks", async () => {
      const result = await renderLoaded();

      expect(result.current.weeklyData.length).toBe(1); // Only one week in mock data
      expect(result.current.weeklyData[0].length).toBe(7); // Full week
      expect(result.current.missingDates.size).toBe(3); // 3 missing dates filled in
    });

    test("reload function refetches data", async () => {
      const result = await renderLoaded();

      expect(global.fetch).toHaveBeenCalledTimes(1);

      result.current.reload();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });

    test("sets loading to false after successful fetch", async () => {
      const { result } = renderHook(() => useRobinData());

      // Immediately after render
      expect(result.current.loading).toBe(true);

      // After fetch resolves
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe("when fetch fails", () => {
    test("handles fetch error", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 404,
        } as Response)
      );

      const { result } = renderHook(() => useRobinData());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBeTruthy();
      expect(result.current.weeklyData).toEqual([]);
    });

    test("handles network error", async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

      const { result } = renderHook(() => useRobinData());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe(true);
      expect(result.current.weeklyData).toEqual([]);
    });

    test("handles empty data array", async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        } as Response)
      );

      const { result } = renderHook(() => useRobinData());
      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.weeklyData).toEqual([]);
      expect(result.current.missingDates.size).toBe(0);
      expect(result.current.error).toBe(false);
    });
  });
});
