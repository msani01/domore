import { useEffect } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

export default function WelcomeScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/signup"); // navigate after delay
    }, 5000); // time

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-gray-200">
      <Text className="text-5xl font-extrabold text-blue-600" style={{ fontFamily: "Nunito_VariableFont" }}>
        Domore
      </Text>
    </View>
  );
}
