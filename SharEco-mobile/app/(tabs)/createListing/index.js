import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Formik, Field } from "formik";
import { router, Link } from "expo-router";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import ImagePickerContainer from "../../../components/containers/ImagePickerContainer";
import Header from "../../../components/Header";
import RoundedButton from "../../../components/buttons/RoundedButton";
import MessageBox from "../../../components/text/MessageBox";
import StyledTextInput from "../../../components/inputs/LoginTextInputs";
import RegularText from "../../../components/text/RegularText";
import { colours } from "../../../components/ColourPalette";
const { white, primary, inputbackground, black } = colours;
import DropdownList from "../../../components/inputs/DropdownList";
import MultipleDropdownList from "../../../components/inputs/MultipleDropdownList";
import { useAuth } from "../../../context/auth";
import {SelectList, MultipleSelectList }from 'react-native-dropdown-select-list'
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const createListing = () => {
  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  const [images, setImages] = useState([null, null, null, null, null]);
  const [category, setCategory] = useState("");
  const [lockers, setLockers] = useState([]);
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [selected, setSelected] = React.useState("");
  const [selectedList, setSelectedList] = React.useState([]);
  
  const data = [
    {key:'Canada', value:'Canada'},
    {key:'England', value:'England'},
    {key:'Pakistan', value:'Pakistan'},
    {key:'India', value:'India'},
    {key:'NewZealand', value:'NewZealand'},
  ]

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
  }, []);

  const categories = ["Mobiles","Appliances","Cameras","Computers","Winterwear","Fashion","Sporting Equipment"];

  const locations = [
    { key: "1", value: "Hougang" },
    { key: "2", value: "Punggol" },
    { key: "3", value: "Serangoon" },
    { key: "4", value: "Orchard" },
    { key: "5", value: "Woodlands" },
    { key: "6", value: "Yishun" },
    { key: "7", value: "Clementi" },
  ];

  const handleOpenGallery = (imageNumber) => {
    console.log("Opening gallery");
    pickImage(imageNumber);
  };

  const pickImage = async (imageNumber) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = [...images];
      newImages[imageNumber - 1] = result.assets[0].uri;
      setImages(newImages);
    }
  };

  const handleRemovePicture = (imageNumber) => {
    const newImages = [...images];
    newImages[imageNumber - 1] = null;
    setImages(newImages);
  };

  // Render the ImagePickerContainers
  const imageContainers = images.map((imageSource, index) => (
    <ImagePickerContainer
      key={index}
      imageSource={imageSource}
      onImagePress={() => handleOpenGallery(index + 1)}
      onRemovePress={() => handleRemovePicture(index + 1)}
    />
  ));

  const handleBack = () => {
    router.back();
  };

  const handleCreateListing = async (values) =>{
    try {
      const itemData = {
        userId: user.userId,
        itemTitle: values.title,
        itemDescription: values.description,
        itemOriginalPrice: values.originalPrice,
        rentalRateHourly: values.rentalRateHour,
        rentalRateDaily: values.rentalRateDay,
        depositFee: values.depositFee,
        images: images,
        category: values.category,
        collectionLocations:values.lockers,
        otherLocation:values.meetupLocation,
      };
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/items`,
        itemData
      );

      console.log(response.data);

      if (response.status === 201) {
        console.log("Item created successfully");
        router.push("/profile");
        console.log(values.category);
        setImages([null,null,null,null,null]);
        setCategory("");
        setLockers([]);
      } else {
        //shouldnt come here
        console.log("Item creation unsuccessful");
      }
    } catch (error) {
      if (error.response && error.response.status === 500) {
        console.log("Internal server error");
      } else {
        console.log("Error during item creation: ", error.message);
      }
    }
  }

  return (
    <SafeAreaContainer>
      <Header title="List an Item" action="close" onPress={handleBack} />
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Formik
            initialValues={{
              title: "",
              category: "",
              originalPrice: 0.0,
              depositFee: 0.0,
              rentalRateHour: 0.0,
              rentalRateDay: 0.0,
              description: "",
              meetupLocation: "",
              lockers: [],
            }}
            onSubmit={(values, actions) => {
              if (
                values.title == "" ||
                values.category == "" ||
                values.originalPrice == 0.0 ||
                values.depositFee == 0.0 ||
                values.description == "" ||
                values.lockers == [] ||
                //if both per hour and per day rental not specified
                (values.rentalRateHour == 0.0 && values.rentalRateDay == 0.0) //||
                //if both picklocker or meetup location not specified
                //(values.picklocker == "" && values.meetupLocation == "")
              ) {
                setMessage("Please fill in all fields");
                setIsSuccessMessage(false);
              } else {
                handleCreateListing(values);
                actions.resetForm();
              }
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={{ width: "85%" }}>
                <RegularText typography="H3" style={styles.headerText}>
                  Listing Title
                </RegularText>
                <StyledTextInput
                  placeholder="Name your listing"
                  value={values.title}
                  onChangeText={handleChange("title")}
                />

                <RegularText typography="H3" style={styles.headerText}>
                  Upload Images
                </RegularText>
                <RegularText typography="Subtitle" style={{ marginTop: 7 }}>
                  Up to 5 images
                </RegularText>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageCarousel}
                  style={{ paddingVertical: 7 }}
                >
                  {imageContainers}
                </ScrollView>

                <RegularText typography="H3" style={styles.headerText}>
                  Category
                </RegularText>
                <Field name="category">
                  {({ field }) => (
                    <DropdownList
                      setSelected={(val) =>
                        field.onChange({
                          target: { name: field.name, value: val },
                        })
                      }
                      data={categories}
                      save="value"
                    />
                  )}
                </Field>

                <RegularText typography="H3" style={styles.headerText}>
                  Description
                </RegularText>
                <StyledTextInput
                  placeholder="Include details helpful to borrowers"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  maxLength={300}
                  multiline={true}
                  scrollEnabled={false}
                  height={120}
                />

                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.headerText}>
                    Item Original Price
                  </RegularText>
                  <StyledTextInput
                    placeholder="0.00"
                    value={values.originalPrice}
                    onChangeText={handleChange("originalPrice")}
                    style={styles.perDayInputBox}
                    scrollEnabled={false}
                    keyboardType="decimal-pad"
                  />
                </View>
                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.headerText}>
                    Deposit Fee
                  </RegularText>
                  <StyledTextInput
                    placeholder="0.00"
                    value={values.depositFee}
                    onChangeText={handleChange("depositFee")}
                    style={styles.perDayInputBox}
                    scrollEnabled={false}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.perDayText}>
                    Hourly Rental Rate
                  </RegularText>
                  <StyledTextInput
                    value={values.rentalRateHour}
                    onChangeText={handleChange("rentalRateHour")}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    style={styles.perDayInputBox}
                  />
                </View>
                <View style={styles.perDayContainer}>
                  <RegularText typography="H3" style={styles.perDayText}>
                    Daily Rental Rate
                  </RegularText>
                  <StyledTextInput
                    value={values.rentalRateDay}
                    onChangeText={handleChange("rentalRateDay")}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    style={styles.perDayInputBox}
                  />
                </View>

                <RegularText typography="H3" style={styles.headerText}>
                  Collection & return location
                </RegularText>
                <Field name="lockers">
                  {({ field }) => (
                    <MultipleDropdownList
                      setSelected={(val) =>
                        field.onChange({
                          target: { name: field.name, value: val },
                        })
                      }
                      data={locations}
                    />
                  )}
                </Field>
                <RegularText typography="B2" style={styles.headerText}>
                  Other meet up location
                </RegularText>
                <StyledTextInput
                  placeholder="Add details of your meet up location (optional)"
                  value={values.meetupLocation}
                  onChangeText={handleChange("meetupLocation")}
                  maxLength={200}
                  multiline={true}
                  scrollEnabled={false}
                  height={80}
                />
                <RegularText
                  typography="Subtitle"
                  style={{ alignSelf: "center", marginTop: 10 }}
                >
                  By proceeding, you are agreeing to our{" "}
                  <Link href="/termsAndConditionsModal">
                    <Text
                      style={{
                        color: primary,
                        textDecorationLine: "underline",
                      }}
                    >
                      terms & conditions
                    </Text>
                  </Link>
                </RegularText>
                <MessageBox
                  style={{ marginTop: 10 }}
                  success={isSuccessMessage}
                >
                  {message || " "}
                </MessageBox>
                <RoundedButton
                  typography={"B1"}
                  color={white}
                  onPress={handleSubmit}
                >
                  List Item
                </RoundedButton>
              </View>
            )}
            <View style={{paddingHorizontal:15,marginTop:15}}>


<SelectList setSelected={setSelected} data={data}  />


<MultipleSelectList 
  setSelected={(val) => setSelectedList(val)} 
  data={data} 
  save="value"
  label="Categories"
  boxStyles={{marginTop:25}}
/>



<View style={{marginTop:50}}>
  <Text>Selected Value : </Text>
  <Text style={{marginTop:10,color:'gray'}}>{selected}</Text>
</View>


<View style={{marginTop:50}}>
  <Text>Selected Categories : </Text>
  {
    selectedList.map((item) => {
      return(
        <Text key={item} style={{marginTop:10,color:'gray'}}>{item}</Text>
      )
    })
  }
  
</View>

</View>
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaContainer>
  );
};

export default createListing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  scrollContainer: {
    top: 6,
    flexGrow: 1,
    alignItems: "center",
  },
  bottomContainer: {
    marginBottom: 20,
    alignSelf: "center", // Center horizontally
  },
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  imageCarousel: {
    gap: 10,
  },
  perDayContainer: {
    flexDirection:"row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    width: viewportWidthInPixels(85),
  },
  perDayText:{
    position: "relative",
    width: "fit-content%"
  },
  perDayInputBox:{
    justifyContent:"flex-end",
    width: viewportWidthInPixels(20),
  }
});
