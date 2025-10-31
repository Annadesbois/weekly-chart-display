// App.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import { useRobinData as mockUseRobinData } from "@/hooks/useRobinData";
import type { RobinSightings } from "@/types";
import type { Mock } from "vitest";

vi.mock("@/hooks/useRobinData");

// Mock recharts to avoid rendering issues
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// --- Common mock data ---
const mockWeeklyData: RobinSightings[][] = [
  [
    { date: "29/09/2025", sightings: 2 },
    { date: "30/09/2025", sightings: 3 },
    { date: "01/10/2025", sightings: 4 },
    { date: "02/10/2025", sightings: 1 },
    { date: "03/10/2025", sightings: 5 },
    { date: "04/10/2025", sightings: 2 },
    { date: "05/10/2025", sightings: 6 },
  ],
  [
    { date: "06/10/2025", sightings: 1 },
    { date: "07/10/2025", sightings: 3 },
    { date: "08/10/2025", sightings: 2 },
    { date: "09/10/2025", sightings: 4 },
    { date: "10/10/2025", sightings: 5 },
    { date: "11/10/2025", sightings: 1 },
    { date: "12/10/2025", sightings: 3 },
  ],
];

// --- Helper to avoid repetition ---
function mockUseRobin(
  overrides: Partial<ReturnType<typeof mockUseRobinData>> = {}
) {
  (mockUseRobinData as Mock).mockReturnValue({
    weeklyData: [],
    loading: false,
    error: null,
    missingDates: new Set(),
    reload: vi.fn(),
    ...overrides,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("App", () => {
  test("renders app title and description", () => {
    mockUseRobin();
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /robin sightings/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /a simple visual record of how often a robin has been spotted/i
      )
    ).toBeInTheDocument();
  });

  test("renders robin image with correct alt text", () => {
    mockUseRobin();
    render(<App />);
    const image = screen.getByAltText("robin");
    expect(image).toBeInTheDocument();
    expect(image).toHaveClass("robin-image");
  });

  test("displays loading state", () => {
    mockUseRobin({ loading: true });
    render(<App />);
    expect(screen.getByText(/loading sightings/i)).toBeInTheDocument();
  });

  test("displays error state with reload button", async () => {
    const user = userEvent.setup();
    const reload = vi.fn();
    mockUseRobin({ error: "Network error", reload });
    render(<App />);
    expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reload/i }));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  test("renders chart and navigation when data is loaded", () => {
    mockUseRobin({ weeklyData: mockWeeklyData });
    render(<App />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("starts on first week by default", () => {
    mockUseRobin({ weeklyData: mockWeeklyData });
    render(<App />);
    expect(screen.getByText("Week 1")).toBeInTheDocument();
    expect(screen.getByText("⬅ Previous Week")).toBeDisabled();
  });

  test("navigates to next and previous week", async () => {
    const user = userEvent.setup();
    mockUseRobin({ weeklyData: mockWeeklyData });
    render(<App />);
    await user.click(screen.getByText("Next Week ➡"));
    expect(screen.getByText("Week 2")).toBeInTheDocument();
    await user.click(screen.getByText("⬅ Previous Week"));
    expect(screen.getByText("Week 1")).toBeInTheDocument();
  });

  test("passes missing dates to chart component", () => {
    mockUseRobin({
      weeklyData: mockWeeklyData,
      missingDates: new Set(["01/10/2025", "03/10/2025"]),
    });
    render(<App />);
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  test("does not render chart when no data", () => {
    mockUseRobin({ weeklyData: [] });
    render(<App />);
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });
});
