import Navbar from "./components/Navbar/Navbar";
import LoginScreen from "./screens/Login/LoginScreen";
import RegisterScreen from "./screens/Register/RegisterScreen";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";
import Dashboard from "./screens/Dashboard/Dashboard";
import Expenses from "./screens/Expenses/Expenses"; // Assuming this is your expenses page
import AddExpenses from "./screens/Expenses/AddExpenses"; // Page to add new expense

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/add" element={<AddExpenses />} />
      </Routes>
    </>
  );
}

export default App;
