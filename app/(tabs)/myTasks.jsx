import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";

const screenWidth = Dimensions.get("window").width;

export default function MyTasks() {
  // Sample task data
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
    //   completed: true,
    // },
    // {
    //   id: "3",
    //   title: "Finish React Native Dashboard",
    //   dueDate: "2025-08-30 10:00", // Overdue task example
    //   completed: false,
    // },
    // {
    //   id: "4",
    //   title: "Sleep for 4 hours 😴",
    //   dueDate: "2025-09-06 18:00",
    //   completed: false,
    // },
  ]);

  const [filter, setFilter] = useState("All");

  // check overdue
  const isOverdue = (task) =>
    !task.completed && new Date(task.dueDate) < new Date();

  // tasks filter tab
  const filteredTasks =
    filter === "All"
      ? tasks
      : filter === "Completed"
      ? tasks.filter((t) => t.completed)
      : filter === "Pending"
      ? tasks.filter((t) => !t.completed && !isOverdue(t))
      : tasks.filter((t) => isOverdue(t)); 

  return (
    <View style={{ width: screenWidth }} className="flex-1 bg-gray-200 pt-10 relative">

      {/* header */}
      <View className="flex-row justify-between items-center px-5 mb-4">
        <View>
          <Text className="text-3xl font-extrabold text-blue-700 tracking-tight">
            My Task(s) 
          </Text>
          <Text className="text-gray-500 text-base mt-1">
            Stay on top of your goals 
          </Text>
        </View>
        
       <Link href={"./add-tasks/[tasks]"}>
        <View
          className="bg-blue-600 rounded-full p-3 shadow-lg absolute bottom-4 right-4"
        >
          <AntDesign name="plus" size={20} color="white" />
        </View>
       </Link>
      </View>

      {/* tabs filter */}
      <View className="flex-row justify-around px-5 mb-5 flex-wrap">
        {["All", "Pending", "Completed", "Overdue"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            className={`px-5 py-2 rounded-full shadow-sm mb-2 ${
              filter === item
                ? item === "Overdue"
                  ? "bg-blue-600"
                  : "bg-blue-600"
                : "bg-white"
            }`}
          >
            <Text
              className={`font-bold ${
                filter === item
                  ? "text-white"
                  : item === "Overdue"
                  ? "text-gray-700"
                  : "text-gray-700"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* tasks list */}
      <ScrollView
        className="px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {filteredTasks.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-gray-500 mt-3 text-lg font-semibold">
              No tasks 
            </Text>
            <Text className="text-gray-400 mt-1">
              Tap <Text className="font-bold">“+”</Text> to create a task
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <View
              key={task.id}
              className={`rounded-2xl p-4 mb-4 shadow-md border ${
                task.completed
                  ? "bg-green-50 border-green-200"
                  : isOverdue(task)
                  ? "bg-red-50 border-red-300"
                  : "bg-white border-gray-100"
              }`}
            >
              <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-4">
                  <Text
                    className={`text-lg font-semibold ${
                      task.completed
                        ? "text-gray-400"
                        : isOverdue(task)
                        ? "text-red-700"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Due: {new Date(task.dueDate).toLocaleString()}
                  </Text>
                </View>

              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
