import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Link } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function Dashboard() {
  // Task data
  const [tasks, setTasks] = useState([
    // {
    //   id: "1",
    //   title: "Design the Sign In/Sign Up Screen",
    //   dueDate: "2025-09-05 14:00",
    //   completed: false,
    // },
    // {
    //   id: "2",
    //   title: "5 Aside Football Match",
    //   dueDate: "2025-09-05 16:30",
    //   completed: false,
    // },
    // {
    //   id: "3",
    //   title: "Finish React Native Dashboard",
    //   dueDate: "2025-09-06 10:00",
    //   completed: true,
    // },
    // {
    //   id: "4",
    //   title: "Sleep for 4 hours 😴",
    //   dueDate: "2025-09-06 18:00",
    //   completed: false,
    // },
  ]);

  // stats
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter(
    (t) => !t.completed && new Date(t.dueDate) < new Date()
  ).length;

  return (
    <View style={{ width: screenWidth }} className="flex-1 bg-gray-200">
      {/* header */}
      <View className="px-6 pt-5 pb-6 mt-4">
        <Text className="text-4xl font-extrabold text-blue-700">
          Domore 
        </Text>
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
          <MaterialIcons name="pending-actions" size={28} color="#f59e0b" />
          <Text className="text-gray-500 mt-2">Pending</Text>
          <Text className="text-3xl font-extrabold text-yellow-500">
            {pending}
          </Text>
        </View>
        <View className="flex-1 bg-white rounded-2xl p-4 ml-2 shadow-md">
          <MaterialIcons name="error-outline" size={28} color="#ef4444" />
          <Text className="text-gray-500 mt-2">Overdue</Text>
          <Text className="text-3xl font-extrabold text-red-500">
            {overdue}
          </Text>
        </View>
      </View>

      {/* tasks header */}
      <View className="flex flex-row items-center justify-between mt-6 px-4">
        <Text className="text-xl font-extrabold text-gray-800">My Tasks </Text>
        <Link href={"@/"} >
          <TouchableOpacity className="bg-blue-600 rounded-full px-3 py-3 shadow-md flex-row items-center">
            <AntDesign name="plus" size={20} color="white" />
          </TouchableOpacity>
        </Link>
      </View>

      {/* taks */}
      <ScrollView className="mt-4 px-4 mb-">
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
                Due: {new Date(task.dueDate).toLocaleString()}
              </Text>
              {task.completed ? (
                <Text className="mt-2 text-green-600 text-sm font-semibold">
                  ✅ Completed
                </Text>
              ) : new Date(task.dueDate) < new Date() ? (
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

      {/*  */}
    </View>
  );
}
