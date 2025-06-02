import React from "react";
import { Tabs } from "expo-router";
import {Image} from "react-native"
//@ts-ignore
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerShadowVisible: false,
        headerTitleAlign : "center",
        tabBarStyle: {
          backgroundColor: "#f5f5f5",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: "#6200ee",
        tabBarInactiveTintColor: "#666666",
        headerShown : true,
        headerTitle: () => (
          <Image
            source={require("../../assets/images/habio_logo.png")} // Adjust path if needed
            style={{ width: 120, height: 40, resizeMode: "contain" }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="calendar-today"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="streaks"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="chart-line"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add-habit"
        options={{
          title: "",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="plus-circle"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
