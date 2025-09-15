import { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import { db } from "@/config/firebase.config";
import { AuthContext } from "@/config/context.config";

export default function CreateTask() {
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleCreateTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Missing info", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        dueDate: dueDate.toISOString(),
        completed: false,
        createdBy: currentUser.uid,
        createdAt: new Date().getTime(),
      });

      setLoading(false);
      Alert.alert("Success", "Task created successfully", [
        { text: "Okay" },
        { text: "Go to My Tasks", onPress: () => router.replace("/mytasks") },
      ]);

      // Clear inputs
      setTitle("");
      setDescription("");
      setDueDate(new Date());
    } catch (error) {
      console.log("Error creating task:", error);
      setLoading(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowPicker(false); // Always close on Android
    }

    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-12">
      <Text className="text-3xl font-bold text-gray-800 mb-6">Create Task</Text>

      <ScrollView contentContainerStyle={{ gap: 20 }}>
        {/* Title */}
        <View>
          <Text className="text-base text-gray-500 mb-1">Task title</Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base"
            placeholder="e.g. Finish React Native Dashboard"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View>
          <Text className="text-base text-gray-500 mb-1">Task description</Text>
          <TextInput
            multiline
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base min-h-[100px]"
            placeholder="Describe this task..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* Due date */}
        <View>
          <Text className="text-base text-gray-500 mb-1">Due date</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            className="bg-gray-200 rounded-lg p-4"
          >
            <Text className="text-lg font-semibold text-gray-800">
              {dueDate.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showPicker && (
            <DateTimePicker
              testID="dateTimePicker"
              mode="datetime"
              value={dueDate}
              minimumDate={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onChangeDate}
            />
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleCreateTask}
          disabled={loading}
          className="bg-blue-600 rounded-lg py-4 items-center mt-4"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-bold">Create Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
