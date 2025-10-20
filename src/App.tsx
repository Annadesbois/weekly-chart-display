import { useState } from "react";
import robin from "./assets/robin.png";
import { useRobinData } from "./hooks/useRobinData";
import { SightingsChart } from "./components/SightingsChart";

const App = () => {
  const [fetchData, setFetchData] = useState<number>(0);
  const [currentWeek, setCurrentWeek] = useState(0);

  const { weeklyData, loading, error, missingDates } = useRobinData(fetchData);
console.log(missingDates);
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
            onClick={() => setFetchData(fetchData + 1)}
          >
            Reload
          </button>
        </p>
      )}

      {weeklyData.length > 0 && (
        <>
          <h3>Week {currentWeek + 1}</h3>

          <SightingsChart
            data={weeklyData[currentWeek]}
            missingDates={missingDates}
          />
        </>
      )}
    </div>
  );
};

export default App;
