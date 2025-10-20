import { RobinSightings } from "../types";

// Converts date into a JavaScript Date object
export const parseDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split("/").map(Number);
  return new Date(year, month - 1, day);
};

// Format date back to DD/MM/YYYY
export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Function to fill missing dates by scanning the array
export const fillMissingDates = (
  sightingsData: RobinSightings[]
): { filledData: RobinSightings[]; missingDates: Set<string> } => {
  if (sightingsData.length === 0)
    return { filledData: [], missingDates: new Set() };

  // Sort the data by date
  const sortedData = [...sightingsData].sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  // Create a map of existing data
  const dataMap = new Map<string, number>();
  sortedData.forEach((item) => {
    dataMap.set(item.date, item.sightings);
  });

  const firstDate = parseDate(sortedData[0].date);
  const lastDate = parseDate(sortedData[sortedData.length - 1].date);

  // Align start date to previous Monday
  const startDate = new Date(firstDate);
  const startDay = startDate.getDay(); // Sunday = 0, Monday = 1, ...
  const offsetToMonday = startDay === 0 ? -6 : 1 - startDay;
  startDate.setDate(startDate.getDate() + offsetToMonday);

  // Align end date to next Sunday
  const endDate = new Date(lastDate);
  const endDay = endDate.getDay();
  const offsetToSunday = endDay === 0 ? 0 : 7 - endDay;
  endDate.setDate(endDate.getDate() + offsetToSunday);

  const missingDates = new Set<string>();
  const filledData: RobinSightings[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    const formatted = formatDate(current);
    const sightings = dataMap.get(formatted);
    if (sightings === undefined) {
      missingDates.add(formatted);
      filledData.push({ date: formatted, sightings: 0 });
    } else {
      filledData.push({ date: formatted, sightings });
    }
    current.setDate(current.getDate() + 1);
  }

  return { filledData, missingDates };
};