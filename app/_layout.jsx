import { Stack } from "expo-router";
import * as Notifications from "expo-notifications";
import { useContext, useEffect } from "react";
import { AuthProvider, AuthContext } from "../config/context.config";
import { useFonts } from 'expo-font';
import { View, ActivityIndicator, Platform } from "react-native";
import "./global.css";


// configure how notifications behave when received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function RootLayout() {
useEffect(() => {
    async function requestPermissions() {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications not granted!");
      }
    }
    requestPermissions();
  }, []);

  const [fontsLoaded] = useFonts({
   Nunito_VariableFont: require("../assets/fonts/Nunito-VariableFont_wght.ttf"),
    
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }


  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
}

function AuthWrapper() {
  const { currentUser } = useContext(AuthContext);

  return (
    <Stack
      screenOptions={{ headerShown: false }}
      initialRouteName={currentUser ? "(tabs)" : "index"} // 
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false, title: "Sign Up" }}
      />
      <Stack.Screen
        name="signin"
        options={{ headerShown: false, title: "Sign In" }}
      />
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Home" }}
      />
      <Stack.Screen
      name="view-tasks/[taskid]"
      options={{ headerShown: false, title: "Task Details" }}
    />
    </Stack>
    
  );
}
