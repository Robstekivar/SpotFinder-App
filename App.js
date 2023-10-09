import React, {  } from "react";
import MapScreen from "./srs/Screens/MapScreen";
import DetailsScreen from "./srs/Screens/DetailsScreen";
import LoginScreen from "./srs/Screens/LoginScreen";
import RegisterScreen from "./srs/Screens/RegisterScreen";
import MapDirections from "./srs/Screens/MapDirections";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
  import DrawerNav from "./srs/Screens/DrawerNav";

const Stack = createNativeStackNavigator();

const App = () => {
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen
          options={{ headerShown: false }}
          name="LoginScreen"
          component={LoginScreen}
        />
        
        <Stack.Screen
          options={{ headerShown: false }}
          name="Rgister"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MapScreen"
          component={DrawerNav}
        />
        <Stack.Screen
          name="MapDirections"
          component={MapDirections}
        />

        <Stack.Screen
          options={{ headerShown: false }}
          name="DetailsScreen"
          component={DetailsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

