import { render, screen } from "@testing-library/react";
import { SightingsChart } from "@/components/SightingsChart";
import type { RobinSightings } from "@/types";

// Mock recharts components to avoid canvas rendering issues in tests
vi.mock("recharts", () => {
  return {
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    LineChart: ({
      children,
      data,
    }: {
      children: React.ReactNode;
      data: RobinSightings[];
    }) => (
      <div data-testid="line-chart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Line: ({ dataKey, stroke }: { dataKey: string; stroke: string }) => (
      <div data-testid="line" data-key={dataKey} data-stroke={stroke} />
    ),
    XAxis: ({ dataKey }: { dataKey: string }) => (
      <div data-testid="x-axis" data-key={dataKey} />
    ),
    YAxis: () => <div data-testid="y-axis" />,
    CartesianGrid: () => <div data-testid="cartesian-grid" />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
  };
});

const mockData: RobinSightings[] = [
  { date: "01/10/2025", sightings: 3 },
  { date: "02/10/2025", sightings: 5 },
  { date: "03/10/2025", sightings: 2 },
  { date: "04/10/2025", sightings: 7 },
  { date: "05/10/2025", sightings: 4 },
  { date: "06/10/2025", sightings: 1 },
  { date: "07/10/2025", sightings: 6 },
];

describe("SightingsChart", () => {
  test("renders the chart container with correct class", () => {
    render(<SightingsChart data={mockData} missingDates={new Set()} />);

    const chartContainer = screen.getByTestId(
      "responsive-container"
    ).parentElement;
    expect(chartContainer).toHaveClass("chart");
  });

  test("renders all chart components", () => {
    render(<SightingsChart data={mockData} missingDates={new Set()} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("cartesian-grid")).toBeInTheDocument();
    expect(screen.getByTestId("x-axis")).toBeInTheDocument();
    expect(screen.getByTestId("y-axis")).toBeInTheDocument();
    expect(screen.getByTestId("tooltip")).toBeInTheDocument();
    expect(screen.getByTestId("legend")).toBeInTheDocument();
    expect(screen.getByTestId("line")).toBeInTheDocument();
  });

  test("passes correct data to LineChart", () => {
    render(<SightingsChart data={mockData} missingDates={new Set()} />);

    const lineChart = screen.getByTestId("line-chart");
    const chartData = JSON.parse(
      lineChart.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData).toEqual(mockData);
    expect(chartData).toHaveLength(7);
  });

  test("configures Line component with correct dataKey and stroke", () => {
    render(<SightingsChart data={mockData} missingDates={new Set()} />);

    const line = screen.getByTestId("line");
    expect(line).toHaveAttribute("data-key", "sightings");
    expect(line).toHaveAttribute("data-stroke", "#82ca9d");
  });

  test("configures XAxis with date dataKey", () => {
    render(<SightingsChart data={mockData} missingDates={new Set()} />);

    const xAxis = screen.getByTestId("x-axis");
    expect(xAxis).toHaveAttribute("data-key", "date");
  });

  test("renders with empty data array", () => {
    render(<SightingsChart data={[]} missingDates={new Set()} />);

    const lineChart = screen.getByTestId("line-chart");
    const chartData = JSON.parse(
      lineChart.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData).toEqual([]);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("passes missingDates to component", () => {
    const missingDates = new Set(["03/10/2025", "06/10/2025"]);

    const { rerender } = render(
      <SightingsChart data={mockData} missingDates={missingDates} />
    );

    // Component should render without errors
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();

    // Verify it accepts different missingDates
    const newMissingDates = new Set(["01/10/2025"]);
    rerender(<SightingsChart data={mockData} missingDates={newMissingDates} />);

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("renders with single data point", () => {
    const singleData: RobinSightings[] = [{ date: "01/10/2025", sightings: 3 }];

    render(<SightingsChart data={singleData} missingDates={new Set()} />);

    const lineChart = screen.getByTestId("line-chart");
    const chartData = JSON.parse(
      lineChart.getAttribute("data-chart-data") || "[]"
    );

    expect(chartData).toHaveLength(1);
    expect(chartData[0]).toEqual(singleData[0]);
  });
});
