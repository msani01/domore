import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebase.config";
import { AuthContext } from "../../config/context.config";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch only the logged in user tasks
  useEffect(() => {
    if (!currentUser) return; // prevent query if user not ready

    const q = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(fetchedTasks);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const overdue = tasks.filter(
    (t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()
  ).length;

  // pending excludes overdue
  const pending = tasks.filter(
    (t) =>
      !t.completed &&
      (!t.dueDate || new Date(t.dueDate) >= new Date())
  ).length;

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
      {/* header */}
      <View className="px-6 pt-5 pb-6 mt-4">
        <Text className="text-4xl font-extrabold text-blue-700">Domore</Text>
        <Text className="text-gray-600 text-lg mt-1">
          Welcome back, <Text className="font-bold">Super Achiever</Text> 👋
        </Text>
      </View>

      {/* cards */}
      <View className="flex-row justify-between px-4 mt-1">
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md">
          <MaterialIcons name="assignment" size={28} color="blue" />
          <Text className="text-gray-500 mt-2">Total</Text>
          <Text className="text-3xl font-extrabold text-blue-700">{total}</Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md">
          <MaterialIcons name="check-circle" size={28} color="#22c55e" />
          <Text className="text-gray-500 mt-2">Completed</Text>
          <Text className="text-3xl font-extrabold text-green-600">
            {completed}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between px-4 mt-4">
        <View className="flex-1 bg-white rounded-2xl p-4 mr-2 shadow-md">
          <MaterialIcons name="pending-actions" size={28} color="#3b82f6" />
          <Text className="text-gray-500 mt-2">Pending</Text>
          <Text className="text-3xl font-extrabold text-blue-500">
            {pending}
          </Text>
          <Text className="text-xs font-medium text-gray-400 mt-1">
            Tasks still on track ⏳
          </Text>
        </View>

        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md">
          <MaterialIcons name="error-outline" size={28} color="#ef4444" />
          <Text className="text-gray-500 mt-2">Overdue</Text>
          <Text className="text-3xl font-extrabold text-red-500">{overdue}</Text>
          <Text className="text-xs font-medium text-gray-400 mt-1">
            Needs attention ⚠️
          </Text>
        </View>
      </View>

      {/* task header */}
      <View className="flex flex-row items-center justify-between mt-6 px-4">
        <Text className="text-xl font-extrabold text-gray-800">My Tasks</Text>
      </View>

      {/* tasks */}
      <ScrollView className="mt-4 px-4 mb-20">
        {tasks.length === 0 ? (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-400 mt-3 text-lg">
              You have no tasks yet!!!
            </Text>
            <Text className="text-gray-500 mt-1">
              Tap <Text className="font-bold">“Add Task”</Text> to create one
            </Text>
          </View>
        ) : (
          tasks.map((task) => (
            <View
              key={task.id}
              className={`rounded-2xl p-5 mb-4 shadow-md border ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-100"
              }`}
            >
              <Text
                className={`text-lg font-semibold ${
                  task.completed ? "line-through text-gray-400" : "text-gray-800"
                }`}
              >
                {task.title}
              </Text>
              <Text className="text-sm text-gray-500">
                Due:{" "}
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleString()
                  : "No due date"}
              </Text>
              {task.completed ? (
                <Text className="mt-2 text-green-600 text-sm font-semibold">
                  ✅ Completed
                </Text>
              ) : task.dueDate && new Date(task.dueDate) < new Date() ? (
                <Text className="mt-2 text-red-500 text-sm font-semibold">
                  ⚠️ Overdue
                </Text>
              ) : (
                <Text className="mt-2 text-yellow-600 text-sm font-semibold">
                  ⏳ Pending
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add task */}
      <Link
        href={{ pathname: "/add-tasks/[tasks]", params: { tasks: "new" } }}
        asChild
      >
        <TouchableOpacity className="bg-blue-600 rounded-full p-4 shadow-lg absolute bottom-6 right-6">
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
