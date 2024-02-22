import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/FontAwesome';

const UserInput = ({
  placeHolder,
  isPass,
  setStateValue,
  setGetEmailValidationStatus,
}) => {
  const [value, setValue] = useState("");
  const [icon, setIcon] = useState(null);
  const [showPass, setShowPass] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const handleTextChange = (text) => {
    setValue(text);
    setStateValue(text);

    if (placeHolder === "Email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const status = emailRegex.test(value);
      setIsEmailValid(status);
      setGetEmailValidationStatus(status);
    }
  };

  useLayoutEffect(() => {
    switch (placeHolder) {
      case "กรอกชื่อ-นามสกุล":
        return setIcon("person");
      case "อีเมล":
        return setIcon("email");
      case "รหัสนักศึกษา":
        return setIcon("assignment-ind")
      case "รหัสผ่าน":
        return setIcon("lock");
      case "ยืนยันรหัสผ่าน":
        return setIcon("lock");
    }
  }, []);

  return (
    <View
      className={`border  rounded-2xl px-4 py-6 flex-row items-center justify-between space-x-4 my-2 ${
        !isEmailValid && placeHolder === "Email" && value.length > 0
          ? "border-red-500"
          : "border-gray-200"
      }`}
    >
      <MaterialIcons name={icon} size={24} color={"#9900FF"} />
      <TextInput
        className="flex-1 text-base text-primaryText font-semibold -mt-1"
        placeholder={placeHolder}
        value={value}
        onChangeText={handleTextChange}
        autoCapitalize="none"
        secureTextEntry={isPass && showPass}
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Entypo
            name={`${showPass ? "eye" : "eye-with-line"}`}
            size={24}
            color={"#6c6d83"}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default UserInput;
