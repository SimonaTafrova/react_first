import { Text, View, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from "../../context/GlobalProvider";
import EmptyState from '../../components/EmptyState';
import InfoBox from '../../components/InfoBox';

const Insulin = () => {
  const { user } = useGlobalContext();

  const type = "Novorapid";
  const units = "2";
  const date = "11.12.2024";

  return (
    <SafeAreaView className="flex-1 bg-black">
      <FlatList
        data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Text>{item.$id}</Text>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="flex flex-row justify-between items-start mb-6">
              <View>
                <Text className="font-medium text-sm text-gray-100">
                  {user?.username}
                </Text>
                <Text className="text-2xl font-semibold text-white">
                  Here are your most recent insulin insertions
                </Text>
              </View>
            </View>
            <View>
            <View className="bg-secondary-200 mt-2 mb-2 rounded-xl min-h-[62px] p-3">
              <InfoBox
                type={type}
                units={units}
                date={date}
                containerStyles="mt-0"
                titleStyles="text-lg"
              />
              
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

export default Insulin;
