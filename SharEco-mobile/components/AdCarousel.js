import {
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Linking,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { router } from "expo-router";

import { colours } from "./ColourPalette";
const { primary, green30 } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const Carousel = () => {
  const adList = useRef();
  const width = viewportWidthInPixels(100);
  const [activeIndex, setActiveIndex] = useState(0);
  const [weekAds, setWeekAds] = useState([]);

  useEffect(() => {
    async function fetchWeeklyAds() {
      try {
        const response = await axios.get(
          `http://${BASE_URL}:4000/api/v1/activeAds`
        );

        if (response.status === 200) {
          const ads = response.data.data.ads;
          setWeekAds(ads);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchWeeklyAds();
  }, []);

  useEffect(() => {
    let autoscroll = setInterval(() => {
      if (activeIndex === data.length - 1) {
        adList.current.scrollToIndex({
          index: 0,
          animation: true,
        });
      } else {
        adList.current.scrollToIndex({
          index: activeIndex + 1,
          animation: true,
        });
      }
    }, 4000);

    return () => clearInterval(autoscroll);
  });

  const getItemLayout = (data, index) => ({
    length: width,
    offset: width * index, // for first image - 300 * 0 = 0pixels, 300 * 1 = 300, 300*2 = 600
    index: index,
  });
  // Data for carousel
  const data = weekAds.map((ad, index) => ({
    id: index + 1,
    image: ad.image,
    link: ad.link,
    bizId: ad.bizId,
    adId: ad.advertisementId,
  }));

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = scrollPosition / width;
    setActiveIndex(index);
  };

  const handleAdPress = async (item) => {
    try {
      const adId = parseInt(item.adId);
      console.log(adId);
      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/addVisit/adId/${adId}`
      );
      if (response.status === 200) {
        console.log("Added visit count");
      } else {
        //Shouldn't come here
        console.log("Failed to retrieve all listings");
      }
    } catch (error) {
      console.log(error.message);
    }
    if (!item.link) {
      router.push({
        pathname: "home/othersProfile",
        params: { userId: item.bizId },
      });
    } else {
      return Linking.openURL(item.link);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        ref={adList}
        getItemLayout={getItemLayout}
        renderItem={({ item, index }) => {
          return (
            <Pressable onPress={() => handleAdPress(item)}>
              <Image
                source={{ uri: item.image }}
                style={{ height: width / 3, width: width }}
              />
            </Pressable>
          );
        }}
        keyExtractor={(item) => item.id}
        horizontal={true}
        pagingEnabled={true}
        onScroll={handleScroll}
      />
      {/* <Paginators /> */}
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  paginators: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 6,
  },
});
