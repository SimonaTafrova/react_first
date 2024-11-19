import { FlatList, Image, Text, View, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '../../components/SearchInput';
import Actions from '../../components/Actions';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts , signOut} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import { router } from "expo-router";




const Home = () => {
  const { data: posts, refetch, error } = useAppwrite(getAllPosts);
  
  const [refreshing, setRefreshing] = useState(false);
  const { user, setUser, setIsLogged} = useGlobalContext();
 
  
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);

    router.replace('/sign-in');
  };



 



 

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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
          />
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
          
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
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
            </View>
            <SearchInput />
            <View style={styles.actionsContainer}>
              <Text style={styles.chooseText}>What would you like to do? </Text>
              <Actions posts={[]} />
            </View>
          

          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No actions created yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

export default Home;
