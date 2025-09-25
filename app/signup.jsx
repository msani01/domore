import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
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
import { auth, db } from "../config/firebase.config";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignUp = async () => {
    if (!email || !password || !firstName || !lastName) {
      Alert.alert("Missing info", "Please fill in all required fields");
      return;
    }
    if (password !== passwordConfirmation) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // ✅ Create user
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      // ✅ Save profile in Firestore with UID as doc ID
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        createdAt: new Date().getTime(),
      });

      // update firebase auth display name
      await updateProfile(user, { displayName: firstName });

      Alert.alert("Success", "Your account was created", [
        { text: "Okay" },
        { text: "Go to Home", onPress: () => router.replace("/(tabs)") },
      ]);
    } catch (error) {
      Alert.alert("Message", "An error occurred. Try again", [
        { text: "Dismiss" },
      ]);
      console.log("Signup Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 justify-between bg-gray-200 pt-12 pb-10"
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
          {/* header */}
          <View className="flex flex-col items-center space-y-2">
            <Text
              style={{ fontFamily: "Nunito_VariableFont" }}
              className="text-5xl font-extrabold text-blue-600"
            >
              Domore
            </Text>
            <Text className="text-gray-600 font-medium text-center text-base">
              Manage your tasks. Achieve more.
            </Text>
          </View>

          {/* form */}
          <View className="px-6 mt-12 mb-16">
            <Text
              style={{ fontFamily: "Nunito_VariableFont" }}
              className="text-2xl font-bold text-gray-700 mb-1"
            >
              Create Account
            </Text>

            <View className="gap-3">
              <TextInput
                keyboardType="email-address"
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="eg. muhammad@example.com"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="Create password"
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                secureTextEntry
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="Confirm password"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="First name"
                value={firstName}
                onChangeText={setFirstName}
              />
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base bg-white shadow-sm"
                placeholder="Last name"
                value={lastName}
                onChangeText={setLastName}
              />

              <TouchableOpacity
                onPress={handleSignUp}
                disabled={isLoading}
                className={`h-14 flex-row justify-center items-center rounded-xl shadow-lg ${
                  isLoading ? "bg-blue-500" : "bg-blue-600"
                }`}
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Text
                    style={{ fontFamily: "Nunito_VariableFont" }}
                    className="text-white text-lg font-bold"
                  >
                    Create Account
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {/* have account? */}
            <View className="flex-row space-x-2 mt-6 justify-center">
              <Text className="text-gray-600">Already have an account?</Text>
              <Link
                style={{ fontFamily: "Nunito_VariableFont" }}
                href="/signin"
                className="pl-1 text-blue-600 font-bold"
              >
                Sign In
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
