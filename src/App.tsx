import robin from "./assets/robin.png";

const App = () => {
  return (
    <div className="app">
      <img src={robin} className="robin-image" alt="robin" />
      <h2>Robin Sightings</h2>
      <p>
        A simple visual record of how often a robin has been spotted from the
        office window.
      </p>
    </div>
  );
};

export default App;
