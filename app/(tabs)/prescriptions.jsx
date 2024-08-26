import { Text, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import {getAllPrescriptions} from '../../lib/appwrite'
import useAppwrite from "../../lib/useAppwrite";
import { useState } from 'react';

const Prescriptions = () => {
  
  const { data: posts, refetch, error } = useAppwrite(getAllPrescriptions);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useGlobalContext();

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
       data={posts}
       keyExtractor={(item) => item.$id}
       renderItem={({ item }) => (
        <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3">
        <InfoBox
          date={item.date}
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
                  Here are your most recent prescription collections
                </Text>
              </View>
            </View>
         
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No prescription collections created yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Prescriptions;
