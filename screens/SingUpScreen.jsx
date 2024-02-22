import {
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView } from "expo-blur";
import { avatars } from "../utils/supports";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth, firebaseauth, firestoreDB, firestoredb, } from "../config/firebase.config";
import { doc, setDoc } from "firebase/firestore";

const SingUpScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);
  const screenHeight = Math.round(Dimensions.get("window").height);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [stdID, setstdID] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [isAvatarMenu, setIsAvatarMenu] = useState(false);
  const [avatar, setAvatar] = useState(avatars[0]?.image.asset.url);
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);

  const navigation = useNavigation();

  const handleAvatar = (item) => {
    setAvatar(item.image.asset.url);
    setIsAvatarMenu(false);
  };

  const checkEmail = () => {
  if (email.trim() === "") {
    Alert.alert("กรุณากรอกอีเมลล์");
  } else if (!email.includes("@rmutp.ac.th")) {
    Alert.alert("กรุณาตรวจสอบอีเมลให้ถูกต้อง", "ควรใช้ @rmutp.ac.th");
  } else if (name.trim() === "") {
    Alert.alert("กรุณากรอกชื่อ-นามสกุล");
  } else if (password.trim() === "") {
    Alert.alert("กรุณากรอกพาสเวิร์ด");
  } else if (password.length <= 6) {
    Alert.alert("ความยาวของพาสเวิร์ดต้องมากกว่า 6 ตัวอักษร");
  } else if (!/^\d{12}-\d$/.test(stdID)) {
    Alert.alert("รหัสนักศึกษาไม่ถูกต้อง", "รูปแบบเลขที่ถูกต้องคือ xxxxxxxxxxxx-x");
  } else if (password === confirmpassword) {
    console.log("สมัครสมาชิกสำเร็จ");
    handleSignUp();
  } else {
    Alert.alert('Error Password', 'รหัสผ่านไม่ตรงกัน');
  }
}

  

  const handleSignUp = async () => {
    if (true && email !== "") {
      await createUserWithEmailAndPassword(firebaseauth, email, password).then(
        (userCred) => {
          console.log("User Id : ", userCred.user.uid);
          const data = {
            _id: userCred.user.uid,
            fullName: name,
            studentID: stdID,
            profilePic: avatar,
            password: password,
            
            providerData: userCred.user.providerData[0],
          };

          setDoc(doc(firestoredb, "users", userCred.user.uid), data).then(
            () => {
              navigation.navigate("LoginScreen");
            }
          );
        }
      );
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <ScrollView>
        <Image
          source={BGImage}
          className="h-96"
          style={{ width: screenWidth }}
          resizeMode="cover"
        />

        {isAvatarMenu && (
          <>
            {/* avatar list section */}
            <View
              className="absolute inset-0 z-10 "
              style={{ width: screenWidth, height: screenHeight }}
            >
              <ScrollView>
                <BlurView
                  className="px-4 py-16 flex-row flex-wrap items-center justify-evenly"
                  tint="light"
                  intensity={40}
                  style={{ width: screenWidth, height: screenHeight }}
                >
                  {avatars?.map((item) => (
                    <TouchableOpacity
                      onPress={() => handleAvatar(item)}
                      className="w-20 m-3 h-20 p-1 rounded-full border-2 border-purple-500 relative"
                      key={item._id}
                    >
                      <Image
                        source={{
                          uri: item?.image.asset.url,
                        }}
                        className="w-full h-full"
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  ))}
                </BlurView>
              </ScrollView>
            </View>
          </>
        )}

        {/* main view */}
        <View className="w-full h-full bg-white rounded-tl-[90px] items-center justify-start py-6 px-6 space-y-6 -mt-44">
          {/* logo */}
          <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

          {/* <Text className="py-2 text-primaryText text-xl font-semibold">
          Register
        </Text> */}

          {/* avatar Section */}
          <View>
            <TouchableOpacity
              onPress={() => setIsAvatarMenu(true)}
              className="w-20 h-20 rounded-full p-1 border-2 border-purple-500 relative"
            >
              <Image
                source={{
                  uri: avatar,
                }}
                className="w-full h-full"
                resizeMode="contain"
              />
              <View className="w-6 h-6 bg-purple-500 rounded-full absolute top-0 right-0 items-center justify-center">
                <MaterialIcons name="edit" size={18} color={"#fff"} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Content Section */}
          <View className="w-full items-center justify-center">
            {/* alert */}

            {/* Full name */}
            <UserInput
              placeHolder={"กรอกชื่อ-นามสกุล"}
              isPass={false}
              setStateValue={setName}
            />

            {/* email */}
            <UserInput
              placeHolder={"อีเมล"}
              isPass={false}
              setStateValue={setEmail}
              setGetEmailValidationStatus={setGetEmailValidationStatus}
            />

            {/* stdID */}
            <UserInput
              placeHolder={"รหัสนักศึกษา"}
              isPass={false}
              setStateValue={setstdID}

            />

            {/* password */}
            <UserInput
              placeHolder={"รหัสผ่าน"}
              isPass={true}
              setStateValue={setPassword}
            />
            {/* Confirm password */}
            <UserInput
            
              placeHolder={"ยืนยันรหัสผ่าน"}
              isPass={true}
              setStateValue={setConfirmPassword}
            />

            {/* login button */}
            <TouchableOpacity
              onPress={checkEmail}
              className="w-full px-4 py-2 rounded-xl bg-purple-500 my-3 flex items-center justify-center"
            >
              <Text className="py-2 text-white text-xl font-semibold">
                สมัคร
              </Text>
            </TouchableOpacity>

            {/* register */}

            <View className="w-full flex-row items-center justify-center space-x-2">
              <Text className="text-base text-primaryText">มีบัญชีอยู่เเล้ว!</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("LoginScreen")}
              >
                <Text className="text-base font-semibold text-purple-500">
                  ล็อกอิน
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SingUpScreen;
