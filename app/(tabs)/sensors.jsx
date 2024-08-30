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
      <View className="w-full justify-center min-h-[85vh] px-4 my-6">
 
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold"> Please select the amount of sensors you currently own</Text>
          
          <FormField
            title="Sensors"
            value= {form.sensors}
            handleChangeText = {(e) => setform({ ...form,
              sensors: e
            })}
            otherStyles="mt-7"
            
          />


          </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Sensors;