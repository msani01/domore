import { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Dimensions } from "react-native";
import { AuthContext } from "../../config/context.config";
import { db } from "../../config/firebase.config";
import { useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase.config";

const screenWidth = Dimensions.get("window").width;

export default function ProfileScreen() {
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) setProfile(snap.data());
        else setProfile({
          firstName: currentUser.displayName || "",
          nickName: "",
          email: currentUser.email || "",
          phone: "",
          gender: "",
          dob: "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/signin");
    } catch (error) {
      console.error("Logout error:", error);
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
    <View style={{ width: screenWidth }} className="flex-1 bg-gray-200  p-6">
      <View className="mt-4">
        <Text style={{ fontFamily: "Nunito_VariableFont" }} 
          className="text-3xl font-extrabold text-blue-600 mb-4 text-center">
          My Profile
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-md gap-3">
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">First Name: </Text>
           <Text className="font-normal ">{profile.firstName}</Text>
        </View>
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">Nick Name: </Text>
           <Text className="font-normal ">{profile.nickName}</Text>
        </View>
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">Email: </Text>
           <Text className="font-normal ">{profile.email}</Text>
        </View>
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">Phone: </Text>
           <Text className="font-normal ">{profile.phone}</Text>
        </View>
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">Gender: </Text>
           <Text className="font-normal ">{profile.gender}</Text>
        </View>
        <View className=" flex flex-row border-2 p-3 bg-slate-100 border-gray-300 rounded-xl items-center">
           <Text  style={{ fontFamily: "Nunito_VariableFont" }} className="font-bold text-md">DOB: </Text>
           <Text className="font-normal ">{profile.dob}</Text>
        </View>
       
      </View>

      <View className="flex flex-row gap-5 mt-6">
        <TouchableOpacity
          className="bg-blue-600 py-3 px-7 rounded-xl items-center"
          onPress={() => router.push(`/update-profile/${currentUser.uid}`)}
        >
          <Text className="text-white font-bold text-lg">Update Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 py-3 px-7 rounded-xl items-center"
          onPress={async () => {
            try {
              await signOut(auth);
              router.replace("/signin");
            } catch (err) {
              console.error(err);
            }
          }}
        >
          <Text className="text-white font-bold text-lg">Logout</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
}
