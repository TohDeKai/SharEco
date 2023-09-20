import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Formik } from "formik";
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import RegularText from "../../../components/text/RegularText";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import LabelledTextInput from "../../../components/inputs/LabelledTextInput";
import MessageBox from "../../../components/text/MessageBox";
import UserAvatar from "../../../components/UserAvatar";
import { colours } from "../../../components/ColourPalette";
const { black, white, primary } = colours;

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const editProfile = () => {
  const [user, setUser] = useState("");
  const { signIn } = useAuth();
  const { getUserData } = useAuth();

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userData = await getUserData();
        if (userData) {
          setUser(userData);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchUserData();
  }, [user]);

  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");
  //need to initialise image as the user's actual profilepic url
  const [image, setImage] = useState(user.userPhotoUrl);

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
  };
  const handleSave = async (details) => {
    const username = user.username;
    const newDetails = {
      username: details.username || user.username, // Use the new value if provided, otherwise keep the original value
      password: user.password,
      email: user.email,
      contactNumber: user.contactNumber,
      userPhotoUrl: image, 
      isBanned: user.isBanned,
      likedItem: user.likedItem,
      wishList: user.wishList,
      displayName: details.name || user.displayName, // Use the new value if provided, otherwise keep the original value
      aboutMe: details.aboutMe || user.aboutMe, // Use the new value if provided, otherwise keep the original value
    };

    try {
      const response = await axios.put(
        `http://${BASE_URL}:4000/api/v1/users/username/${username}`,
        newDetails
      );

      console.log(response.data);

      if (response.status === 200) {
        //update user
        const userDataResponse = await axios.get(
          `http://${BASE_URL}:4000/api/v1/users/username/${details.username}`
        );
        if (userDataResponse.status === 200) {
          // Successfully retrieved user data, useAuth to update this user
          const userData = userDataResponse.data.data.user;
          console.log("User object: ", userData);
          signIn(userData); // Update the user object in the state
          router.back();
        } else {
          //shouldnt come here
          console.log("Failed to retrieve user data");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <SafeAreaContainer>
      <Header title="Edit Profile" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar size="big" source={{uri:image || user.userPhotoUrl || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}} />
            <Pressable
              onPress={handleOpenGallery}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <RegularText typography="B1" color={primary} style={styles.text}>
                Upload or edit picture
              </RegularText>
            </Pressable>
          </View>
          <Formik
            initialValues={{
              name: user.displayName,
              username: user.username,
              aboutMe: user.aboutMe,
            }}
            onSubmit={(values, { setSubmitting }) => {
              //checks for changed fields
              const changedFields = {};
              if (values.name !== user.displayName) {
                changedFields.name = values.name;
              }
              if (values.username !== user.username) {
                changedFields.username = values.username;
              }
              if (values.aboutMe !== user.aboutMe) {
                changedFields.aboutMe = values.aboutMe;
              }

              if (values.name == undefined) {
                changedFields.name = user.displayName;
              }
              if (values.username == undefined) {
                changedFields.username = user.username;
              }
              if (values.aboutMe == undefined) {
                changedFields.aboutMe = user.aboutMe;
              }

              //this doesnt seem to actually get called but doesnt really affect functionality
              if (Object.keys(changedFields).length === 0) {
                setMessage("No fields have changed");
                setIsSuccessMessage(false);
                return;
              }

              //checks for empty fields
              if (
                values.name == "" ||
                values.username == "" ||
                values.aboutMe == ""
              ) {
                setMessage("Please fill in all fields");
                setIsSuccessMessage(false);
              } else {
                handleSave(changedFields, setSubmitting);
              } 	
            }}	
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <LabelledTextInput
                  label="Name"
                  placeholder={user.displayName}
                  defaultValue={user.displayName} 
                  value={values.name}
                  onChangeText={handleChange("name")}
                />
                <LabelledTextInput
                  label="Username"
                  placeholder={user.username}
                  defaultValue={user.username}
                  value={values.username}
                  onChangeText={handleChange("username")}
                />
                <LabelledTextInput
                  label="About Me"
                  placeholder={user.aboutMe}
                  defaultValue={user.aboutMe}
                  value={values.aboutMe}
                  onChangeText={handleChange("aboutMe")}
                  maxLength={100}
                  multiline={true}
                  scrollEnabled={false}
                  height={80}
                />
                <MessageBox
                  style={{ marginTop: 50 }}
                  success={isSuccessMessage}
                >
                  {message || " "}
                </MessageBox>
                <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                >
                  Save
                </RoundedButton>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default editProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: viewportWidthInPixels(100),
    top: 40,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 15,
  },
});
