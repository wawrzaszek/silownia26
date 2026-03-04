import { Tabs } from 'expo-router';
import { Dumbbell, Home, User, Utensils } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#f5f5fb',
        tabBarInactiveTintColor: '#696978',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0b0b10',
          borderTopColor: '#191926',
          height: 82,
          paddingBottom: 9,
          paddingTop: 7,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'TRAINER',
          tabBarIcon: ({ color }) => <Dumbbell size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: 'FOOD',
          tabBarIcon: ({ color }) => <Utensils size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
