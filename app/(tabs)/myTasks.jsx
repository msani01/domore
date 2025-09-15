import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { db } from "../../config/firebase.config";
import { AuthContext } from "@/config/context.config";

const screenWidth = Dimensions.get("window").width;

export default function MyTasks() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Fetch tasks for logged-in user only
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUser.uid) // filter by userId
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setTasks(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const isOverdue = (task) =>
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  // filter task
  const filteredTasks =
    filter === "All"
      ? tasks
      : filter === "Completed"
      ? tasks.filter((t) => t.completed)
      : filter === "Pending"
      ? tasks.filter((t) => !t.completed && !isOverdue(t))
      : tasks.filter((t) => isOverdue(t));

  return (
    <View
      style={{ width: screenWidth }}
      className="flex-1 bg-gray-200 pt-10 relative"
    >
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
      </View>

      {/* filter tabs */}
      <View className="flex-row justify-around px-5 mb-5 flex-wrap">
        {["All", "Pending", "Completed", "Overdue"].map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setFilter(item)}
            className={`px-5 py-2 rounded-full shadow-sm mb-2 ${
              filter === item ? "bg-blue-600" : "bg-white"
            }`}
          >
            <Text
              className={`font-bold ${
                filter === item ? "text-white" : "text-gray-700"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Loader */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" /> 
          <Text className="mt-3 text-gray-500">Loading tasks...</Text>
        </View>
      ) : (
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
                          ? "text-gray-400 line-through"
                          : isOverdue(task)
                          ? "text-red-700"
                          : "text-gray-800"
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
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* add Tasks */}
      <Link
        href={{ pathname: "/add-tasks/[tasks]", params: { tasks: "new" } }}
        asChild
      >
        <TouchableOpacity
          className="bg-blue-600 rounded-full p-4 shadow-lg absolute bottom-6 right-6"
        >
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
