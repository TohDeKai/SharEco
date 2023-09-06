import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 
import { useIsFocused } from '@react-navigation/native';
import { colours } from '../../components/ColourPalette';
const {primary, black} = colours;

export default () => {
  const isFocused = useIsFocused(); 

  return (
    <Tabs screenOptions={{ 
      tabBarShowLabel: false,
      tabBarActiveTintColor: primary,
      tabBarInactiveTintColor: black,
      headerShown: false,
    }}>
      <Tabs.Screen 
        name="home"
        options={{
          tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} focused={focused}/>,
        }}/>
      <Tabs.Screen 
        name="explore"
        options={{
          tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "location" : "location-outline"} size={26} color={color} focused={focused}/>
        }} />
      <Tabs.Screen 
        name="createListing"
        options={{
          tabBarIcon: () => <Ionicons name="add-circle" size={40} color={primary}/>
        }}  />
      <Tabs.Screen 
        name="activity" 
        options={{
          tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "notifications" : "notifications-outline"} size={26} color={color} focused={focused}/>
        }} 
        />
      <Tabs.Screen 
        name="profile" 
        options={{
          tabBarIcon: ({focused, color}) => <Ionicons name={focused ? "person" : "person-outline"} size={26} color={color} focused={focused}/>
        }} 
        />
    </Tabs>
  )
}