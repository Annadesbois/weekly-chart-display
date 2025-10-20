export type RobinSightings = {
  date: string;
  sightings: number;
};

export type SightingsChartProps = {
  data: RobinSightings[];
  missingDates: Set<string>;
};