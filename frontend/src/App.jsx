import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LeadDetail from "./components/LeadDetail";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lead/:id" element={<LeadDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
