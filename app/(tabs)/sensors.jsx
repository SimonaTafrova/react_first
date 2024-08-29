import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, getAllPrescriptions } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";


const Sensors = () => {
  const { user} = useGlobalContext();

  


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      
    </ScrollView>
    </SafeAreaView>
  );
};

export default Sensors;