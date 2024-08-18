import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, getAllPrescriptions } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";


const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();

  

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <View className="w-full flex justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity
              onPress= {logout}
              className="flex w-full items-end mb-10"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>
           
     </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;