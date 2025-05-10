import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BPNPage from "./pages/BPNPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bpn" element={<BPNPage />} />
      </Routes>
    </Router>
  );
}

export default App;
