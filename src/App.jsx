// src/App.jsx
import React from "react";
import Routes from "./Routes";
import { ReportProvider } from "./context/ReportContext";

const App = () => {
  return (
    <ReportProvider>
      <Routes />
    </ReportProvider>
  );
};

export default App;
