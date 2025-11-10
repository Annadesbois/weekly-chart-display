import {
  fillMissingDates,
  parseDate,
  formatDate,
  splitIntoWeeks,
} from "@/utils/dateUtils";

import type { RobinSightings } from "@/types";

describe("dateUtils", () => {
  describe("parseDate", () => {
    test("parses DD/MM/YYYY format correctly", () => {
      const date = parseDate("15/03/2025");

      expect(date.getDate()).toBe(15);
      expect(date.getMonth()).toBe(2); // March is month 2 (0-indexed)
      expect(date.getFullYear()).toBe(2025);
    });

    test("parses single digit day and month", () => {
      const date = parseDate("5/1/2025");

      expect(date.getDate()).toBe(5);
      expect(date.getMonth()).toBe(0); // January
      expect(date.getFullYear()).toBe(2025);
    });
  });

  describe("formatDate", () => {
    test("adds leading zeros for single-digit day and month", () => {
      const date = new Date(2025, 2, 5); // 5 March 2025
      expect(formatDate(date)).toBe("05/03/2025");
    });
  });

  describe("fillMissingDates", () => {
    test("returns empty arrays for empty input", () => {
      const result = fillMissingDates([]);

      expect(result.filledData).toEqual([]);
      expect(result.missingDates.size).toBe(0);
    });

    test("fills missing dates between start and end", () => {
      const data: RobinSightings[] = [
        { date: "01/10/2025", sightings: 3 },
        { date: "03/10/2025", sightings: 5 },
      ];

      const result = fillMissingDates(data);

      expect(result.filledData).toHaveLength(7);
      expect(result.missingDates.has("02/10/2025")).toBe(true);
    });

    test("aligns start date to previous Monday", () => {
      // 01/10/2025 is a Wednesday
      const data: RobinSightings[] = [{ date: "01/10/2025", sightings: 3 }];

      const result = fillMissingDates(data);

      // Should start on Monday 29/09/2025
      expect(result.filledData[0].date).toBe("29/09/2025");
    });

    test("aligns end date to next Sunday", () => {
      // 01/10/2025 is a Wednesday
      const data: RobinSightings[] = [{ date: "01/10/2025", sightings: 3 }];

      const result = fillMissingDates(data);

      // Should end on Sunday 05/10/2025
      const lastDate = result.filledData[result.filledData.length - 1].date;
      expect(lastDate).toBe("05/10/2025");
    });

    test("marks filled dates as missing with 0 sightings", () => {
      const data: RobinSightings[] = [
        { date: "01/10/2025", sightings: 3 },
        { date: "05/10/2025", sightings: 7 },
      ];

      const result = fillMissingDates(data);

      const filled = result.filledData.find((d) => d.date === "03/10/2025");
      expect(filled).toBeDefined();
      expect(filled!.sightings).toBe(0);
      expect(result.missingDates.has("03/10/2025")).toBe(true);
    });

    test("preserves existing data without modification", () => {
      const data: RobinSightings[] = [
        { date: "01/10/2025", sightings: 3 },
        { date: "02/10/2025", sightings: 5 },
      ];

      const result = fillMissingDates(data);

      const day1 = result.filledData.find((d) => d.date === "01/10/2025");
      const day2 = result.filledData.find((d) => d.date === "02/10/2025");

      expect(day1!.sightings).toBe(3);
      expect(day2!.sightings).toBe(5);
      expect(result.missingDates.has("01/10/2025")).toBe(false);
      expect(result.missingDates.has("02/10/2025")).toBe(false);
    });

    test("handles data starting on Monday", () => {
      // 29/09/2025 is a Monday
      const data: RobinSightings[] = [{ date: "29/09/2025", sightings: 2 }];

      const result = fillMissingDates(data);

      // Should start on the same Monday
      expect(result.filledData[0].date).toBe("29/09/2025");
    });

    test("handles data ending on Sunday", () => {
      // 05/10/2025 is a Sunday
      const data: RobinSightings[] = [{ date: "05/10/2025", sightings: 4 }];

      const result = fillMissingDates(data);

      // Should end on the same Sunday
      const lastDate = result.filledData[result.filledData.length - 1].date;
      expect(lastDate).toBe("05/10/2025");
    });

    test("sorts unsorted data before processing", () => {
      const data: RobinSightings[] = [
        { date: "03/10/2025", sightings: 5 },
        { date: "01/10/2025", sightings: 3 },
        { date: "02/10/2025", sightings: 4 },
      ];

      const result = fillMissingDates(data);

      const expectedSorted = ["01/10/2025", "02/10/2025", "03/10/2025"];

      const returnedOriginalDates = result.filledData
        .map((d) => d.date)
        .filter((date) => expectedSorted.includes(date));

      expect(returnedOriginalDates).toEqual(expectedSorted);
    });
  });

  describe("splitIntoWeeks", () => {
    test("splits data into 7-day chunks", () => {
      const data: RobinSightings[] = Array.from({ length: 14 }, (_, i) => ({
        date: `${(i + 1).toString().padStart(2, "0")}/10/2025`,
        sightings: i,
      }));

      const weeks = splitIntoWeeks(data);

      expect(weeks.length).toBe(2);
      expect(weeks[0].length).toBe(7);
      expect(weeks[1].length).toBe(7);
    });

    test("handles partial week at end", () => {
      const data: RobinSightings[] = Array.from({ length: 10 }, (_, i) => ({
        date: `${(i + 1).toString().padStart(2, "0")}/10/2025`,
        sightings: i,
      }));

      const weeks = splitIntoWeeks(data);

      expect(weeks.length).toBe(2);
      expect(weeks[0].length).toBe(7);
      expect(weeks[1].length).toBe(3); // Partial week
    });

    test("handles empty array", () => {
      const weeks = splitIntoWeeks([]);

      expect(weeks).toEqual([]);
    });

    test("handles single week", () => {
      const data: RobinSightings[] = Array.from({ length: 7 }, (_, i) => ({
        date: `${(i + 1).toString().padStart(2, "0")}/10/2025`,
        sightings: i,
      }));

      const weeks = splitIntoWeeks(data);

      expect(weeks.length).toBe(1);
      expect(weeks[0].length).toBe(7);
    });

    test("handles data less than a week", () => {
      const data: RobinSightings[] = [
        { date: "01/10/2025", sightings: 1 },
        { date: "02/10/2025", sightings: 2 },
      ];

      const weeks = splitIntoWeeks(data);

      expect(weeks.length).toBe(1);
      expect(weeks[0].length).toBe(2);
    });

    test("preserves data order within weeks", () => {
      const data: RobinSightings[] = [
        { date: "01/10/2025", sightings: 1 },
        { date: "02/10/2025", sightings: 2 },
        { date: "03/10/2025", sightings: 3 },
        { date: "04/10/2025", sightings: 4 },
        { date: "05/10/2025", sightings: 5 },
        { date: "06/10/2025", sightings: 6 },
        { date: "07/10/2025", sightings: 7 },
        { date: "08/10/2025", sightings: 8 },
      ];

      const weeks = splitIntoWeeks(data);

      expect(weeks[0][0].sightings).toBe(1);
      expect(weeks[0][6].sightings).toBe(7);
      expect(weeks[1][0].sightings).toBe(8);
    });
  });
});
