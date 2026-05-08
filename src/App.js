import "./App.scss";
import ApartmentSize from "./components/ApartmentSize";

function App() {
  return (
    <div className="App">
      <div className="title">
        <h1>What's Your Share?</h1>
        {/* <h1 className>What's Your Share of the Rent?</h1> */}
      </div>
      <ApartmentSize />
    </div>
  );
}

export default App;
