import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BusinessCardDisplay from "./Components/RegistrationForm";
import QRGeneratorPage from "./Components/QRpage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QRGeneratorPage />} />
        <Route path="/register" element={<BusinessCardDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
