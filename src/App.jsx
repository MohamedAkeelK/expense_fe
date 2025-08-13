import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import LoginScreen from "./components/Login/LoginScreen";
import RegisterScreen from "./components/Register/RegisterScreen";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboard";
import Expenses from "./screens/Expenses/Expenses";
import AddExpenses from "./screens/Expenses/AddExpenses";
import Incomes from "./screens/Incomes/Incomes";
import AddIncomes from "./screens/Incomes/AddIncomes";
import AddGoals from "./screens/Goals/AddGoals";
import Goals from "./screens/Goals/Goals";
import Reports from "./screens/Reports/Reports";

function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div
        className={`transition-all duration-300 w-full ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Routes>
          <Route path="/" element={<RegisterScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/expenses/add" element={<AddExpenses />} />
          <Route path="/incomes" element={<Incomes />} />
          <Route path="/incomes/add" element={<AddIncomes />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/goals/add" element={<AddGoals />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
          <Route path="/reports" element={<Reports />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
