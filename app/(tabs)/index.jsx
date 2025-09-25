import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link, useRouter } from "expo-router";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } 
from "react-native";
import { db } from "../../config/firebase.config";
import { AuthContext } from "../../config/context.config";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("Super Achiever");
  const scrollViewRef = useRef(null);
  const router = useRouter();

  // ✅ Fetch user first name (real-time)
  useEffect(() => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        console.log("User data:", userSnap.data()); // debug
        setFirstName(userSnap.data().firstName || "Super Achiever");
      } else {
        console.log("No user document found for:", currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // ✅ Fetch tasks (real-time)
  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, "tasks"), where("createdBy", "==", currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dueDate is a JS Date if it’s a Firestore Timestamp
          dueDate: data.dueDate?.toDate?.() ?? data.dueDate ?? null,
        };
      });
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && t.dueDate < new Date()).length;
  const pending = tasks.filter((t) => !t.completed && (!t.dueDate || t.dueDate >= new Date())).length;

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-500 mt-2">Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <View style={{ width: screenWidth }} className="flex-1 bg-gray-200">
      {/* Header */}
      <View className="px-6 pt-5 pb-6 mt-4">
        <Text style={{ fontFamily: "Nunito_VariableFont" }} className="text-4xl font-extrabold text-blue-600">
          Domore
        </Text>
        <Text className="text-gray-600 text-lg mt-1">
          Welcome back, <Text style={{ fontFamily: "Nunito_VariableFont" }} 
          className="font-bold">{firstName}</Text> 👋
        </Text>
      </View>

      {/* cards */}
      <View className="flex-row justify-between px-4 ">
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md">
          <MaterialIcons name="assignment" size={28} color="#2563eb" />
          <Text className="text-gray-500 mt-2">Total</Text>
          <Text style={{ fontFamily: "Nunito_VariableFont" }} 
            className="text-3xl font-extrabold text-blue-600">{total}</Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md">
          <MaterialIcons name="check-circle" size={28} color="#22c55e" />
          <Text className="text-gray-500 mt-2">Completed</Text>
          <Text style={{ fontFamily: "Nunito_VariableFont" }}
            className="text-3xl font-extrabold text-green-600">{completed}</Text>
        </View>
      </View>

      <View className="flex-row justify-between px-4 mt-4">
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md">
          <MaterialIcons name="pending-actions" size={28} color="#eab308" />
          <Text className="text-gray-500 mt-2">Pending</Text>
          <Text style={{ fontFamily: "Nunito_VariableFont" }}
            className="text-3xl font-extrabold text-yellow-500">{pending}</Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md">
          <MaterialIcons name="error-outline" size={28} color="#ef4444" />
          <Text className="text-gray-500 mt-2">Overdue</Text>
          <Text style={{ fontFamily: "Nunito_VariableFont" }} 
            className="text-3xl font-extrabold text-red-500">{overdue}</Text>
        </View>
      </View>

      {/* Task list */}
      <View className="flex flex-row items-center justify-between mt-4 px-6">
        <Text style={{ fontFamily: "Nunito_VariableFont" }} className="text-xl font-extrabold text-blue-600">
          My Tasks
        </Text>
      </View>

      <ScrollView ref={scrollViewRef} className="mt-2 px-4">
        {tasks.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-500 mt-3 text-lg">You have no tasks yet!!!</Text>
            <Text className="text-gray-400 mt-1">
              Tap <Text className="font-bold text-xl">“+”</Text> to create one
            </Text>
          </View>
        ) : (
          tasks.map((task) => {
            const isOverdue = !task.completed && task.dueDate && task.dueDate < new Date();
            return (
              <View key={task.id} className="mb-2">
                <TouchableOpacity
                  onPress={() => router.push(`/view-tasks/${task.id}`)}
                  className={`rounded-2xl p-5 shadow-md border ${
                    task.completed
                      ? "bg-green-50 border-green-200"
                      : isOverdue
                      ? "bg-red-50 border-red-300"
                      : "bg-yellow-100 border-yellow-400"
                  }`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Nunito_VariableFont" }}
                        className={`text-lg font-bold ${
                        task.completed
                          ? "text-green-700"
                          : isOverdue
                          ? "text-red-700"
                          : "text-yellow-600"
                      }`}>
                        {task.title}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}
                      </Text>
                    </View>
                  </View>

                  <Text className={`mt-2 text-sm font-semibold ${
                    task.completed
                      ? "text-green-600"
                      : isOverdue
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}>
                    {task.completed ? "✅ Completed " : isOverdue ? "⚠️ Overdue" : "⏳ Pending"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Add Task Button */}
      <Link href={{ pathname: "/add-tasks/[tasks]", params: { tasks: "new" } }} asChild>
        <TouchableOpacity className="bg-blue-600 rounded-full p-4 shadow-lg absolute bottom-6 right-6
         md:bottom-4 md:right-4">
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
