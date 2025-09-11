import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { db, auth } from "../../config/firebase.cofig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


export default function AddTask() {
  const { user } = auth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        dueDate,
        userId: user?.uid,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setDueDate("");
      Alert.alert("Success", "Task added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error adding task:", error);
      Alert.alert("Error", "Failed to add task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-6 justify-center">
      <Text className="text-2xl font-bold text-cyan-400 mb-6 text-center">
        Add New Task
      </Text>

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700"
        placeholder="Task Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-4 border border-gray-700 h-24"
        placeholder="Task Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        className="bg-gray-800 text-white p-3 rounded-lg mb-6 border border-gray-700"
        placeholder="Due Date (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <TouchableOpacity
        className={`p-4 rounded-lg items-center ${
          loading ? "bg-gray-600" : "bg-cyan-500"
        }`}
        onPress={handleAddTask}
        disabled={loading}
      >
        <Text className="text-white font-bold text-lg">
          {loading ? "Adding..." : "Add Task"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}