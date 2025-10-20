import robin from "./assets/robin.png";
import { useRobinData } from "./hooks/useRobinData";

const App = () => {
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
    </div>
  );
};

export default App;
