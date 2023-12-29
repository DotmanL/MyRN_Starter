import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AppNavigationParameterList } from "interfaces/AppNavigationParameterList";
import { useThemedColours } from "providers/ThemeProvider";
import React from "react";
import Feed from "screens/Home/Feed";
import Notifications from "screens/Home/Notifications";
import Profile from "screens/Home/Profile";
import Search from "screens/Home/Search";

const BottomTabs = createBottomTabNavigator<AppNavigationParameterList>();

function HomeNavigation() {
  const colours = useThemedColours();

  return (
    <BottomTabs.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: colours.surface },
        tabBarActiveTintColor: colours.primary,
        headerTitleAlign: "center",
        headerTintColor: colours.primary,
        headerShown: true,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colours.surface }
      }}
    >
      <BottomTabs.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications-outline" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
}
export default HomeNavigation;
