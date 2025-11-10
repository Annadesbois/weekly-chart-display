import { render, screen } from "@testing-library/react";

import { CustomTooltip } from "@/components/CustomTooltip";
import type { TooltipProps } from "recharts";

// Define the exact payload array type used by Recharts tooltips
type TooltipPayloadArray = NonNullable<TooltipProps<number, string>["payload"]>;

// Helper to create a fake payload for testing
const createTooltipPayload = (...values: number[]): TooltipPayloadArray =>
  values.map((v) => ({ value: v }));

type TooltipOptions = {
  active?: boolean;
  label?: string;
  value?: number;
  missingDates?: Set<string>;
  payload?: TooltipPayloadArray;
};

const renderTooltip = (options: TooltipOptions = {}) => {
  const {
    active = true,
    label = "01/10/2025",
    value = 3,
    missingDates = new Set<string>(),
    payload,
  } = options;

  const finalPayload = payload ?? createTooltipPayload(value);

  return render(
    <CustomTooltip
      active={active}
      label={label}
      payload={finalPayload}
      missingDates={missingDates}
    />
  );
};

describe("CustomTooltip", () => {
  test("renders nothing when not active", () => {
    const { container } = renderTooltip({ active: false });
    // component returns null, so nothing should be in the container
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/date:/i)).not.toBeInTheDocument();
  });

  test("renders nothing when payload is missing or empty", () => {
    const { container } = renderTooltip({ payload: [] });
    expect(container.firstChild).toBeNull();
    expect(screen.queryByText(/date:/i)).not.toBeInTheDocument();
  });

  test("shows the date label and numeric sightings when data exists", () => {
    const label = "05/10/2025";
    const value = 7;
    renderTooltip({
      label,
      value,
      missingDates: new Set(),
    });

    // container with expected class
    const tooltip = screen.getByText(`Date: ${label}`).closest("div");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveClass("custom-tooltip");

    // exact lines rendered
    expect(screen.getByText(`Date: ${label}`)).toBeInTheDocument();
    expect(screen.getByText(`Sightings: ${value}`)).toBeInTheDocument();
  });

  test("shows 'no data' when the date is in missingDates", () => {
    const label = "06/10/2025";
    const value = 0; // would be ignored in UI because date is missing
    renderTooltip({
      label,
      value,
      missingDates: new Set([label]),
    });
    const dateText = (label: string) => `Date: ${label}`;

    expect(screen.getByText(dateText(label))).toBeInTheDocument();
    expect(screen.getByText("Sightings: no data")).toBeInTheDocument();
  });
});
