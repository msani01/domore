import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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
      router.replace("/(tabs)"); // send to dashboard
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
            <Text className="text-5xl font-bold text-indigo-700">Domore</Text>
            <Text className="text-gray-600 font-semibold text-center">
              Manage your tasks. Achieve more.
            </Text>
          </View>

          {/* Body */}
          <View className="px-6 mt-8 space-y-6">
            <Text className="text-lg font-medium text-gray-700">
              Sign in to continue
            </Text>

            {/* Email/password fields */}
            <View className="space-y-3">
              <TextInput
                keyboardType="email-address"
                className="border border-gray-300 rounded-md px-3 py-2 text-base bg-white"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
              />

              <TextInput
                secureTextEntry
                className="border border-gray-300 rounded-md px-3 py-2 text-base bg-white"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity
                onPress={handleSignIn}
                disabled={isLoading}
                className="h-14 flex-row justify-center items-center bg-indigo-700 rounded-md"
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text className="text-white text-lg">Sign In</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* No account? */}
            <Pressable className="flex-row space-x-2 mt-4">
              <Text className="text-gray-600">Don’t have an account?</Text>
              <Link href="/signup" className="text-indigo-700 font-semibold">
                Create one
              </Link>
            </Pressable>
          </View>

          {/* Footer */}
          <View className="flex-row justify-evenly mt-10">
            <Link href="/about" className="text-gray-600 text-sm">
              About Domore
            </Link>
            <Link href="/" className="text-gray-600 text-sm">
              Home
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
