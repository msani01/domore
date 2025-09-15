import React from 'react'
import { View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Link } from 'expo-router';

const AddTasksLink = () => {
  return (
    <Link href={"/"}>
        <View
          className="bg-blue-600 rounded-full p-3 shadow-lg absolute bottom-4 right-4"
        >
          <AntDesign name="plus" size={20} color="white" />
        </View>
    </Link>
  )
}

export default AddTasksLink
