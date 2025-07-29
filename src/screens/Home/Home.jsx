import React from "react";
import Hero from "../../components/Hero/Hero";
import RegisterScreen from "../../components/Register/RegisterScreen";
import LoginScreen from "../../components/Login/LoginScreen";

export default function Home() {
  return (
    <div className="flex">
      <RegisterScreen className="" />
      <LoginScreen />
    </div>
  );
}
