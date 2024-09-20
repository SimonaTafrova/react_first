import { FlatList, Image, Text, View, RefreshControl, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../../constants';
import SearchInput from '../../components/SearchInput';
import Actions from '../../components/Actions';
import EmptyState from '../../components/EmptyState';
import VideoCard from '../../components/VideoCard';
import useAppwrite from "../../lib/useAppwrite";
import { getAllPosts , getLastPrescription} from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { run } from '../../lib/alertControler';

const Home = () => {
  const { data: posts, refetch, error } = useAppwrite(getAllPosts);
  
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();
  run();


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
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10 rounded-md border-2 border-secondary"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View style={styles.actionsContainer}>
              <Text style={styles.chooseText}>Choose what you want to update</Text>
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
