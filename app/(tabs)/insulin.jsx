import { Text, View, ScrollView, Image, Alert, FlatList, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState } from 'react'
import { images } from '../../constants'
import CustomButton from '../../components/CustomButton'
import FormField from '../../components/FormField'
import { Link, router } from 'expo-router'
import { signIn, getCurrentUser } from '../../lib/appwrite'
import { useGlobalContext } from "../../context/GlobalProvider"
import EmptyState from '../../components/EmptyState';


const Insulin = () => {
  
  const { user } = useGlobalContext();
  
  
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text>{item.$id}</Text>
      
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                {user?.username}
                </Text>
                <Text className="text-2xl font-psemibold text-secondary">
                  Here are your most recent insulin insertions
                </Text>
              </View>

             
            </View>
           
           
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No insertions created yet" />
        )}
       
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Primary background color
  },
  headerContainer: {
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  headerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingText: {
    color: '#fff',
    fontSize: 14,
  },
  usernameText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logo: {
    width: 36,
    height: 40,
  },
  actionsContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  chooseText: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default Insulin
