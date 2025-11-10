import { SightingsChart } from "./components/SightingsChart";
import { WeekNavigation } from "./components/WeekNavigation";
import robin from "./assets/robin.png";
import { useRobinData } from "./hooks/useRobinData";
import { useState } from "react";

const App = () => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const { weeklyData, loading, error, missingDates, reload } = useRobinData();

  const handlePreviousWeek = () => {
    setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex((prev) => Math.min(prev + 1, weeklyData.length - 1));
  };

  return (
    <main className="app">
      <img src={robin} className="robin-image" alt="robin" />
      <h2>Robin Sightings</h2>
      <p>
        A simple visual record of how often a robin has been spotted from the
        office window.
      </p>

      {loading && (
        <div className="status-inner" aria-live="polite">
          <div className="spinner" aria-hidden="true"></div>
          <p className="status-text loading-message">Loading sightings…</p>
        </div>
      )}
      {error && (
        <>
          <p aria-live="assertive" className="status-message error-message">
            Failed to load data, please refresh the page
          </p>
          <button className="reload-button" onClick={reload}>
            Reload
          </button>
        </>
      )}

      {weeklyData.length > 0 && (
        <>
          <h3>Week {currentWeekIndex + 1}</h3>

          <SightingsChart
            data={weeklyData[currentWeekIndex]}
            missingDates={missingDates}
          />

          <WeekNavigation
            currentWeek={currentWeekIndex}
            totalWeeks={weeklyData.length}
            onPrevious={handlePreviousWeek}
            onNext={handleNextWeek}
          />
        </>
      )}
    </main>
  );
}

export default App;
