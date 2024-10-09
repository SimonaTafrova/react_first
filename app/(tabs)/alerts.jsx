import { StyleSheet, Text, View, RefreshControl, FlatList, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import useAppwrite from "../../lib/useAppwrite";
import { useState, useEffect } from 'react';
import React from 'react';
import { useGlobalContext } from "../../context/GlobalProvider";
import { getAllAlerts, getLastPrescription, getTypeOfPrescription, createAlert } from '../../lib/appwrite';
import { images } from '../../constants';

const Alerts = () => {
  const { data: posts, refetch, error } = useAppwrite(getAllAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser } = useGlobalContext();

  const alertTemplate = {
    sensorAlert: { id: '1', type: 'sensorAlert', message: 'You need to order CGM sensors!' },
    monthlyPrescriptionAlert: { id: '2', type: 'monthlyPrescriptionAlert', message: 'It is time to collect your new monthly prescription!' },
    quarterlyPrescriptionAlert: { id: '3', type: 'quarterlyPrescriptionAlert', message: 'You need to call your GP for a new 3-month prescription!' },
    protocolAlert: { id: '4', type: 'protocolAlert', message: 'It is time to call your endocrinologist regarding a new 6-month protocol!' }
  };

  const countOfSensors = user.sensors;

  // Function for handling sensor alert
  const runSensorAlert = async () => {
    if (countOfSensors <= 2) {
      try {
        console.log(posts)
        const existingAlert = posts.find(post => post.type === alertTemplate.sensorAlert.type);
        if (!existingAlert) {
          await createAlert(alertTemplate.sensorAlert.type, alertTemplate.sensorAlert.message);
        }
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  // Combined function for handling monthly, quarterly, and protocol alerts
  const runPrescriptionAlerts = async () => {
    try {
      const prescription = await getTypeOfPrescription('1');
      const quarterlyPrescription = await getTypeOfPrescription('2');
      const protocolPrescription = await getTypeOfPrescription('3');
      const currentDay = new Date();
      const lastDate = new Date(prescription[0].time);
      const quarterlyDate = new Date(quarterlyPrescription[0].time);
      const protocolDate = new Date(protocolPrescription[0].time);

      // Check for monthly prescription alert
      if (Math.floor((currentDay - lastDate) / (24 * 3600 * 1000)) >= 28) {
        const existingMonthlyAlert = posts.find(post => post.type === alertTemplate.monthlyPrescriptionAlert.type);
        if (!existingMonthlyAlert) {
          await createAlert(alertTemplate.monthlyPrescriptionAlert.type, alertTemplate.monthlyPrescriptionAlert.message);
        }
      }

      // Check for quarterly prescription alert
      if (Math.floor((currentDay - quarterlyDate) / (24 * 3600 * 1000)) >= 85) {
        const existingQuarterlyAlert = posts.find(post => post.type === alertTemplate.quarterlyPrescriptionAlert.type);
        if (!existingQuarterlyAlert) {
          await createAlert(alertTemplate.quarterlyPrescriptionAlert.type, alertTemplate.quarterlyPrescriptionAlert.message);
        }
      }

      // Check for protocol alert (6 months = ~182 days)
      if (Math.floor((currentDay - protocolDate) / (24 * 3600 * 1000)) >= 182) {
        const existingProtocolAlert = posts.find(post => post.type === alertTemplate.protocolAlert.type);
        if (!existingProtocolAlert) {
          await createAlert(alertTemplate.protocolAlert.type, alertTemplate.protocolAlert.message);
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
          <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3 flex-row justify-between items-center">
            <InfoBox
              textcontent={item.message}
              imagesource={images.insulin}
              containerStyles="mt-0"
              titleStyles="text-lg"
            />
            <TouchableOpacity onPress={() => handleDeleteAlert(item.$id)}>
              <Text style={{ color: 'red', fontSize: 20 }}>X</Text>
            </TouchableOpacity>
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
