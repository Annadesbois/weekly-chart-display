import { render, screen } from "@testing-library/react";
import App from "@/App";
import { useRobinData as mockUseRobinData } from "@/hooks/useRobinData";
import type { Mock } from "vitest";

vi.mock("@/hooks/useRobinData");

// Mock recharts to avoid rendering issues
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

// --- Helper to avoid repetition ---
const mockUseRobin = (
  overrides: Partial<ReturnType<typeof mockUseRobinData>> = {}
) => {
  (mockUseRobinData as Mock).mockReturnValue({
    weeklyData: [],
    loading: false,
    error: null,
    missingDates: new Set(),
    reload: vi.fn(),
    ...overrides,
  });
};

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
});
