import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Pressable,
  Platform,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/config/firebase.config";
import { AuthContext } from "@/config/context.config";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

export default function EditTask() {
  const { currentUser } = useContext(AuthContext);
  const { editTask } = useLocalSearchParams(); // matches [editTask].jsx
  const router = useRouter();

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Fetch task from Firestore
  useEffect(() => {
    if (!editTask) return;

    const fetchTask = async () => {
      try {
        const taskRef = doc(db, "tasks", editTask);
        const snap = await getDoc(taskRef);
        if (snap.exists()) {
          const data = snap.data();
          setTask({
            title: data.title || "",
            description: data.description || "",
            dueDate: data.dueDate ? new Date(data.dueDate) : new Date(),
          });
        } else {
          Alert.alert("Error", "Task not found.");
          router.back();
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [editTask]);

  // Android date & time picker
  const openAndroidPicker = () => {
    DateTimePickerAndroid.open({
      value: task.dueDate,
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
                setTask({ ...task, dueDate: newDate });
              }
            },
          });
        }
      },
    });
  };

  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const handleUpdate = async () => {
    if (!task.title || !task.description || !task.dueDate) {
      Alert.alert("Missing info", "Please fill all fields");
      return;
    }

    setUpdating(true);
    try {
      const taskRef = doc(db, "tasks", editTask);
      await updateDoc(taskRef, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.getTime(),
        dueDateFormatted: formatDateTime(task.dueDate),
      });
      Alert.alert("Success", "Task updated successfully", [
        { text: "OK", onPress: () => router.replace(`/myTasks`) },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update task.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-12">
      <Text style={{ fontFamily: "Nunito_VariableFont" }}  
        className="text-3xl font-bold text-blue-600 mb-6">Edit Task</Text>
      <ScrollView contentContainerStyle={{ gap: 20 }}>
        {/* title */}
        <View>
          <Text className="text-base text-gray-500 mb-1 font-bold">Task title:</Text>
          <TextInput
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base"
            value={task.title}
            onChangeText={(text) => setTask({ ...task, title: text })}
          />
        </View>

        {/* description */}
        <View>
          <Text className="text-base text-gray-500 mb-1 font-bold">Task description:</Text>
          <TextInput
            multiline
            className="border border-gray-300 bg-white rounded-lg px-4 py-3 text-base min-h-[50px]"
            value={task.description}
            onChangeText={(text) => setTask({ ...task, description: text })}
          />
        </View>

        {/* due date */}
        <View>
          <Text className="text-base text-gray-500 mb-1 font-bold">Due date:</Text>
          <Pressable
            onPress={() => {
              if (Platform.OS === "android") openAndroidPicker();
              else setShowPicker(true);
            }}
            className="bg-gray-200 rounded-lg p-4"
          >
            <Text className="text-gray-800 text-lg">{formatDateTime(task.dueDate)}</Text>
          </Pressable>

          {Platform.OS === "ios" && showPicker && (
            <DateTimePicker
              value={task.dueDate}
              mode="datetime"
              display="inline"
              onChange={(event, selectedDate) => {
                if (selectedDate) setTask({ ...task, dueDate: selectedDate });
              }}
            />
          )}
        </View>

        {/* update */}
        <TouchableOpacity
          onPress={handleUpdate}
          disabled={updating}
          className="bg-blue-600 rounded-lg py-4 items-center mt-4"
        >
          {updating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ fontFamily: "Nunito_VariableFont" }}  
                className="text-white text-lg font-bold">Update Task</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
