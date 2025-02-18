import React from "react";
import Hero from "../../components/Hero/Hero";
import RegisterScreen from "../Register/RegisterScreen";
import LoginScreen from "../Login/LoginScreen";

export default function Home() {
  return (
    <div className="flex">
      <RegisterScreen className="" />
      <LoginScreen />
    </div>
  );
}
