import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import ProfileScreen from "../screens/ProfileScreen";
import ReclamationsScreen from "../screens/ReclamationsScreen";
import ServiceRetraiteScreen from "../screens/ServiceRetraiteScreen";

const Top = createMaterialTopTabNavigator();

export default function TopTabs() {
  return (
    <Top.Navigator
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#1e3a8a" },
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#6b7280",
        swipeEnabled: true,
      }}
    >
      <Top.Screen name="Profil" component={ProfileScreen} />
      <Top.Screen name="Réclamations" component={ReclamationsScreen} />
      <Top.Screen name="Retraite" component={ServiceRetraiteScreen} />
    </Top.Navigator>
  );
}