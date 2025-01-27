import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Login from "./screens/Login/Login";
import RegisterScreen from "./screens/Register/RegisterScreen";
import { Routes, Route } from "react-router-dom";
import Home from "./screens/Home/Home";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
