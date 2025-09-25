import { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Dimensions } from "react-native";
import { AuthContext } from "../../config/context.config";
import { db } from "../../config/firebase.config";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, setDoc } from "firebase/firestore";


const screenWidth = Dimensions.get("window").width;

export default function UpdateProfileScreen() {
  const { currentUser } = useContext(AuthContext);
  const { uid } = useLocalSearchParams();
  const router = useRouter();

  const [profile, setProfile] = useState({
    firstName: "",
    nickName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
  if (!currentUser) return; // wait until currentUser is defined

  const fetchProfile = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        setProfile(snap.data());
      } else {
        setProfile({
          firstName: currentUser.displayName || "",
          nickName: "",
          email: currentUser.email || "",
          phone: "",
          gender: "",
          dob: "",
        });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setProfile({
        firstName: "",
        nickName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
      });
    } finally {
      setLoading(false); 
    }
  };

  fetchProfile();
}, [currentUser]); // rerun when currentUser changes


  const handleUpdate = async () => {
  if (!currentUser) return;
  setUpdating(true);
  try {
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, profile, { merge: true });
    Alert.alert("Success", "Profile updated successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  } catch (err) {
    console.error("Update error:", err);
    Alert.alert("Error", "Failed to update profile.");
  } finally {
    setUpdating(false);
  }
};


  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-2">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ width: screenWidth }} className="flex-1 bg-gray-200 p-6">
      <View className="pt-5 px-5">
        <Text style={{
              fontFamily: "Nunito_VariableFont"
              }} className="text-3xl font-bold text-blue-600 mb-4 text-center">
        Update Profile
      </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-md gap-3">
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="First Name"
          value={profile.firstName}
          onChangeText={(text) => setProfile({ ...profile, firstName: text })}
        />
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="Nick Name"
          value={profile.nickName}
          onChangeText={(text) => setProfile({ ...profile, nickName: text })}
        />
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="Email"
          editable={false}
          value={profile.email}
        />
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="Phone Number"
          value={profile.phone}
          onChangeText={(text) => setProfile({ ...profile, phone: text })}
        />
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="Gender"
          value={profile.gender}
          onChangeText={(text) => setProfile({ ...profile, gender: text })}
        />
        <TextInput
          className="bg-gray-100 p-3 rounded-xl"
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={profile.dob}
          onChangeText={(text) => setProfile({ ...profile, dob: text })}
        />
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-3 px-7 rounded-xl items-center mt-6"
        onPress={handleUpdate}
        disabled={updating}
      >
        <Text className="text-white font-bold text-lg">
          {updating ? "Updating..." : "Save Profile"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
