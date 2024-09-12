import { Text, View, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';
import {getAllInsulinLogs} from '../../lib/appwrite'
import useAppwrite from "../../lib/useAppwrite";
import { useState } from 'react';
import { images } from '../../constants';

const Insulin = () => {
  
  const { data: posts, refetch, error } = useAppwrite(getAllInsulinLogs);
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
    let hour = formatElements(date.getHours());
    let minutes = date.getMinutes();
    if(date.getMinutes() < 10){
      minutes = `0${date.getMinutes()}`
    }
    return `${date.getHours()}:${minutes} - ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }


  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
       data={posts}
       keyExtractor={(item) => item.$id}
       renderItem={({ item }) => (
        <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3">
        <InfoBox
          textcontent={item.type == 1 ? `NovoRapid - ${item.units} units` : `Levemir - ${item.units} units`}
          
          date={formatTime(item.time)}
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
          <EmptyState title="No insertions created yet" />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Insulin;
