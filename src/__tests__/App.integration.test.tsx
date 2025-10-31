import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/App";
import type { RobinSightings } from "@/types";

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

const apiData: RobinSightings[] = [
  { date: "30/09/2025", sightings: 2 },
  { date: "01/10/2025", sightings: 3 },
  { date: "03/10/2025", sightings: 5 },
  { date: "04/10/2025", sightings: 1 },
  { date: "07/10/2025", sightings: 4 },
];

// --- Reusable helpers ---
const mockFetchSuccess = (data: unknown = apiData) => {
  global.fetch = vi.fn(() =>
    Promise.resolve(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
  ) as unknown as typeof fetch;
};

const mockFetchError = (status = 500) => {
  global.fetch = vi.fn(() =>
    Promise.resolve(new Response(null, { status }))
  ) as unknown as typeof fetch;
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("App integration", () => {
  test("happy path: shows loading, then week 1 with chart and nav", async () => {
    mockFetchSuccess();
    render(<App />);

    expect(screen.getByText(/loading sightings/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Week 1")).toBeInTheDocument();
    });

    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByText("⬅ Previous Week")).toBeDisabled();
    expect(screen.getByText("Next Week ➡")).not.toBeDisabled();
  });

  test("error → reload → success", async () => {
    const user = userEvent.setup();

    mockFetchError(500);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument();
    });

    // Success on reload
    mockFetchSuccess();

    await user.click(screen.getByRole("button", { name: /reload/i }));

    await waitFor(() => {
      expect(screen.getByText("Week 1")).toBeInTheDocument();
    });

    expect(screen.queryByText(/failed to load data/i)).not.toBeInTheDocument();
  });

  test("basic navigation: next then previous updates week label", async () => {
    const user = userEvent.setup();

    mockFetchSuccess();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Week 1")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Next Week ➡"));
    expect(screen.getByText("Week 2")).toBeInTheDocument();

    await user.click(screen.getByText("⬅ Previous Week"));
    expect(screen.getByText("Week 1")).toBeInTheDocument();
  });

  test("no data: hides chart and week heading, shows title", async () => {
    mockFetchSuccess([]);
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText(/loading sightings/i)).not.toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /robin sightings/i })
    ).toBeInTheDocument();
    expect(screen.queryByText(/week \d+/i)).not.toBeInTheDocument();
    expect(screen.queryByTestId("line-chart")).not.toBeInTheDocument();
  });
});
