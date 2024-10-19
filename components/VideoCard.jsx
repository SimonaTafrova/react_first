import { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { icons } from "../constants";


const extractYoutubeVideoId = (url) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
  const matches = url.match(regex);
  return matches ? matches[1] : null;
};

const VideoCard = ({ title, thumbnail, video }) => {
  const [play, setPlay] = useState(false);

  const videoId = extractYoutubeVideoId(video);

  return (
    <View style={{ flex: 1, alignItems: 'center', padding: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={{ fontWeight: '600', color: 'white', fontSize: 14 }} numberOfLines={1}>
              {title}
            </Text>
          </View>
        </View>
      </View>

      {play ? (
        videoId ? (
          <YoutubePlayer
            height={240}
            width={320}  // Ensure it's visible
            play={true}
            videoId={videoId}
            onChangeState={(event) => {
              if (event === "ended") {
                setPlay(false);  // Stop the player when the video ends
              }
            }}
          />
        ) : (
          <Text style={{ color: 'white', marginTop: 12 }}>Invalid YouTube URL</Text>
        )
      ) : (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          style={{ width: '100%', height: 240, borderRadius: 10, marginTop: 12, position: 'relative', justifyContent: 'center', alignItems: 'center' }}
        >
          <Image
            source={{ uri: thumbnail }}
            style={{ width: '100%', height: '100%', borderRadius: 10 }}
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            style={{ width: 48, height: 48, position: 'absolute' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;