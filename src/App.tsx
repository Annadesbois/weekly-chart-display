import { useState } from "react";
import robin from "./assets/robin.png";
import { useRobinData } from "./hooks/useRobinData";

const App = () => {
  const [fetchData, setFetchData] = useState<number>(0);
  const { weeklyData, loading, error, missingDates } = useRobinData(fetchData);

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
    </div>
  );
};

export default App;
