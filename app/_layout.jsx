import { Stack } from "expo-router";
import "./global.css"

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
      name="(tabs)"
      options={{
        headerShown:false,
        title:"tabs"
      }}
      />

      <Stack.Screen
      name="index"
      options={{
        headerShown:false,
        title:"Home"
      }}
      />

      <Stack.Screen
      name="add-tasks/[tasks]"
      options={{
        headerShown:false,
        title:"Add Tasks"
      }}
      />


    </Stack>

    
  );
}




 
