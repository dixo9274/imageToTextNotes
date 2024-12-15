
import { Slot } from "expo-router";
import { Component } from "react";

export default function AuthLayout() {
  return <Slot/>;
}

AuthLayout.options = {
  headerShown: false,
};

