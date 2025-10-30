import { useState } from "react";
import robin from "./assets/robin.png";
import { useRobinData } from "./hooks/useRobinData";
import { SightingsChart } from "./components/SightingsChart";
import { WeekNavigation } from "./components/WeekNavigation";

function App() {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const { weeklyData, loading, error, missingDates, reload } = useRobinData();

  const handlePreviousWeek = () => {
    setCurrentWeekIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex((prev) => Math.min(prev + 1, weeklyData.length - 1));
  };

  return (
    <div className="app">
      <img src={robin} className="robin-image" alt="robin" />
      <h2>Robin Sightings</h2>
      <p>
        A simple visual record of how often a robin has been spotted from the
        office window.
      </p>

      {loading && <p>Loading sightings...</p>}
      {error && (
        <p>
          Failed to load data, please refresh the page{" "}
          <button
            className="reload-button"
            onClick={reload}
          >
            Reload
          </button>
        </p>
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
    </div>
  );
}

export default App;
