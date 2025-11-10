import { render, screen } from "@testing-library/react";

import { WeekNavigation } from "@/components/WeekNavigation";
import userEvent from "@testing-library/user-event";

const getPrevBtn = () => screen.getByText("⬅ Previous Week");
const getNextBtn = () => screen.getByText("Next Week ➡");

const setup = (options: { currentWeek: number; totalWeeks: number }) => {
  const onPrevious = vi.fn();
  const onNext = vi.fn();

  render(
    <WeekNavigation
      currentWeek={options.currentWeek}
      totalWeeks={options.totalWeeks}
      onPrevious={onPrevious}
      onNext={onNext}
    />
  );

  return { onPrevious, onNext };
};

describe("WeekNavigation", () => {
  test("renders both navigation buttons", () => {
    setup({ currentWeek: 1, totalWeeks: 5 });
    expect(getPrevBtn()).toBeInTheDocument();
    expect(getNextBtn()).toBeInTheDocument();
  });

  test("calls onPrevious when Previous Week button is clicked", async () => {
    const user = userEvent.setup();
    const { onPrevious, onNext } = setup({ currentWeek: 2, totalWeeks: 5 });

    await user.click(getPrevBtn());
    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).not.toHaveBeenCalled();
  });

  test("calls onNext when Next Week button is clicked", async () => {
    const user = userEvent.setup();
    const { onPrevious, onNext } = setup({ currentWeek: 2, totalWeeks: 5 });

    await user.click(getNextBtn());
    expect(onNext).toHaveBeenCalledTimes(1);
    expect(onPrevious).not.toHaveBeenCalled();
  });

  test("disables Previous Week button when on first week", () => {
    setup({ currentWeek: 0, totalWeeks: 5 });
    expect(getPrevBtn()).toBeDisabled();
    expect(getNextBtn()).not.toBeDisabled();
  });

  test("disables Next Week button when on last week", () => {
    setup({ currentWeek: 4, totalWeeks: 5 });
    expect(getNextBtn()).toBeDisabled();
    expect(getPrevBtn()).not.toBeDisabled();
  });

  test("both buttons enabled when on middle week", () => {
    setup({ currentWeek: 2, totalWeeks: 5 });
    expect(getPrevBtn()).not.toBeDisabled();
    expect(getNextBtn()).not.toBeDisabled();
  });

  test("handles single week scenario", () => {
    setup({ currentWeek: 0, totalWeeks: 1 });
    expect(getPrevBtn()).toBeDisabled();
    expect(getNextBtn()).toBeDisabled();
  });

  test("applies correct CSS classes to buttons", () => {
    setup({ currentWeek: 1, totalWeeks: 3 });
    expect(getPrevBtn()).toHaveClass("previous-button");
    expect(getNextBtn()).toHaveClass("next-button");
  });
});
