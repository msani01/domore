import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../config/firebase.config";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Missing info", "Please enter email and password");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid email or password", [
        { text: "Try Again" },
      ]);
      console.log("SignIn Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-between bg-gray-100 pt-12 pb-10"
      behavior="padding"
      keyboardVerticalOffset={Platform.select({
        ios: 0,
        android: -StatusBar.currentHeight,
      })}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-between mb-10"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-between">
          {/* Header */}
          <View className="flex flex-col items-center space-y-2">
            <Text className="text-5xl font-extrabold text-blue-600">Domore</Text>
            <Text className="text-gray-600 font-medium text-center text-base">
              Manage your tasks. Achieve more.
            </Text>
          </View>

          {/* Body */}
          <View className="px-6 mt-10 space-y-6">
            <Text className="text-2xl font-semibold text-gray-700">
              Sign in to continue
            </Text>

            {/* Email/password fields */}
            <View className="space-y-4">
              <TextInput
                keyboardType="email-address"
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={isLoading}
                className={`h-14 flex-row justify-center items-center rounded-xl shadow-lg ${
                  isLoading ? "bg-blue-400" : "bg-blue-600"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-white text-lg font-semibold">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* No account? */}
            <View className="flex-row space-x-2 mt-6 justify-center">
              <Text className="text-gray-600">Don’t have an account?</Text>
              <Link href="/signup" className="text-blue-600 font-semibold">
                Create one
              </Link>
            </View>
          </View>

          {/* Footer */}
          <View className="flex-row justify-evenly mt-12">
            <Link href="/about" className="text-gray-500 text-sm">
              About Domore
            </Link>
            <Link href="/" className="text-gray-500 text-sm">
              Home
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
