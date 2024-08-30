import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { React, useState } from 'react'

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, TouchableOpacity } from "react-native";

import { images } from "../../constants";
import useAppwrite from "../../lib/useAppwrite";
import { getUserPosts, signOut, getAllPrescriptions } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';


const Sensors = () => {
  const { user} = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setform] = useState({
    sensors: '',
  })
  const submit = () => {}

  


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      
    </ScrollView>
    </SafeAreaView>
  );
};

export default Sensors;