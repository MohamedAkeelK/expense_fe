import React from "react";
import RegisterScreen from "../../components/Register/RegisterScreen";
import LoginScreen from "../../components/Login/LoginScreen";

export default function Home() {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-8"
      style={{
        backgroundImage: `url('https://static.vecteezy.com/system/resources/previews/010/067/576/non_2x/monopoly-money-background-free-vector.jpg')`,
      }}
    >
      <div className="rounded-2xl shadow-2xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden">
        {/* Register */}
        <div className="w-full md:w-1/2 p-6">
          <RegisterScreen />
        </div>

        {/* Login */}
        <div className="w-full md:w-1/2 p-6">
          <LoginScreen />
        </div>
      </div>
    </div>
  );
}
