import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AddToChat,
  ChatScreen,
  HomeScreen,
  LoginScreen,
  ProfileScreen,
  SingUpScreen,
  SplashScreen,
  date,
} from "./screens";
import { Provider } from "react-redux";
import Store from "./context/store";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="SingUpScreen" component={SingUpScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="AddToChat" component={AddToChat} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
          {/* <Stack.Screen name="date" component={date} /> */}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
