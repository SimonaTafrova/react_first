import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { images } from '../constants'

const EmptyState = ({title}) => {
  return (
    <View className="justify-center items-center px-4">
    <Image 
      source={images.empty}
      className="w-[270px] h-[215px]"
      resizeMode='contain' />
    <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
    </Text>

    </View>
  )
}

export default EmptyState

const styles = StyleSheet.create({})

