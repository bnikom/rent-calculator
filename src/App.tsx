import React from "react";
import "./App.scss";
import ApartmentSize from "./components/ApartmentSize";

const App: React.FC = () => {
  return (
    <div className="App">
      <div className="title">
        <h1>What's Your Share?</h1>
      </div>
      <ApartmentSize />
    </div>
  );
};

export default App;
