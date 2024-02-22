import { View, Text, TouchableOpacity, Image, TextInput, Modal } from "react-native";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { doc, setDoc } from "firebase/firestore";
import { firestoreDB, firestoredb } from "../config/firebase.config";



const AddToChat = () => {
  const user = useSelector((state) => state.user.user);
  const [addToChat, setAddToChat] = useState("");
  const navigation = useNavigation();

  const createNewChat = async () => {
    let id = `${Date.now()}`;

    const now = new Date();
    const formattedDateTime = now.toLocaleString();

    // แยกวันที่ออกจากวันที่และเวลา
    const formattedDate = now.toLocaleDateString();

    const _doc = {
      _id: id,
      user: user,
      chatName: addToChat,
      createdAt: formattedDateTime,
      createdDate: formattedDate, // เพิ่มข้อมูลเฉพาะวันที่
    };

    if (addToChat !== "") {
      setDoc(doc(firestoredb, "chats", id), _doc)
        .then(() => {
          setAddToChat("");
          navigation.navigate("HomeScreen");
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <View className="flex-1">
      {/* top */}
      <View className="w-full bg-purple-500 px-4 py-6 flex-[0.25]">
        <View className="flex-row items-center justify-between w-full px-4 py-12">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="chevron-left" size={32} color={"#fbfbfb"} />
          </TouchableOpacity>

          {/* user profile */}
          <View className="flex-row items-center justify-center space-x-3">
            <Image
              source={{ uri: user?.profilePic }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          </View>
        </View>
      </View>

      {/* bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <View className="w-full px-4 py-4 items-center ">
          <View className="w-full px-4 flex-row items-center justify-between py-3 rounded-xl border border-gray-200 space-x-3">
            {/* icons */}
            <Ionicons name="chatbubbles" size={24} color={"#777"} />
            {/* textinput */}
            <TextInput
              placeholder="Create a chat"
              placeholderTextColor={"#999"}
              value={addToChat}
              onChangeText={(text) => setAddToChat(text)}
              className="flex-1 text-lg text-primaryText -mt-2 h-12 w-full"
            />
            {/* icon */}
            <TouchableOpacity onPress={createNewChat}>
              <FontAwesome name="send" size={24} color="#777" />
            </TouchableOpacity>
            
          </View>
          
        </View>
              
             
      </View>
      
    </View>
  );
};

export default AddToChat;