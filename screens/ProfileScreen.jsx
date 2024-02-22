import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StatusBar,
  Modal,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { firebaseAuth, firebaseauth, firestoredb } from "../config/firebase.config";
import { SET_USER_NULL } from "../context/actions/userActions";
import { doc, updateDoc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import MessageBox from "../components/msg";


const ProfileScreen = () => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  

  const handleLogout = async () => {
    await firebaseauth.signOut().then(() => {
      dispatch(SET_USER_NULL());
      navigation.replace("LoginScreen");
    });
  };

  const [editname, seteditname] = useState('')
  const [edit,setedit] = useState(false)
  const [password, setpassword] = useState('')

  let ผู้ใช้ปัจจุบัน = firebaseauth.currentUser //เพื่อเข้าถึงข้อมูลผู้ใช้ปัจจุบัน 
  useFocusEffect(
    React.useCallback(() => {
      database()
    }, [])
  );
  const confirm = async () => {
    const userRef = doc(firestoredb, "users", ผู้ใช้ปัจจุบัน.uid);
    

    if(editname !== '' ){ // แก้ไขแค่ชื่อจะทำการอัปเดตเฉพาะชื่อโดยใช้ค่าเบอร์โทรศัพท์ปัจจุบันที่อยู่ในโปรไฟล์
      await updateDoc(userRef, {
        "fullName": editname,
      });
    } 
    
    else if (editname === "" ) {
    
      return
    } else if  (editname === '' ) {
      await updateDoc(userRef, {
        "fullName": user?.fullName,
      });
      
      
    }else if (editname === '' ){
      MessageBox.Alert('แจ้งเตือน', 'แก้ไขข้อมูลสำเร็จ')
      return
    }
    else {
      await updateDoc(userRef, { //อัปเดตข้อมูลแก้ไขโปรไฟล์ตามเงื่อนไขข้างบน
        "fullName": editname,
    
      });
    }
    let msg = await MessageBox.Alert('แจ้งเตือน','แก้ไขข้อมูลสำเร็จ')
    if(msg){
      setedit(false)
    }

  }

  const database = async () => {
    const docRef = firestoredb.collection('users').doc(ผู้ใช้ปัจจุบัน.uid)
    docRef.onSnapshot((doc) => {
      if (doc.exists) {
        console.log('เช็คข้อมูลหน้าโปรไฟล์', doc.data());
        setprofile(doc.data())

      }
    })
  }


  

  const closeEdit = () => { //ยกเลิกการแก้ไข
    setedit(false)
    seteditname('')
  };


  // const modal = () => {
  //   return (
  //     <>
  //       <View>
  //         <Modal
  //           animationType="fade"
  //           transparent={true}
  //           visible={edit}>
  //           <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: 'rgba(0,0,0,0.5)' }}>
  //             <View style={{
  //               backgroundColor: 'white',
  //               width: 390,
  //               height: 534,
  //               borderRadius: 30,
  //             }}>
  //               <TouchableOpacity style={{ position: 'absolute', right: 26, top: 31 }} onPress={() => closeEdit()}>
                  
  //               </TouchableOpacity>
  //               <View style={{ marginTop: 45, alignSelf: "center" }}>
  //                 <Text style={{ fontSize: 18, color: '#504F57' }}>แก้ไขโปรไฟล์</Text>
  //               </View>
                
  //               <View style={{ marginTop: 19, paddingHorizontal: 18 }}>
  //                 <Text>ชื่อ-นามสกุล</Text>
  //                 <View style={{ paddingLeft: 15, flexDirection: "row", borderRadius: 10, marginTop: 6, borderWidth: 1, borderColor: '#CCCCCC', alignItems: 'center' }}>
                  
  //                   <TextInput style={{ width: '90%', paddingLeft: 11, height: 40 }}
  //                     onChangeText={(text) => seteditname(text)}
                      
  //                   >
                     
  //                    {( editname === '')?user?.fullName:editname}
                  
                     
  //                   </TextInput>
  //                 </View>

  //                 <Text style={{ marginTop: 10 }}>Email</Text>
  //                 <View style={{ paddingVertical: 10, paddingLeft: 15, flexDirection: "row", borderRadius: 10, marginTop: 6, borderWidth: 1, borderColor: '#CCCCCC' }}>
  //                   <Text style={{ marginLeft: 11, color: 'gray' }}>{user?.providerData.email}</Text>
  //                 </View>

  //                 <Text style={{ marginTop: 10 }}> รหัสผ่าน </Text>
  //                 <View style={{ paddingLeft: 15, flexDirection: "row", borderRadius: 10, marginTop: 6, borderWidth: 1, borderColor: '#CCCCCC', alignItems: 'center' }}>
                   
  //                   <Text style={{ marginLeft: 11 }}>{user?.password}</Text>
  //                   <TextInput
  //                    style={{ width: '90%', paddingLeft: 11, height: 40 }}
  //                     onChangeText={(text) => setpassword(text)}
  //                     secureTextEntry={true}
  //                   >
  //                   </TextInput>
  //                 </View>
  //                 <TouchableOpacity onPress={() => confirm()} style={{ backgroundColor: '#18075B', borderRadius: 20, marginTop: 50, alignItems: 'center', paddingVertical: 12 }}>
  //                   <Text style={{ color: 'white' }}>
  //                     ยืนยัน
  //                   </Text>
  //                 </TouchableOpacity>

  //               </View>
  //             </View>
  //           </View>
  //         </Modal>
  //       </View>
  //     </>
  //   )
  // }

  return (
    <SafeAreaView>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      {/* icons */}
      <View className="w-full flex-row items-center justify-between px-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="chevron-left" size={36} color={"#555"} />
        </TouchableOpacity>

      {/* {modal()} */}
      </View>
      {/* profile */}
      <View className="items-center justify-center">
        <View className="relative border-2 border-purple-500 p-1 rounded-full">
          <Image
            source={{ uri: user?.profilePic }}
            className="w-24 h-24"
            resizeMode="contain"
          />
        </View>

        <Text className="text-xl font-semibold text-purple-500 pt-3">
        {user?.fullName}
        </Text>
        <Text className="text-base font-semibold text-primaryText">
          {/* {user?.providerData.email} */}
        </Text>
      </View>

      {/* icons sections */}
      <View className="w-full flex-row items-center justify-evenly py-6">
        {/* <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <MaterialIcons name="messenger-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Message</Text>
        </View> */}

        {/* <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Ionicons name="ios-videocam-outline" size={24} color="#555" />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Video Call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Ionicons name="call-outline" size={24} color={"#555"} />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">Call</Text>
        </View>

        <View className="items-center justify-center">
          <TouchableOpacity className="items-center justify-center w-12 h-12 rounded-lg bg-gray-300">
            <Entypo name="dots-three-horizontal" size={24} color="#555" />
          </TouchableOpacity>
          <Text className="text-sm text-primaryText py-1">More</Text>
        </View> */}
      </View>

      {/* medias shared */}

      <View className="w-full px-6 space-y-3">
        {/* <View className="w-full flex-row items-center justify-between">
          <Text className="text-base font-semibold text-primaryText">
            Media Shared
          </Text>

          <TouchableOpacity>
            <Text className="text-base font-semibold uppercase text-primaryText ">
              View All
            </Text>
          </TouchableOpacity>
        </View> */}

        <View className="w-full flex-row items-center justify-between">

          <View className="absolute w-full h-full items-center justify-center bg-[#00000068]">
            <Text className="text-base text-white font-semibold">250+</Text>
          </View>
        </View>
      </View>

      {/* settings options */}
      <View className="w-full px-6 py-4 flex-row items-center justify-between">
        {/* <TouchableOpacity onPress={() => setedit()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}> */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="mail" size={24} color={"#212F3D"} />
            <Text className="text-base font-semibold  text-primaryText text-gray-900 px-3">
              E-mail
            </Text>
          </View>
          <View>
          <Text className="text-base font-semibold text-primaryText text-gray-500">
          {user?.providerData.email}
        </Text>
          </View>
          {/* <MaterialIcons name="chevron-right" size={32} color={"#555"} /> */}
        {/* </TouchableOpacity> */}
      </View>
      
      <View className="w-full px-6 py-4 flex-row items-center justify-between">
        {/* <TouchableOpacity onPress={() => setedit()} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}> */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <MaterialIcons name="assignment-ind" size={24} color={"#212F3D"} />
            <Text className="text-base font-semibold  text-primaryText text-gray-900 px-3">
              Student ID
            </Text>
          </View>
          <View>
          <Text className="text-base font-semibold text-primaryText text-gray-500">
          {user?.studentID}
        </Text>
        
          </View>
          
          {/* <MaterialIcons name="chevron-right" size={32} color={"#555"} /> */}
        {/* </TouchableOpacity> */}
      </View>


      {/* logout */}
      <View className="w-full h-full items-center ">
        <TouchableOpacity
          onPress={handleLogout}
          className="w-20 top-60 flex-row items-center justify-center"
        >
          <Text className="text-lg font-semibold text-red-500 ">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
