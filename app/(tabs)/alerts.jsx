import { StyleSheet, Text, View, RefreshControl, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import useAppwrite from "../../lib/useAppwrite";
import { useState, useEffect } from 'react';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllAlerts, createAlert, searchAlerts, getTypeOfPrescription, deleteAlert } from '../../lib/appwrite';
import { images } from '../../constants';
import { alertTemplates } from '../../lib/tools'

const Alerts = () => {
  const { data: posts, refetch, error } = useAppwrite(getAllAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();

  const alertTemplate = alertTemplates;


  const countOfSensors = user.sensors;
  const [isCreatingAlert, setIsCreatingAlert] = useState(false); // Track alert creation status

  const formatTime = (time) => {
    let date = new Date(time);

    let dateToReturn = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`

    return dateToReturn;

  }


  // Helper function to check if an alert already exists in the database
  const doesAlertExist = async (alertType) => {
    const existingAlert = await searchAlerts(alertType);
    return existingAlert.length > 0;
  };

  // Debounced function to create an alert
  const createAlertDebounced = async (type, message) => {
    if (isCreatingAlert) return; // Prevent concurrent alert creations

    setIsCreatingAlert(true);
    try {
      const exists = await doesAlertExist(type);
      if (!exists) {
        await createAlert(type, message, user.$id, new Date());
        setIsCreatingAlert(false);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
      setIsCreatingAlert(false);
    }
  };

  // Function to handle sensor alerts
  const runSensorAlert = async () => {
    if (countOfSensors <= 2) {
      await createAlertDebounced(alertTemplate.sensorAlert.type, alertTemplate.sensorAlert.message);
    }
  };

  // Function to handle prescription alerts
  const runPrescriptionAlerts = async () => {
    try {
      const [monthlyPrescription, quarterlyPrescription, protocolPrescription] = await Promise.all([
        getTypeOfPrescription('1'),
        getTypeOfPrescription('2'),
        getTypeOfPrescription('3')
      ]);

      const currentDay = new Date();

      // Monthly prescription check
      if (monthlyPrescription[0]) {
        const lastDate = new Date(monthlyPrescription[0].time);
        if (Math.floor((currentDay - lastDate) / (24 * 3600 * 1000)) >= 28) {
          await createAlertDebounced(alertTemplate.monthlyPrescriptionAlert.type, alertTemplate.monthlyPrescriptionAlert.message);
        }
      }

      // Quarterly prescription check
      if (quarterlyPrescription[0]) {
        const quarterlyDate = new Date(quarterlyPrescription[0].time);
        if (Math.floor((currentDay - quarterlyDate) / (24 * 3600 * 1000)) >=85) {
          await createAlertDebounced(alertTemplate.quarterlyPrescriptionAlert.type, alertTemplate.quarterlyPrescriptionAlert.message);
        }
      }

      // Protocol prescription check
      if (protocolPrescription[0]) {
        const protocolDate = new Date(protocolPrescription[0].time);
        if (Math.floor((currentDay - protocolDate) / (24 * 3600 * 1000)) >= 182) {
          await createAlertDebounced(alertTemplate.protocolAlert.type, alertTemplate.protocolAlert.message);
        }
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    const runAllAlerts = async () => {
      await runSensorAlert();
      await runPrescriptionAlerts();
    
    };

    runAllAlerts();
    const interval = setInterval(runAllAlerts, 300000); // Repeat every 5 minutes

    return () => clearInterval(interval);
  }, [countOfSensors, posts]);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (err) {
      console.error('Failed to refresh posts:', err);
    }
    setRefreshing(false);
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await deleteAlert(alertId);
      await refetch(); // Refresh the list after deletion
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={posts} // Display all alerts directly without filtering
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-4 flex-row justify-between items-center">
            <InfoBox
              textcontent={item.message}
              imagesource={images.insulin}
              date={formatTime(item.time)}
              containerStyles="mt-0"
              titleStyles="text-lg"
            />
          
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-medium text-xl text-gray-100">{user?.username}</Text>
                <Text className="text-2xl font-semibold text-secondary">Here is a list of your active alerts</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => <EmptyState title="There are no active alerts at the moment!" />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  );
};

export default Alerts;

const styles = StyleSheet.create({});
