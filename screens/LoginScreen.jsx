import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { BGImage, Logo } from "../assets";
import { UserInput } from "../components";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth,  firebaseauth,  firestoreDB, firestoredb, } from "../config/firebase.config";
import { doc, getDoc } from "firebase/firestore";
import { SET_USER } from "../context/actions/userActions";
import { useDispatch } from "react-redux";

const LoginScreen = () => {
  const screenWidth = Math.round(Dimensions.get("window").width);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [getEmailValidationStatus, setGetEmailValidationStatus] =
    useState(false);
  const [alert, setAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState(null);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (true && email !== "") {
      await signInWithEmailAndPassword(firebaseauth, email, password)
        .then((userCred) => {
          if (userCred) {
            console.log("Logged User Id:", userCred.user.uid);
            getDoc(doc(firestoredb, "users", userCred.user.uid)).then(
              (docSnap) => {
                if (docSnap.exists()) {
                  console.log("User Data : ", docSnap.data());
                  dispatch(SET_USER(docSnap.data()));
                }
              }
            );
          }
        })
        .catch((err) => {
          console.log("Error : ", err.message);
          if (err.message.includes("wrong-password")) {
            setAlert(true);
            setAlertMsg("Invalid Password");
          } else if (err.message.includes("user-not-found")) {
            setAlert(true);
            setAlertMsg("User not found");
          } else {
            setAlert(true);
            setAlertMsg("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }
          setInterval(() => {
            setAlert(false);
          }, 5000);
        });
    }
  };

  return (
    <View className="flex-1 items-center justify-start">
      <Image
        source={BGImage}
        className="h-96"
        style={{ width: screenWidth }}
        resizeMode="cover"
      />

      {/* main view */}
      <View className="w-full h-full bg-white rounded-tl-[90px] items-center justify-start py-6 px-6 space-y-6 -mt-44">
        {/* logo */}
        <Image source={Logo} className="w-16 h-16" resizeMode="contain" />

        <Text className="py-2 text-primaryText text-xl font-semibold">
          ยินดีต้อนรับ !
        </Text>

        {/* Content Section */}
        <View className="w-full items-center justify-center">
          {/* alert */}
          {alert && <Text className="text-base text-red-600">{alertMsg}</Text>}
          {/* email */}
          <UserInput
            placeHolder={"อีเมล"}
            isPass={false}
            setStateValue={setEmail}
            setGetEmailValidationStatus={setGetEmailValidationStatus}
          />
          {/* password */}
          <UserInput
            placeHolder={"รหัสผ่าน"}
            isPass={true}
            setStateValue={setPassword}
          />

          {/* login button */}
          <TouchableOpacity
            onPress={handleLogin}
            className="w-60 px-4 py-2 rounded-xl bg-purple-500 my-3 flex items-center justify-center"
          >
            <Text className="py-2 text-white text-xl font-semibold">
              ล็อกอิน
            </Text>
          </TouchableOpacity>

          {/* register */}

          <View className="w-full py-12 flex-row items-center justify-center space-x-2">
            <Text className="text-base text-primaryText">
              ยังไม่มีบัญชี?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SingUpScreen")}
            >
              <Text className="text-base font-semibold text-purple-500">
              สร้างที่นี่
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
