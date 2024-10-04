import { StyleSheet, Text, View, RefreshControl, FlatList, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import useAppwrite from "../../lib/useAppwrite";
import { useState, useEffect } from 'react';
import React from 'react'
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllAlerts, updateAlert, getCurrentUser, getLastPrescription } from '../../lib/appwrite';
import { images } from '../../constants';

const Alerts = () => {
  const { data: posts, refetch, error } = useAppwrite(getAllAlerts);
 
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser } = useGlobalContext();
  
  


  const toDisplay = [];

  console.log(posts.length)

  for(let i=0; i < posts.length; i++){
    if(posts[i].isValid == 'true'){
    toDisplay.push(posts[i]);
    }
  }




  const countOfSensors = user.sensors;

 

  const runPrescriptionAlerts = async () => {
    
    try {
      const prescription = await getLastPrescription();
      const currentDay = new Date();
      const lastDate = new Date(prescription[0].time)
      if(Math.floor((currentDay-lastDate)/(24*3600*1000)) >= 28){
        try {
      
          await updateAlert('true','66f3ee8f003c88a7cc7f');
        
        } catch (error) {
          Alert.alert("Error", error.message);
        } 

      } else {
        try {
      
          await updateAlert('false','66f3ee8f003c88a7cc7f');
        
        } catch (error) {
          Alert.alert("Error", error.message);
        } 
      }
      
     
    } catch (error) {
     
    }

  }

  useEffect(() => {
    runPrescriptionAlerts(); 

   
    const interval = setInterval(() => {
      runPrescriptionAlerts(); 
    },  300000); 

  
    return () => clearInterval(interval);
  }, []);
  



  const runAlerts= async () => {
    if(countOfSensors <= 2){
      try {
      
          await updateAlert('true','66f3ee780028d6e85ebe');
        
        } catch (error) {
          Alert.alert("Error", error.message);
        } 
  
  } else {
    try {
     
      await updateAlert('false','66f3ee780028d6e85ebe');
    
      
    } catch (error) {
      Alert.alert("Error", error.message);
    } 
  }
  

  }

  runAlerts();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to refresh posts:', err);
    }
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
       data={toDisplay}
       keyExtractor={(item) => item.$id}
       renderItem={({ item }) => (
        <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3">
        <InfoBox
          textcontent={item.message}
          
      
          imagesource={images.insulin}
          containerStyles="mt-0"
          titleStyles="text-lg"
        />
        
      </View>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-medium text-xl text-gray-100">
                  {user?.username}
                </Text>
                <Text className="text-2xl font-semibold text-secondary">
                  Here are your 5 most recent insulin insertions
                </Text>
              </View>
            </View>
         
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="There are no active alerts at the moment!" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

export default Alerts

const styles = StyleSheet.create({})