import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, useRouter } from "expo-router";
import {
  collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { ActivityIndicator, Dimensions, Pressable, ScrollView, Text, TouchableOpacity, View,
} from "react-native";
import { db } from "../../config/firebase.config";
import { AuthContext } from "@/config/context.config";

const screenWidth = Dimensions.get("window").width;

export default function MyTasks() {
  const { currentUser } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTasks(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const isOverdue = (task) =>
    !task.completed && task.dueDate && new Date(task.dueDate) < new Date();

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { completed: !currentStatus });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "All") return true;
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed && !isOverdue(task);
    if (filter === "Overdue") return isOverdue(task);
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (isOverdue(a) && !isOverdue(b)) return -1;
    if (!isOverdue(a) && isOverdue(b)) return 1;
    if (!a.completed && b.completed) return -1;
    if (a.completed && !b.completed) return 1;
    return 0;
  });

  return (
    <View
      style={{ width: screenWidth }}
      className="flex-1 bg-gray-200 relative"
    >
      {/* heade */}
      <View className="flex-row justify-between items-center mt-4 pt-5 px-6 mb-4">
        <View>
          <Text style={{
              fontFamily: "Nunito_VariableFont"
              }} className="text-3xl font-extrabold text-blue-600 tracking-tight">
            My Task(s)
          </Text>
          <Text className="text-gray-600 text-base mt-1">
            Stay on top of your goals
          </Text>
        </View>
      </View>

      {/* tabs */}
      <View style={{
              fontFamily: "Nunito_VariableFont"
              }} className="flex-row justify-around px-1 mb-5 flex-wrap">
        {["All", "Pending", "Completed", "Overdue"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            className={`px-5 py-2 rounded-full shadow-sm mb-2 ${
              filter === item ? "bg-blue-600" : "bg-white"
            }`}
          >
            <Text
              className={`font-semibold ${
                filter === item ? "text-white" : "text-gray-700"
              }`}
            >
              {item}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Load */}
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
          {sortedTasks.length === 0 ? (
            <View className="items-center justify-center mt-20">
              <Text className="text-gray-500 mt-3 text-lg font-semibold">
                No tasks
              </Text>
              <Text className="text-gray-400 mt-1">
                Tap <Text className="font-bold text-xl">“+”</Text> to create a task
              </Text>
            </View>
          ) : (
            sortedTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                onPress={() => router.push(`/view-tasks/${task.id}`)}
                className={`rounded-2xl p-4 mb-1 shadow-md border flex-row justify-between items-center ${
                  task.completed
                    ? "bg-green-50 border-green-200"
                    : isOverdue(task)
                    ? "bg-red-50 border-red-300"
                    : "bg-yellow-100 border-yellow-500"
                }`}
              >
                <View className="flex-1 pr-4">
                  <Text style={{ fontFamily: "Nunito_VariableFont" }}
                    className={`text-lg font-bold ${
                      task.completed
                        ? "text-green-700"
                        : isOverdue(task)
                        ? "text-red-700"
                        : "text-yellow-600"
                    }`}
                  >
                    {task.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}
                  </Text>
                  {/* <Text className={`mt-2 text-sm font-semibold ${
                    task.completed
                      ? "text-green-600"
                      : isOverdue
                      ? "text-red-500"
                      : "text-yellow-600"
                  }`}>
                    {task.completed ? "✅ Completed " : isOverdue ? "⚠️ Overdue" : "⏳ Pending"}
                  </Text> */}
                </View>

                <Pressable
                  onPress={() => toggleComplete(task.id, task.completed)}
                  className={`px-3 py-2 rounded-lg ${
                    task.completed ? "bg-yellow-500" : "bg-green-600"
                  }`}
                >
                  <Text className="text-white font-bold">
                    {task.completed ? "Undo" : "Done"}
                  </Text>
                </Pressable>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}

      {/* add task Button */}
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
