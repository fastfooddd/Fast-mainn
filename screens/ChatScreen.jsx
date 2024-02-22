import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  StatusBar,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { firestoredb } from "../config/firebase.config";

const ChatScreen = ({ route }) => {
  const { room } = route.params;
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);

  const user = useSelector((state) => state.user.user);

  const sendAMessage = async () => {
    const timeStamp = serverTimestamp();
    const currentDate = new Date(); // เก็บวันที่ปัจจุบัน
    const id = `${currentDate.getTime()}`; // เก็บเวลาปัจจุบันเป็น timestamp
    const formattedDate = currentDate.toLocaleString(); // แปลงเวลาปัจจุบันเป็นข้อความที่แสดงวันที่

    const _doc = {
      _id: id,
      roomId: room._id,
      timeStamp: timeStamp,
      message: message,
      user: user,
      sentAt: formattedDate // เพิ่มข้อมูลวันที่ที่แสดงไว้ในเอกสาร
    };

    setMessage("");
    await addDoc(
      collection(doc(firestoredb, "chats", room._id), "messages"),
      _doc
    )
      .then(() => {})
      .catch((err) => alert(err));
};


  useLayoutEffect(() => {
    const msgQuery = query(
      collection(firestoredb, "chats", room?._id, "messages"),
      orderBy("timeStamp", "asc")
    );

    const unsubscribe = onSnapshot(msgQuery, (querySnapShot) => {
      const updatedMessages = querySnapShot.docs.map((doc) => doc.data());
      setMessages(updatedMessages);
      setisLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <View className="flex-1">
      <StatusBar backgroundColor="#2ecc71" barStyle="light-content" />
      {/* top */}
      <View className="w-full bg-purple-500 px-4 py-6 flex-[0.25]">
        <View className="flex-column items-start justify-between w-full px-4 py-5">
          {/* go back */}
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="close" size={36} color={"#fbfbfb"} />
          </TouchableOpacity>

          {/*  profile */}
          <View className="flex-row items-center justify-center space-x-3 py-4">
            <View className="w-12 h-12 rounded-full border border-white flex items-center justify-center">
              <FontAwesome5 name="users" size={24} color="#fbfbfb" />
            </View>

            <View>
              <Text className="text-gray-50 text-base font-semibold capitalize ">
                {room.chatName.length > 16
                  ? `${room.chatName.slice(0, 16)}..`
                  : room.chatName}
              </Text>
              {/* <Text className="text-gray-100 text-sm font-semibold capitalize">
                online
              </Text> */}
            </View>
          </View>

          {/* icons */}
          {/* <View className="flex-row items-center justify-center space-x-3">
            <TouchableOpacity>
              <FontAwesome5 name="video" size={24} color="#fbfbfb" />
            </TouchableOpacity>

            <TouchableOpacity>
              <FontAwesome name="phone" size={24} color="#fbfbfb" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Entypo name="dots-three-vertical" size={24} color="#fbfbfb" />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>

      {/* bottom section */}
      <View className="w-full bg-white px-4 py-6 rounded-t-[50px] flex-1 -mt-10">
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={180}
        >
          <>
            <ScrollView>
              {isLoading ? (
                <>
                  <View className="w-full flex items-center justify-center">
                    <ActivityIndicator size={"large"} color={"#43C651"} />
                  </View>
                </>
              ) : (
                <>
                  {messages?.map((msg) =>
                    msg?.user.providerData?.email ===
                    user.providerData.email ? (
                      <>
                        <View className="m-1" key={msg._id}>
                          <View
                            style={{ alignSelf: "flex-end" }}
                            className="px-4 py-2 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl bg-purple-500 w-auto relative"
                          >
                            <Text className="text-base font-semibold text-white">
                              {msg.message}
                            </Text>
                          </View>

                          <View style={{ alignSelf: "flex-end"  }}>
                            
                              <Text className="text-[12px] text-gray-500 font-semibold">
                                {msg?.sentAt}
                              </Text>
                           
                          </View>
                        </View>
                      </>
                    ) : (
                      <>
                      <View style={{ alignSelf: "flex-start" }}
                                className="px-20 py-0 w-auto "
                                >
                                  <Text className="text-s text-gray-500 pt-1">
                                 {msg?.user?.fullName}
                                  </Text>
                            </View>
                        <View
                          key={msg._id}
                          style={{ alignSelf: "flex-start" }}
                          className="flex items-center justify-start space-x-2 mb-10"
                        >
                          {/* <View style={{ alignSelf: "flex-start" }}
                                className="px-20 py-2 mb-15  bg-gray-300 w-auto "
                                >
                                  <Text className="text-xl font-semibold text-purple-500 pt-1">
                                 {user?.fullName}
                                  </Text> */}
                            {/* </View> */}
                          <View className="flex-row items-center justify-center space-x-2">
                            {/* image */}
                            <Image
                              className="w-12 h-12 rounded-full"
                              resizeMode="cover"
                              source={{ uri: msg?.user?.profilePic }}
                            />
                            

                            <View>
                              <View
                                style={{ alignSelf: "flex-start" }}
                                className="px-4 py-2  rounded-tl-2xl rounded-tr-2xl rounded-br-2xl bg-gray-300 w-auto relative"
                              >
                                <Text className="text-base font-semibold text-black">
                                  {msg.message}
                                </Text>
                              </View>

                              <View style={{ alignSelf: "flex-start" }}>
                                
                                  <Text className="text-[12px] text-gray-500 font-semibold">
                                    {msg?.sentAt}
                                  </Text>
                                
                              </View>
                            </View>
                          </View>
                        </View>
                      </>
                    )
                  )}
                </>
              )}
            </ScrollView>

            <View className="w-full flex-row items-center justify-center px-8 space-x-2">
              <View className="bg-gray-200 rounded-2xl px-4 space-x-4 py-2 flex-row items-center justify-between">
                {/* <TouchableOpacity>
                  <Entypo name="emoji-happy" size={24} color="#555" />
                </TouchableOpacity> */}

                <TextInput
                  className="flex-1 h-8 text-base text-primaryText font-semibold"
                  placeholder="Type here.."
                  placeholderTextColor={"#999"}
                  value={message}
                  onChangeText={(text) => setMessage(text)}
                />
                {/* <TouchableOpacity>
                  <Entypo name="mic" size={24} color="#9900FF" />
                </TouchableOpacity> */}
              </View>

              {/* send icon */}

              <TouchableOpacity className="pl-4" onPress={sendAMessage}>
                <FontAwesome name="send" size={24} color="#555" />
              </TouchableOpacity>
            </View>
          </>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default ChatScreen;
