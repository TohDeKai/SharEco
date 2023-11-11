import React from "react";
import Carousel, { ParallaxImage, Pagination } from "react-native-snap-carousel";
import {
  View,
  Text,
  Pressable,
  Dimensions,
  StyleSheet,
  Platform,
} from "react-native";

function CarouselItem({ item }, parallaxProps) {
  return (
    <View style={styles.item}>
      <ParallaxImage
        source={{ uri: item }} /* the source of the image */
        containerStyle={styles.imageContainer}
        style={styles.image}
        {...parallaxProps} /* pass in the necessary props */
      />
    </View>
  );
}

export default CarouselItem;

const { width: screenWidth } = Dimensions.get("window");

const styles = StyleSheet.create({
  item: {
    width: "100%",
    aspectRatio: 1,
  },
  imageContainer: {
    flex: 1,
    margin: 0,
  },
  image: {
    resizeMode: "contain",
    alignItems: "center"
  },
});
