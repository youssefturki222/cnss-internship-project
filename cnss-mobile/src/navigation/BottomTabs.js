import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ServicesScreen from "../screens/ServicesScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import TopTabs from "./TopTabs";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: route.name,
        headerTitleAlign: "center",
        headerStyle: { backgroundColor: "#ffffff" },
        headerTintColor: "#1e3a8a",
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";
          if (route.name === "Services") iconName = "document-text";
          else if (route.name === "Alertes") iconName = "notifications";
          else if (route.name === "More") iconName = "ellipsis-horizontal";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1e3a8a",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: { backgroundColor: "#ffffff", borderTopColor: "#e5e7eb" },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Alertes" component={NotificationsScreen} />
      <Tab.Screen name="More" component={TopTabs} options={{ title: "More" }} />
    </Tab.Navigator>
  );
}
