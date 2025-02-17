import React from "react";
import Hero from "../../components/Hero/Hero";
import RegisterScreen from "../Register/RegisterScreen";
import LoginScreen from "../Login/LoginScreen";

export default function Home() {
  return (
    <div className="flex p-6">
      <RegisterScreen className="" />
      <LoginScreen />
    </div>
  );
}
