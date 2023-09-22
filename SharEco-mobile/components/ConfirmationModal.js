import React from "react";
import { StyleSheet, Modal, Text, View, Button } from "react-native";
import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";
import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
const { primary, white, black, secondary } = colours;

const ConfirmationModal = ({ isVisible, onClose, onConfirm }) => {
  return (
    <View style={[styles.centeredView]}>
      <Modal visible={isVisible} animationType="slide" transparent={false}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <RegularText
              typography="H3"
              color={black}
              style={styles.modalStyle}
            >
              Are you sure you want to submit? This action cannot be reversed.
            </RegularText>
            <View style={styles.nav}>
              <View style={styles.buttonContainer}>
                <PrimaryButton typography="H3" color={white} onPress={onClose}>
                  Cancel
                </PrimaryButton>
              </View>
              <View style={styles.buttonContainer}>
                <SecondaryButton
                  typography="H3"
                  color={primary}
                  onPress={onConfirm}
                >
                  Confirm
                </SecondaryButton>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: white,
    marginVertical: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  nav: {
    top:"40%",
    backgroundColor: white,
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    justifyContent: "center",
  },
});
export default ConfirmationModal;
