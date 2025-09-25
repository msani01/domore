import { Tabs } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


export default function _Layout () {
    return (
        <Tabs>
            <Tabs.Screen
            name="index"
            options={{
                title: "Dashboard",
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <MaterialIcons 
                    name="dashboard" 
                    size={30} 
                    color={color}/>)
            }}
            />

            <Tabs.Screen
            name="myTasks"
            options={{
                title: "My Tasks",
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <MaterialIcons 
                    name="task" 
                    size={30} 
                    color={color}/>)
            }}
            />

            <Tabs.Screen
            name="profile"
            options={{
                title: "My Profile",
                headerShown: false,
                tabBarIcon: ({color}) => (
                    <FontAwesome5 
                    name="user" 
                    size={30} 
                    color={color}/>)
            }}
            />

             
        </Tabs>
    )
}