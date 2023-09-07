import React, { useState }from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

//components
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import UserAvatar from "../../../components/UserAvatar";
import {colours} from "../../../components/ColourPalette";
const { black, white, primary } = colours;

const viewportHeightInPixels = (percentage) => {
	const screenHeight = Dimensions.get("window").height;
	return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
	const screenWidth = Dimensions.get("window").width;
	return (percentage / 100) * screenWidth;
};

const accountSettings = () => {
  //need to initialise image as the user's actual profilepic url
  const [image, setImage] = useState(null);
  let profilePic = "";

  if (image == null) { 
    profilePic = require("../../../assets/icon.png");
  } else {
    profilePic = { uri: image};
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleBack = () => {
    router.back();
  };
  const handleOpenGallery = () => {
    console.log("Opening gallery");
    pickImage();
  }

  return (
    <SafeAreaContainer>
      <View style={styles.content}>
        <Header title="Edit Profile" action="close" onPress={handleBack}/>
          <View style={styles.avatarContainer}>
            <UserAvatar size="big" source={profilePic}/>
            <Pressable 
              onPress={handleOpenGallery} 
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <RegularText typography="B1" color={primary} style={styles.text}>Upload or edit picture</RegularText>
            </Pressable>
          </View>
      </View>
    </SafeAreaContainer>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  content: {
    width: viewportWidthInPixels(85),
    flex: 1,
    alignItems: 'center',
    alignSelf: "center",
  },
  avatarContainer: {
    alignItems: 'center', 
    borderColor: "red",
    borderWidth: 2,
    width: viewportWidthInPixels(85),
  },
  text: {
    marginTop: 13, // Adjust this value to control the gap
  },
});
