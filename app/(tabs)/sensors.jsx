import { ScrollView, StyleSheet, Text, View, Alert } from 'react-native'
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
import { setSensorsCount, getCurrentUser } from '../../lib/appwrite';


const Sensors = () => {
  const { user, setUser, setSensorAlerts} = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    sensors: '',
  })
  const submit = async () => {
    if(!form.sensors){ 
      Alert.alert('Error', 'Please fill in all the fields')
    }

    setIsSubmitting(true);

    try {
      await setSensorsCount(form);
       const result = await getCurrentUser();
      setUser(result);
      if(form.sensors <= 2){
        setSensorAlerts(true)
      } else {
        setSensorAlerts(false)
      }
      Alert.alert("Success", "Sensor count recorded successfully");
    } catch (error) {
      Alert.alert('Error', error.message)
      
    } finally {
      setForm({ sensors : '' });
      setIsSubmitting(false);
    }

  }

  


  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
      <View className="w-full justify-center min-h-[85vh] px-4 my-6">
 
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold"> Please select the amount of sensors you currently own</Text>
          
          <FormField
            title="Sensors"
            value= {form.sensors}
            handleChangeText = {(e) => setForm({ ...form,
              sensors: e
            })}
            otherStyles="mt-7"
            
          />

            <CustomButton
            title="Submit"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting} />
                <Image source={images.sensor} resizeMode='contain' className="w-[715px] h-[175px] "/>
                <Text className="text-xl text-white text-semibold mt-10 font-psemibold"> You currently have the following amount of sensors available: {user.sensors}</Text>

          
          </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Sensors;