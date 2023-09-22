import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { colours } from '../ColourPalette';
import RegularText from '../text/RegularText';

const { primary, inputbackground, black } = colours;

const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1048576) {
    // Display in KB for files smaller than 1 MB
    const sizeInKB = sizeInBytes / 1000;
    return `${sizeInKB.toFixed(2)} kB`;
  } else {
    // Display in MB for files 1 MB or larger
    const sizeInMB = sizeInBytes / 1000000;
    return `${sizeInMB.toFixed(2)} MB`;
  }
};

const FileUploadContainer = ({files, onAddFile, onRemoveFile, maxFiles}) => {
  return (
    <View>
      {files.map((file, index) => (
        <View key={index} style={styles.fileCard}>
          <View style={styles.column}>
            <RegularText 
              typography="Subtitle" 
              numberOfLines={1} 
              ellipsizeMode="middle"
            >
              {file.name}
            </RegularText>
            <RegularText typography="Subtitle2" >{`${formatFileSize(file.size)}`}</RegularText>
          </View>
          <Pressable
            onPress={() => onRemoveFile(index)}
          >
            <Ionicons name='trash-outline' size={30} color={black}/>
          </Pressable>
        </View>
      ))}

      {files.length < maxFiles && (
        <Pressable
          onPress={onAddFile}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <View style={styles.fileUploadContainer}>
            <Ionicons name="add-circle" size={40} color={primary} />
          </View>
        </Pressable>
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
    marginBottom: 15,
    backgroundColor: inputbackground,
    alignItems: "center",
    justifyContent: "space-between"
  },
  column: {
    width: 265,
  }
})
