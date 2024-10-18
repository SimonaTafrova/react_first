import { View, Text, Image } from "react-native";


const InfoBox = ({ textcontent, date, containerStyles, titleStyles, imagesource }) => {
  return (
    <View className={`flex-row items-center ${containerStyles}`}>
      <Image
        source={imagesource}
        className="w-12 h-12 rounded-3xl mr-3 border-2"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className={`text-black font-bold text-lg ${titleStyles}`}>
          {textcontent} 
        </Text>
        <Text className="text-black text-sm mt-1">
          {date}
        </Text>
      </View>
    </View>
  );
};

export default InfoBox;
