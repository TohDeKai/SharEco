import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView
} from "react-native";
import { useAuth } from "../../../context/auth";
import { router } from "expo-router";
import { Formik } from "formik";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

//components
import SafeAreaContainer from "../../../components/containers/SafeAreaContainer";
import FileUploadContainer from "../../../components/containers/FileUploadContainer";
import RoundedButton from "../../../components/buttons/RoundedButton";
import Header from "../../../components/Header";
import StyledTextInput from '../../../components/inputs/LoginTextInputs';
import RegularText from '../../../components/text/RegularText';
import MessageBox from "../../../components/text/MessageBox";
import { colours } from "../../../components/ColourPalette";
const { placeholder, white, primary } = colours;
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const MAX_FILES = 5;

const viewportHeightInPixels = (percentage) => {
  const screenHeight = Dimensions.get("window").height;
  return (percentage / 100) * screenHeight;
};

const viewportWidthInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").width;
  return (percentage / 100) * screenWidth;
};

// to include edit and cancel biz veri req
const sharEcoBiz = () => {
  const [user, setUser] = useState("");
  const { getUserData } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState([]);

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

  const [message, setMessage] = useState("");
  const [isSuccessMessage, setIsSuccessMessage] = useState("false");

  const handleAddFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/*",
        multiple: true,
      });

      if (result.type !== 'cancel') {
        const selectedDocuments = result.assets;

        if (selectedDocuments !== null) {
          const totalSelectedFiles = selectedFiles.length;

          const newTotalSelectedFiles = totalSelectedFiles + selectedDocuments.length;

          if (newTotalSelectedFiles > MAX_FILES) {
            setMessage("You've selected more files than the maximum allowed files.");
            setIsSuccessMessage(false);
            return;
          }
          else {
            // Clear the message if picker is used again
            setMessage("");
            setIsSuccessMessage(false);
          }

          selectedDocuments.forEach((document, index) => {
            console.log(
              `Document ${index + 1}:`,
              document.uri, // URI of the selected document
              document.type, // MIME type of the document
              document.name, // Name of the document
              document.size // Size of the document in bytes
            );
          });
          setSelectedFiles((prevFiles) => [...prevFiles, ...selectedDocuments]);
        } 
      }
      else if (result.type === 'cancel') {
        // user cancelled document picker
        console.log("User cancelled picker");
      }
    }
    catch (error) {
      console.error('Error picking documents:', error);
    }
  }

  const handleRemoveFile = (index) =>  {
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  }

  const handleBack = () => {
    router.back();
  };

  const handleSave = async (values) => {
    const userId = user.userId;
    const bizVeriData = {
      UEN: values.uen,
      documents: selectedFiles,
      // by default approved is false
      approved: false,
      originalUserId: userId,
    };

    try {
      const response = await axios.post(
        `http://${BASE_URL}:4000/api/v1/businessVerifications`, bizVeriData
      );

      console.log(response.data);

      if (response.status === 201) {
        console.log("Business verification request submitted successfully");
        router.back();
      } else {
        console.log("Unable to submit business verification request");
      }

      const bizVeriId = response.data.businessVerificationId;

      const linkResponse = await axios.put(
        `http://${BASE_URL}:4000/api/v1/users/businessVerification/${userId}`,
        { bizVeriId }
      );

      if (linkResponse.status === 200) {
        console.log("Business verification request linked to the user successfully");
      } else {
        console.log("Unable to link business verification request to the user");
      }

    } catch (error) {
       console.log(error.message);
    }
  };

  return (
    <SafeAreaContainer>
      <Header title="SharEco Biz" action="close" onPress={handleBack} />
      <Formik
        initialValues={{
          uen: "",
        }}
        onSubmit={(values, actions) => {
          if (values.uen == "") {
            setMessage("Please fill in your UEN.");
            setIsSuccessMessage(false);
          } else if (values.uen.length != 9 && values.uen.length != 10) {
            setMessage("UEN must be 9 or 10 digits long.");
            setIsSuccessMessage(false);
          } else if (selectedFiles.length === 0) {
            setMessage("Please upload at least 1 file.");
            setIsSuccessMessage(false);
          } else {
            handleSave(values);
            actions.resetForm();
            setSelectedFiles([]);
          }
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <KeyboardAvoidingView style={styles.content}>
              <View style={{ width: "100%" }}>
                {/* <RegularText typography="H3" style={styles.headerText}>Business Name</RegularText>
                <StyledTextInput
                  placeholder={"Enter your business name"}
                  returnKeyType="next"
                  value={values.name}
                  onChangeText={handleChange("name")}
                />
                <RegularText typography="H3" style={styles.headerText}>Business Email</RegularText>
                <StyledTextInput
                  placeholder={"Enter your business email"}
                  keyboardType="email-address"
                  returnKeyType="next"
                  value={values.email}
                  onChangeText={handleChange("email")}
                />
                <RegularText typography="H3" style={styles.headerText}>Business Phone Number</RegularText>
                <StyledTextInput
                  placeholder={"Enter your business phone number"}
                  keyboardType="number-pad"
                  returnKeyType="next"
                  value={values.phoneNumber}
                  onChangeText={handleChange("phoneNumber")}
                /> */}
                <RegularText typography="H3" style={styles.headerText}>UEN</RegularText>
                <StyledTextInput
                  placeholder={"Enter your UEN"}
                  keyboardType="number-pad"
                  returnKeyType="done"
                  value={values.uen}
                  onChangeText={handleChange("uen")}
                />
                <RegularText typography="H3" style={styles.headerText}>Business Documents</RegularText>
                <RegularText typography="Subtitle" style={{color: placeholder}}>
                  You may upload your business registration document, tax filing, or business bank statement.
                </RegularText>
                <RegularText typography="Subtitle" style={{color: placeholder}}>
                  Up to 5 documents(.pdf, .doc, .docx)
                </RegularText>
                <FileUploadContainer
                  files={selectedFiles}
                  onAddFile={handleAddFile}
                  onRemoveFile={handleRemoveFile}
                  maxFiles={MAX_FILES}
                />
                
                <MessageBox style={{marginTop: 35, marginBottom: 20}} success={isSuccessMessage}>
                  {message || " "}
                </MessageBox>
              </View>
              <RoundedButton
                typography={"B1"}
                color={white}
                onPress={handleSubmit}
                style={styles.bizButton}
              >
                Set Up Biz Account
              </RoundedButton>
            </KeyboardAvoidingView>
          </ScrollView>
        )}
      </Formik>
    </SafeAreaContainer>
  );
};

export default sharEcoBiz;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    width: viewportWidthInPixels(85),
    top: 20,
  },
  bizButton: {
    bottom: 40,
  },
  headerText: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
});