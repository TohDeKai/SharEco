import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Image } from 'expo-image';
import { colours } from '../ColourPalette';
const { primary, inputbackground } = colours;

const ImagePickerContainer = ({ imageSource, onImagePress, onRemovePress }) => {
  return (
    <View style={styles.imageContainer}>
      {imageSource ? (
        <Image
          style={styles.image}
          source={{ uri: imageSource }}
          contentFit="cover"
          transition={1000}
        />
      ) : (
        <View style={styles.addContainer}>
          <Pressable
            onPress={onImagePress}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="add-circle" size={40} color={primary} />
          </Pressable>
        </View>
      )}
      {imageSource && onRemovePress && (
        <View style={styles.cancelContainer}>
          <Pressable
            onPress={onRemovePress}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="close-circle" size={20} color={primary} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ImagePickerContainer;


const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    position: "relative",
    width: 126,
    height: 126,
    borderRadius: 9,
    backgroundColor: inputbackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 9,
  },
  addContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
  },
  cancelContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
})