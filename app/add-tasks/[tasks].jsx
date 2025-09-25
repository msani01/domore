import { useContext, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Pressable, Platform } from "react-native";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { db } from "@/config/firebase.config";
import { AuthContext } from "@/config/context.config";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function CreateTask() {
  const { currentUser } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false); // for iOS 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: dueDate,
      mode: "date",
      is24Hour: true,
      onChange: (event, selectedDate) => {
        if (event.type === "set" && selectedDate) {
          let newDate = new Date(selectedDate);

          DateTimePickerAndroid.open({
            value: newDate,
            mode: "time",
            is24Hour: true,
            onChange: (event2, selectedTime) => {
              if (event2.type === "set" && selectedTime) {
                newDate.setHours(selectedTime.getHours());
                newDate.setMinutes(selectedTime.getMinutes());
                setDueDate(newDate);
              }
            },
          });
        }
      },
    });
  };

  const handleCreateTask = async () => {
    if (!title || !description || !dueDate) {
      Alert.alert("Missing info", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      // save task
      await addDoc(collection(db, "tasks"), {
        title,
        description,
        dueDate: dueDate.getTime(),
        dueDateFormatted: formatDateTime(dueDate),
        completed: false,
        createdBy: currentUser?.uid ?? "guest",
        createdAt: new Date().getTime(),
      });

      // Schedule notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Task Reminder ⏰",
          body: `Reminder: ${title} is due now`,
        },
        trigger: dueDate, // ✅ triggers at the exact datetime
      });

      Alert.alert("Success", "Task created successfully", [
        { text: "Okay" },
        { text: "Go to My Tasks", onPress: () => router.replace("/myTasks") },
      ]);

      // Reset fields
      setTitle("");
      setDescription("");
      setDueDate(new Date());
    } catch (error) {
      console.log("Error creating task:", error);
      Alert.alert("Error", "Failed to create task.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-12">
      <Text style={{
              fontFamily: "Nunito_VariableFont" }}  
        className="text-3xl font-bold text-blue-600 mb-6">Create Task</Text>
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        {/* Title */}
        <View>
          <Text style={{
              fontFamily: "Nunito_VariableFont" }}  
            className="text-base text-gray-500 mb-1 font-bold">Task title:</Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base"
            placeholder="e.g. Maths Assignmet."
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Description */}
        <View>
          <Text style={{
              fontFamily: "Nunito_VariableFont" }}  
            className="text-base text-gray-500 mb-1 font-bold">Task description:</Text>
          <TextInput
            multiline
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base min-h-[50px]"
            placeholder="Describe this task..."
            value={description}
            onChangeText={setDescription}
          />
        </View>

        {/* due date */}
        <View>
          <Text style={{
              fontFamily: "Nunito_VariableFont" }} 
            className="text-base text-gray-500 mb-1 font-bold">Due date:</Text>
          <Pressable
            onPress={() => {
              if (Platform.OS === "android") openAndroidPicker();
              else setShowPicker(true);
            }}
            className="bg-gray-200 rounded-lg p-4"
          >
            <Text className="text-gray-800 text-lg">{formatDateTime(dueDate)}</Text>
          </Pressable>

          {Platform.OS === "ios" && showPicker && (
            <DateTimePicker
              value={dueDate}
              mode="datetime"
              display="inline"
              onChange={(event, selectedDate) => {
                if (selectedDate) setDueDate(selectedDate);
              }}
            />
          )}
        </View>

        {/* submit */}
        <TouchableOpacity
          onPress={handleCreateTask}
          disabled={loading}
          className="bg-blue-600 rounded-lg py-4 items-center mt-4"
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{
              fontFamily: "Nunito_VariableFont" }} className="text-white text-lg font-bold">Create Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
