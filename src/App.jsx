import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginScreen from "./components/Login/LoginScreen";
import RegisterScreen from "./components/Register/RegisterScreen";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboard";
import Expenses from "./screens/Expenses/Expenses";
import AddExpenses from "./screens/Expenses/AddExpenses";

function App() {
  return (
    <div>
      <Navbar />
      <div className="ml-64 p-4">
        {" "}
        {/* Push content to the right of the fixed sidebar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/add" element={<AddExpenses />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
