import { Text, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import {getLastFivePrescriptions} from '../../lib/appwrite'
import useAppwrite from "../../lib/useAppwrite";
import { useState } from 'react';
import { images } from '../../constants';
const Prescriptions = () => {
  
  const { data: posts, refetch, error } = useAppwrite(getLastFivePrescriptions);
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

  const formatTime = (time) => {
    let date = new Date(time);

    let dateToReturn = `${date.getDate()} / ${date.getMonth() + 1} / ${date.getFullYear()}`

    return dateToReturn;

  }



  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
       data={posts}
       keyExtractor={(item) => item.$id}
       renderItem={({ item }) => (
        <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3">
        <InfoBox
          textcontent={formatTime(item.time)}
          imagesource={images.prescription}
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
                  Here are the dates of your 5 or less most recent prescription collections
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
