import { Stack } from "expo-router";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "../config/context.config";
import "./global.css";

export default function RootLayout() {
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
      initialRouteName={currentUser ? "(tabs)" : "signup"} // ✅ safer way
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
        name="add-tasks/[tasks]"
        options={{ headerShown: false, title: "Add Task" }}
      />
    </Stack>
  );
}
