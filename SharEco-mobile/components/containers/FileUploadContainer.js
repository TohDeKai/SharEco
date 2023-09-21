import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { colours } from '../ColourPalette';
import RegularText from '../text/RegularText';
const { primary, inputbackground, black } = colours;

const FileUploadContainer = ({files, onAddFile, onRemoveFile, maxFiles}) => {
  return (
    // style this to have gaps
    <View>
      {files.map((file, index) => (
        <View style={styles.fileCard}>
          <RegularText typography="Subtitle" >{file.name}</RegularText>
          <RegularText typography="Subtitle" >{file.size}</RegularText>
          <Pressable
            onPress={() => onRemoveFile(index)}
          >
            <Ionicons name='trash' size={40} color={black}/>
          </Pressable>
        </View>
      ))}

      {files.length < maxFiles && (
        <View style={styles.fileUploadContainer}>
          <Pressable
            onPress={onAddFile}
            style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
          >
            <Ionicons name="add-circle" size={30} color={primary} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default FileUploadContainer;

const styles = StyleSheet.create({
  fileUploadContainer: {
    flex: 1,
    position: "relative",
    top: 15,
    width: 328,
    height: 60,
    borderRadius: 9,
    backgroundColor: inputbackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileCard: {
    flex: 1,
    top: 15,
    flexDirection: "row",
    position: "relative",
    padding: 10,
    width: 328,
    height: 60,
    borderRadius: 9,
    backgroundColor: inputbackground,
    alignItems: "centre",
    justifyContent: "space-between"
  },
})