import { ScrollView, Text, View, Alert } from 'react-native'
import { React, useState } from 'react'

import { SafeAreaView } from "react-native-safe-area-context";
import { Image,  } from "react-native";

import { images } from "../../constants";


import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { setSensorsCount, getCurrentUser, deleteAlert, getAllAlerts, searchAlerts, createAlert } from '../../lib/appwrite';
import { alertTemplates } from '../../lib/tools';




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
       const existing = await searchAlerts(alertTemplates.sensorAlert.type)
      setUser(result);
      if(form.sensors <= 2){
        setSensorAlerts(true)
        if(existing.length === 0){
          console.log(user.$id)
          await createAlert(alertTemplates.sensorAlert.type,alertTemplates.sensorAlert.message, user.$id, new Date())
        }
      } else {
        setSensorAlerts(false)
        
        if(existing.length > 0){
          await deleteAlert(existing[0].$id);
        }
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