import { WeekNavigationProps } from "../types";

export const WeekNavigation = ({
  currentWeek,
  totalWeeks,
  onPrevious,
  onNext,
}: WeekNavigationProps) => {
  return (
    <div>
      <button
        className="previous-button"
        onClick={onPrevious}
        disabled={currentWeek === 0}
      >
        ⬅ Previous Week
      </button>

      <button
        className="next-button"
        onClick={onNext}
        disabled={currentWeek === totalWeeks - 1}
      >
        Next Week ➡
      </button>
    </div>
  );
};
