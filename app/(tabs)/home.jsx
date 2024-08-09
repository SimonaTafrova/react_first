import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Actions from '../../components/Actions'
import EmptyState from '../../components/EmptyState'


const Home = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      data = {[{id:1, text: "Call GP"}, {id:2, text: "Collect Prescription"}, {id:3, text : "Buy CGM Sensord"}] ?? []}
      keyExtractor={(item) => item.$id}
      renderItem={({item}) => (
        <Text className = "text-3xl text-white">{item.text}</Text>
      )}
      ListHeaderComponent={() => (
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View className="">
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                Simona!
              </Text>

            </View>
            <View className="mt-1.5">
              <Image  
              source = {images.logoSmall}
              className="w-9 h-10"
              resizeMode='contain'/>

            </View>

          </View>
          <SearchInput />

          

          <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-gray-100 text-lg font-pregular mb-3 text-center">
              Choose what you want to update

            </Text>

            <Actions posts={[{id:1}, {id:2}, {id:3}] ?? []} />

          </View>

        </View>
        
      )}
      ListEmptyComponent={() => (
        <EmptyState
        title="No actions created yet"
        />
      )}
   
      />
    </SafeAreaView>
    
  )
}

export default Home

const styles = StyleSheet.create({})