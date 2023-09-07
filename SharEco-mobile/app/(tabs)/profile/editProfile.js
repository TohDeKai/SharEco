import React, { useState }from "react";
import { View, StyleSheet, Dimensions, Pressable } from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import { Formik } from "formik";

//components
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import LabelledTextInput from "../../../components/inputs/LabelledTextInput";
import MessageBox from "../../../components/text/MessageBox";
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
  const [message, setMessage] = useState("");
	const [isSuccessMessage, setIsSuccessMessage] = useState("false");
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
  const handleSave = (details) => {
    console.log("Im supposed to save the changes to db! ")
    //PUT operations to update profile details.name, details.username, details.aboutMe
    //if no issue, redirect
    router.back();
  }

  return (
    <SafeAreaContainer>
      <Formik
        initialValues={{
          //we need to get the existing data 
          name: "",
          username: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          if (
            values.name == "" ||
            values.username == "" ||
            values.aboutMe == ""
          ) {
            setMessage("Please fill in all fields");
            setIsSuccessMessage(false);
          } else {
            handleSave(values, setSubmitting);
          } 	
        }}	
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
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
            <View style={{width:"100%", marginTop: 50}}>
              <LabelledTextInput
                label="Name"
                placeholder="Weneedtoretrivethis"
                value={values.name}
                onChangeText={handleChange("name")}
              />
              <LabelledTextInput
                label="Username"
                placeholder="Weneedtoretrivethis"
                value={values.username}
                onChangeText={handleChange("username")}
              />
              <LabelledTextInput
                label="About Me"
                placeholder="Weneedtoretrivethis"
                value={values.aboutMe}
                onChangeText={handleChange("aboutMe")}
              />
              <MessageBox style={{ marginTop: 10 }} success={isSuccessMessage}>{message || " "}</MessageBox>
            </View>
            <RoundedButton typography={"B1"} color={white} onPress={handleSubmit} style={styles.saveButton}>Save</RoundedButton>
          </View>
        )
      }
      </Formik>
    </SafeAreaContainer>
  );
};

export default accountSettings;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    alignSelf: "center",
    width: viewportWidthInPixels(85),
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 15, 
  },
  saveButton: {
    position: 'absolute',
    bottom: 30,
  }
});
