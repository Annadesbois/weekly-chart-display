import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WeekNavigation } from "@/components/WeekNavigation";

describe("WeekNavigation", () => {
  test("renders both navigation buttons", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={1}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    expect(screen.getByText("⬅ Previous Week")).toBeInTheDocument();
    expect(screen.getByText("Next Week ➡")).toBeInTheDocument();
  });

  test("calls onPrevious when Previous Week button is clicked", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={2}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    await user.click(screen.getByText("⬅ Previous Week"));
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  test("calls onNext when Next Week button is clicked", async () => {
    const user = userEvent.setup();
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={2}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    await user.click(screen.getByText("Next Week ➡"));
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).not.toHaveBeenCalled();
  });

  test("disables Previous Week button when on first week", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={0}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    const previousButton = screen.getByText("⬅ Previous Week");
    expect(previousButton).toBeDisabled();

    const nextButton = screen.getByText("Next Week ➡");
    expect(nextButton).not.toBeDisabled();
  });

  test("disables Next Week button when on last week", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={4}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    const nextButton = screen.getByText("Next Week ➡");
    expect(nextButton).toBeDisabled();

    const previousButton = screen.getByText("⬅ Previous Week");
    expect(previousButton).not.toBeDisabled();
  });

  test("both buttons enabled when on middle week", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={2}
        totalWeeks={5}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    expect(screen.getByText("⬅ Previous Week")).not.toBeDisabled();
    expect(screen.getByText("Next Week ➡")).not.toBeDisabled();
  });

  test("handles single week scenario", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={0}
        totalWeeks={1}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    expect(screen.getByText("⬅ Previous Week")).toBeDisabled();
    expect(screen.getByText("Next Week ➡")).toBeDisabled();
  });

  test("applies correct CSS classes to buttons", () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <WeekNavigation
        currentWeek={1}
        totalWeeks={3}
        onPrevious={onPrevious}
        onNext={onNext}
      />
    );

    expect(screen.getByText("⬅ Previous Week")).toHaveClass("previous-button");
    expect(screen.getByText("Next Week ➡")).toHaveClass("next-button");
  });
});
