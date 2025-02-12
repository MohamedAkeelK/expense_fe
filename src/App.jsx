import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginScreen from "./screens/Login/LoginScreen";
import RegisterScreen from "./screens/Register/RegisterScreen";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboard";
import Expenses from "./screens/Expenses/Expenses";
import AddExpenses from "./screens/Expenses/AddExpenses";

function App() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/"; // Hide Navbar on Home page

  return (
    <div className="flex">
      {showNavbar && <Navbar />} {/* Conditional rendering for Navbar */}
      <div className="min-w-0 flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/add" element={<AddExpenses />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
