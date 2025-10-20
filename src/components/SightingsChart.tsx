import { SightingsChartProps } from "../types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const SightingsChart = ({ data, missingDates }: SightingsChartProps) => {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 16, fill: "#666" }}
          />
          <YAxis allowDecimals={false} />
          <Legend />
          <Line
            type="monotone"
            dataKey="sightings"
            stroke="#82ca9d"
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
