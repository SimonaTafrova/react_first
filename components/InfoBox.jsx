import { View, Text, Image } from "react-native";
import { images } from "../constants";

const InfoBox = ({ type, units, date, containerStyles, titleStyles }) => {
  return (
    <View className={`flex-row items-center ${containerStyles}`}>
      <Image
        source={images.insulin}
        className="w-12 h-12 rounded-3xl mr-3 border-2"
        resizeMode="contain"
      />
      <View className="flex-1">
        <Text className={`text-black font-bold text-lg ${titleStyles}`}>
          {type} - {units} units
        </Text>
        <Text className="text-black text-sm mt-1">
          {date}
        </Text>
      </View>
    </View>
  );
};

export default InfoBox;
