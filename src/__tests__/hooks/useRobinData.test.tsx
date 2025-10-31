import { renderHook, waitFor } from "@testing-library/react";
import { useRobinData } from "@/hooks/useRobinData";
import type { RobinSightings } from "@/types";

const mockRawData: RobinSightings[] = [
  { date: "30/09/2025", sightings: 2 }, // Tuesday
  { date: "01/10/2025", sightings: 3 }, // Wednesday
  { date: "02/10/2025", sightings: 5 }, // Thursday
  { date: "03/10/2025", sightings: 1 }, // Friday
];

const fetchMock = vi.fn<typeof fetch>();

beforeAll(() => {
  vi.stubGlobal("fetch", fetchMock);
});

afterAll(() => {
  vi.unstubAllGlobals();
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("useRobinData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("initialises with loading state", () => {
    fetchMock.mockImplementation(
      () => new Promise(() => {}) as ReturnType<typeof fetch>
    );

    const { result } = renderHook(() => useRobinData());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.weeklyData).toEqual([]);
    expect(result.current.missingDates.size).toBe(0);
  });

  test("successfully fetches and processes data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawData),
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.weeklyData.length).toBeGreaterThan(0);
    expect(Array.isArray(result.current.weeklyData[0])).toBe(true);
  });

  test("fills missing dates and splits into weeks", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawData),
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Data should be filled to start on Monday and end on Sunday
    expect(result.current.weeklyData.length).toBeGreaterThan(0);
    expect(result.current.weeklyData[0].length).toBe(7); // Full week
    expect(result.current.missingDates.size).toBeGreaterThan(0); // Should have missing dates
  });

  test("handles fetch error", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.weeklyData).toEqual([]);
  });

  test("handles network error", async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.weeklyData).toEqual([]);
  });

  test("reload function refetches data", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawData),
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    result.current.reload();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  test("fetches from correct URL", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawData),
      } as Response)
    );

    renderHook(() => useRobinData());

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://raw.githubusercontent.com/Annadesbois/robin-data/refs/heads/main/robinSightings.json"
      );
    });
  });

  test("sets loading to false after successful fetch", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRawData),
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("handles empty data array", async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response)
    );

    const { result } = renderHook(() => useRobinData());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.weeklyData).toEqual([]);
    expect(result.current.missingDates.size).toBe(0);
    expect(result.current.error).toBeNull();
  });
});
