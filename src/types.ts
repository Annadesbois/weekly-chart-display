import { TooltipProps } from "recharts";

export type RobinSightings = {
  date: string;
  sightings: number;
};

export type SightingsChartProps = {
  data: RobinSightings[];
  missingDates: Set<string>;
};

export type CustomTooltipComponentProps = TooltipProps<number, string> & {
  missingDates: Set<string>;
};

export type WeekNavigationProps = {
  currentWeek: number;
  totalWeeks: number;
  onPrevious: () => void;
  onNext: () => void;
};
