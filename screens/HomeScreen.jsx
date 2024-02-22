import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StatusBar,
  TextInput,
  Modal,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Logo } from "../assets";
import { warning } from "../assets";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestoreDB, firestoredb } from "../config/firebase.config";
import { deleteDoc } from "firebase/firestore";
import { doc } from "firebase/firestore";

const HomeScreen = () => {
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(true);
  const [chats, setChats] = useState(null);
  const [searchText, setSearchText] = useState("");
  let deletechatData = [];

  const navigation = useNavigation();

  useLayoutEffect(() => {
    const chatQuery = query(
      collection(firestoredb, "chats"),

      orderBy("_id", "desc")
    );

    const unsubscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chatRooms = querySnapShot.docs.map((doc) => doc.data());
      setChats(chatRooms);
      setIsLoading(false);
      deletechatData = chatRooms;
      console.log(deletechatData);

      startAutoDelete();
    });

    return unsubscribe;
  }, []);
  // Search function
  const searchChats = (text) => {
    setSearchText(text);
    if (!text.trim()) {
      // ถ้า text เป็นค่าว่าง ให้กำหนดค่า chats กลับมาเป็นข้อมูลเริ่มต้น
      setChats(null); // ลบข้อมูลที่ถูกกรองไว้
      setIsLoading(true); // เซ็ตให้โหลดข้อมูลอีกครั้ง
      const chatQuery = query(
        collection(firestoredb, "chats"),
        orderBy("_id", "desc")
      );

      onSnapshot(chatQuery, (querySnapShot) => {
        const chatRooms = querySnapShot.docs.map((doc) => doc.data());
        setChats(chatRooms);
        setIsLoading(false);
      });
    } else {
      // ถ้า text ไม่เป็นค่าว่าง
      const filteredChats = chats.filter((chat) =>
        chat.chatName.toLowerCase().includes(text.toLowerCase())
      );
      setChats(filteredChats);
    }
  };
  // ฟังก์ชันเพื่อลบข้อมูล
  const deleteData = (_id) => {
    deleteDoc(doc(firestoredb, "chats", _id))
      .then(() => {
        console.log("ลบข้อมูลอัตโนมัติ");
      })
      .catch((error) => {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
      });
  };

  const startAutoDelete = () => {
    let hasActivity = true; // ตั้งค่าเริ่มต้นว่าไม่มีการเคลื่อนไหว
    const currentDate = new Date().getTime();
  
    deletechatData.forEach((chatData) => {
      const createdDate = new Date(chatData.createdAt).getTime();
      const timeDiff = currentDate - createdDate; // หาความแตกต่างของเวลา (มิลลิวินาที)
  
      // ตรวจสอบว่าอยู่ในระยะเวลา 7 วันหรือไม่
      if (timeDiff < 7 * 24 * 60 * 60 * 1000) {
        hasActivity = true; // มีการเคลื่อนไหว
      }
    });
  
    // ถ้าไม่มีการเคลื่อนไหวหลังจาก 7 วัน ให้ลบข้อมูลทั้งหมด
    if (!hasActivity) {
      deletechatData.forEach((chatData) => {
        deleteData(chatData._id);
        console.log("ลบข้อมูล ID:", chatData._id);
      });
    }
  };

  startAutoDelete();

  /////////////// Modal /////////////////
  const [modal, setModal] = useState(false)
  const gomodal = () => { //ยกเลิกการแก้ไข
  setModal(true)
}
  const closemodal = () => { //ยกเลิกการแก้ไข
  setModal(false)
  navigation.navigate('AddToChat')
}
const openModal = () => {
  return (
    <>
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modal}
        >
          <View onPress={() => setModal(false)} style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", alignItems: "center", justifyContent: "center" }}>
            <View disabled={false} style={{
              width: 313,
              height: 500,
              backgroundColor: "#ffff",
              alignItems: "center",
              // justifyContent:"center", 
              position: "absolute",
              borderRadius: 24
            }}>

              <View style={{ marginTop: 23, alignItems: "center" }}>
                
                <View style={{ position: "absolute", marginTop: 15, marginLeft: 40 }}>

                </View>
              </View>

              <Image source={warning} className="w-20 h-20" resizeMode="contain" />

              <Text style={{ fontSize:18 ,marginTop: 23 , fontWeight:'bold' }}
                >ข้อตกลงการใช้งานกระทู้</Text>

              <View style={{ alignItems: 'flex-start, justify-between' }}>
                
                <Text style={{ fontSize:16 ,marginTop: 15 , fontWeight:'normal' }}
                >1. ใช้ถ้อยคำที่สุภาพไม่ว่ากล่าวหรือเสียดสี
                </Text>
                <Text style={{ fontSize:16 ,marginTop: 10 , fontWeight:'normal' }}
                >2. เคารพสิทธิและเสรีภาพของผู้อื่น
                </Text>
                <Text style={{ fontSize:16 ,marginTop: 10 , fontWeight:'normal' }}
                >3. ไม่กระทำการปลุกปั่นหรือทำให้ผู้อื่นเสียหาย
                </Text>
                <Text style={{ fontSize:16 ,marginTop: 10 , fontWeight:'normal' }}
                >4. เมื่อทำการตั้งกระทู้แล้ว กระทู้นั้นจะมีอายุการใช้งาน 7 วันหากระยะเวลาเกิน 7 วันไปแล้วไม่มีการเคลื่อนไหวในกระทู้ระบบจะทำการลบโดยอัตโนมัติ
                </Text>
              </View>


              <View style={{ flexDirection: "row", marginTop: 100 }}>
                <TouchableOpacity
                  onPress={() => closemodal()}>

                  <View style={{ width: 108, height: 43, backgroundColor: "#AB88C9", borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#ffff" }}>ยอมรับ</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setModal(false)}>
                  <View style={{ width: 108, height: 43, borderColor: "#AB88C9", marginLeft: 19, borderWidth: 2, borderRadius: 30, alignItems: "center", justifyContent: "center" }}>
                    <Text style={{ color: "#AB88C9" }}>ยกเลิก</Text>
                  </View>
                </TouchableOpacity>

              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  )
}

  return (
    <View className="flex-1">
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <SafeAreaView>
        {openModal()}
        <View className="w-full flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("HomeScreen", { key: Math.random() })
            }
          >
            <Image source={Logo} className="w-12 h-12" resizeMode="contain" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("ProfileScreen")}
            className="w-12 h-12 rounded-full border border-purple-500 flex items-center justify-center"
          >
            <Image
              source={{ uri: user?.profilePic }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* Search Input */}
        <TextInput
          style={{
            width: "95%",
            height: 40,
            borderColor: "gray",
            marginLeft: 10,
            borderWidth: 1,
            paddingHorizontal: 10,
            marginTop: 10,
            borderRadius:10
          }}
          onChangeText={searchChats}
          value={searchText}
          placeholder=" หาสิ่งที่คุณสนใจ . . . "
          placeholderTextColor="#999"
        />

        {/* add to chat */}
        <ScrollView className="w-full px-4 pt-4">
          <View className="w-full">
            {/* message title and add */}
            <View className="w-full flex-row items-center justify-between px-2">
              <Text className="text-primaryText text-base font-extrabold pb-2">
                Message
              </Text>

              <TouchableOpacity
                onPress={() => gomodal()}
              >
                <Ionicons name="chatbox" size={28} color="#555" />
              </TouchableOpacity>
            </View>

            {/* chat room card */}
            {isLoading ? (
              <>
                <View className="w-full flex items-center justify-center">
                  <ActivityIndicator size={"large"} color={"#43C651"} />
                </View>
              </>
            ) : (
              <>
                {chats && chats.length > 0 ? (
                  <>
                    {chats.map((room) => (
                      <MessageCard key={room._id} room={room} />
                    ))}
                  </>
                ) : (
                  <Text>ไม่มีรายการข้อมูล</Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const MessageCard = ({ room }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ChatScreen", { room: room })}
      className="w-full flex-row items-center justify-start py-2"
    >
      {/* images */}
      <View className="w-16 h-16 rounded-full flex items-center border-2 border-purple-500 p-1 justify-center">
        <FontAwesome5 name="users" size={24} color="#555" />
      </View>
      {/* title */}
      <View className="flex-1 flex items-start justify-center ml-4">
        <Text className="text-[#333] text-base font-semibold capitalize">
          {room.chatName}
        </Text>
        {/* <Text className="text-primaryText text-sm">
          ddddd
        </Text> */}
      </View>

      {/* timestamp */}

      <Text style={{ fontSize: 12, fontWeight: "bold", color: "#AA63B0" }}>
        {" "}
        {room.createdDate}{" "}
      </Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;