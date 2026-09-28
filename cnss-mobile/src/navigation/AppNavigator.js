import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import SignUpScreen from "../screens/SignUpScreen";
import BottomTabs from "./BottomTabs";


const Stack = createNativeStackNavigator();


export default function AppNavigator() {

  return (

    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >

      <Stack.Screen 
        name="Login" 
        component={LoginScreen} 
      />


      <Stack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen} 
      />


      <Stack.Screen 
        name="MainTabs" 
        component={BottomTabs} 
      />


    </Stack.Navigator>

  );

}