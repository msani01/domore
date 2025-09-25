import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from "react-native";
import { db } from "../../config/firebase.config";
import AntDesign from '@expo/vector-icons/AntDesign';
import EditTask from "../edit-tasks/[editTask]";

export default function TaskDetail() {
  const { taskid } = useLocalSearchParams();
  const router = useRouter();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false); //

  useEffect(() => {
    if (!taskid) return;

    const fetchTask = async () => {
      try {
        const taskRef = doc(db, "tasks", taskid);
        const snapshot = await getDoc(taskRef);
        if (snapshot.exists()) {
          setTask({ id: snapshot.id, ...snapshot.data() });
        } else {
          setTask(null);
        }
      } catch (error) {
        console.error(error);
        setTask(null);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskid]);

  const deleteTask = async () => {
    if (!task) return;
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setDeleting(true); //  start 
            try {
              const taskRef = doc(db, "tasks", task.id);
              await deleteDoc(taskRef);
              router.back();
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete task.");
            } finally {
              setDeleting(false); // stop
            }
          },
        },
      ]
    );
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );

  if (!task)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text>Task not found.</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-gray-200">
      {/* header */}
      <View className="flex-row items-center px-1 py-3 border-b border-gray-200 gap-2 mt-9">
        <TouchableOpacity onPress={() => router.back()} className="ml-1">
          <AntDesign name="arrow-left" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text style={{
              fontFamily: "Nunito_VariableFont" }}  
          className="text-2xl font-bold  text-blue-700">Task Details</Text>
      </View>

      <ScrollView className="flex-1 p-2">
        <View>
          <Text className="font-semibold p-1">Title:</Text>
          <View className="border-2 p-3 bg-slate-100 border-gray-300 rounded-xl">
            <Text className="text-lg font-bold mb-2">{task.title}</Text>
          </View>

          <Text className="font-semibold p-1">Description:</Text>
          <View className="border-2 p-3 bg-slate-100 border-gray-300 rounded-xl">
            <Text className="text-gray-800 mb-2">{task.description || "No description provided."}</Text>
          </View>

          <Text className="font-semibold p-1">Due Date:</Text>
          <View className="border-2 p-3 bg-slate-100 border-gray-300 rounded-xl">
            <Text className="text-gray-600 mb-2">
              Due: {task.dueDate ? new Date(task.dueDate).toLocaleString() : "No due date"}
            </Text>
          </View>

          <Text className="font-semibold p-1">Status:</Text>
          <View className="border-2 p-3 bg-slate-100 border-gray-300 rounded-xl">
            <Text className={`mb-2 ${task.completed ? "text-green-600" : "text-yellow-600"}`}>
              Status: {task.completed ? "Completed ✅" : "Pending ⏳"}
            </Text>
          </View>
        </View>

        {/* edit/delete*/}
        <View className="flex-row mt-6 gap-2">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: `/edit-tasks/[editTask]`,
                params: { editTask: task.id }, // ✅ key matches [editTask].jsx
              })
            }
            className="flex-1 px-4 py-3 rounded-lg bg-blue-600"
          >
            <Text className="text-white font-bold text-center">Edit</Text>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={deleteTask}
            className="flex-1 px-4 py-2 rounded-lg bg-red-600 flex-row justify-center items-center"
            disabled={deleting} 
          >
            {deleting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ fontFamily: "Nunito_VariableFont" }} 
                className="text-white font-bold text-center">Delete</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
