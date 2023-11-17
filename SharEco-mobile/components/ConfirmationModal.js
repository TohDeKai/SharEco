import React, { useState, useRef } from "react";
import { StyleSheet, Modal, Text, View, Button, TextInput } from "react-native";
import { PrimaryButton, SecondaryButton } from "./buttons/RegularButton";
import { colours } from "./ColourPalette";
import RegularText from "./text/RegularText";
const { primary, white, black, secondary, red } = colours;
import StyledTextInput from "../components/inputs/LoginTextInputs";
import MessageBox from "../components/text/MessageBox";
import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";

const ConfirmationModal = ({
  isVisible,
  onClose,
  onConfirm,
  type,
  ...props
}) => {
  const [reasons, setReasons] = useState([
    { label: "Scheduling Conflict", value: "Scheduling Conflict" },
    {
      label: "Item No Longer Needed",
      value: "Item No Longer Needed",
    },
    { label: "Disagreement on Terms", value: "Disagreement on Terms" },
    { label: "Change in Event Date", value: "Change in Event Date" },
    {
      label: "Item Damaged or Malfunctioning",
      value: "Item Damaged or Malfunctioning",
    },
    { label: "Found Another Solution", value: "Found Another Solution" },
    { label: "Non-compliance with Rules", value: "Non-compliance with Rules" },
    {
      label: "Legal or Regulatory Issues",
      value: "Legal or Regulatory Issues",
    },
  ]);

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (props.rental) {
    let totalCancellationFee;
    const rentalFee = parseFloat(
      props.rental.rentalFee.replace(/[^0-9.]/g, "")
    );
    totalCancellationFee = 0.3 * rentalFee;
  }

  let formattedStartDate;
  let formattedEndDate;

  if (type !== "Delete") {
    const startDate = new Date(props.rental.startDate);
    formattedStartDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(startDate);

    const endDate = new Date(props.rental.endDate);
    formattedEndDate = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(endDate);
  }

  return (
    <View>
      {type === "Delete" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H3"
                  color={black}
                  style={styles.modalStyle}
                >
                  Are you sure you want to delete? This action cannot be
                  reversed.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onConfirm}
                    >
                      Confirm
                    </SecondaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onClose}
                    >
                      Cancel
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {
        type === "Cancel" && (
          <View style={[styles.centeredView]}>
            <Modal
              visible={isVisible}
              animationType="slide"
              transparent={false}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <RegularText
                    typography="H4"
                    color={black}
                    style={styles.modalStyle}
                  >
                    Are you sure you want to cancel? This cannot be reversed.
                  </RegularText>
                  {/* <TextInput
                    style={styles.input}
                    multiline={true}
                    value={cancellationReason}
                    onChangeText={(text) => {
                      setCancellationReason(text);
                      // props.forCancellationData(text);
                    }}
                    placeholder="Tell us your reason for cancellation"
                  /> */}
                  {/* <DropDownPicker
                    open={open}
                    value={reason}
                    items={reasons}
                    setOpen={setOpen}
                    setValue={setReason}
                    setItems={setReasons}
                    autoScroll={true}
                    maxHeight={200}
                    placeholder="Select a reason"
                    style={{ marginTop: 10 }}
                  /> */}
                  <View style={styles.nav}>
                    <View style={styles.buttonContainer}>
                      <SecondaryButton
                        typography="H3"
                        color={primary}
                        onPress={onConfirm}
                      >
                        Confirm
                      </SecondaryButton>
                    </View>
                    <View style={styles.buttonContainer}>
                      <PrimaryButton
                        typography="H3"
                        color={white}
                        onPress={onClose}
                      >
                        Cancel
                      </PrimaryButton>
                    </View>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )
        // (
        //   <Formik
        //     initialValues={{
        //       cancellationReason: "",
        //     }}
        //     onSubmit={(values, actions) => {
        //       if (values.cancellationReason == "") {
        //         setMessage("Please fill in all fields");
        //         setIsSuccessMessage(false);
        //       } else {
        //         handleCancel(values);
        //         onConfirm();
        //         actions.resetForm();
        //       }
        //     }}
        //   >
        //     {({ handleChange, handleBlur, handleSubmit, values }) => (
        //       <View style={[styles.centeredView]}>
        //         <Modal
        //           visible={isVisible}
        //           animationType="slide"
        //           transparent={false}
        //         >
        //           <View style={styles.centeredView}>
        //             <View style={styles.modalView}>
        //               <RegularText
        //                 typography="H3"
        //                 color={black}
        //                 style={styles.modalStyle}
        //               >
        //                 Are you sure you want to cancel? This action cannot be
        //                 reversed.
        //               </RegularText>
        //               <View style={{ display: "flex", width: "100px" }}>
        //                 <StyledTextInput
        //                   placeholder="Enter reason for cancellation"
        //                   onChangeText={handleChange("cancellationReason")}
        //                   value={values.cancellationReason}
        //                   maxLength={100}
        //                   multiline={true}
        //                   scrollEnabled={false}
        //                   minHeight={120}
        //                 />
        //               </View>

        //               <MessageBox
        //                 style={{ marginTop: 10 }}
        //                 success={isSuccessMessage}
        //               >
        //                 {message || " "}
        //               </MessageBox>
        //               <View style={styles.nav}>
        //                 <View style={styles.buttonContainer}>
        //                   <SecondaryButton
        //                     typography="H3"
        //                     color={primary}
        //                     onPress={handleSubmit}
        //                   >
        //                     Confirm
        //                   </SecondaryButton>
        //                 </View>
        //                 <View style={styles.buttonContainer}>
        //                   <PrimaryButton
        //                     typography="H3"
        //                     color={white}
        //                     onPress={onClose}
        //                   >
        //                     Cancel
        //                   </PrimaryButton>
        //                 </View>
        //               </View>
        //             </View>
        //           </View>
        //         </Modal>
        //       </View>
        //     )}
        //   </Formik>
        // )
      }
      {type === "Accept" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  <Text style={styles.heading}>
                    You are accepting this rental
                  </Text>
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    Start Date {"       "} {formattedStartDate}
                  </Text>{" "}
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    End Date {"          "} {formattedEndDate}
                  </Text>
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    Location {"          "} {props.rental.collectionLocation}
                  </Text>
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    Deposit Fee {"  "} {props.rental.depositFee}
                  </Text>
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    Rental Fee {"      "} {props.rental.rentalFee}
                  </Text>
                  {"\n"}
                  {"\n"}
                  <Text style={styles.subHeading}>
                    Total Fee {"          "} {props.rental.totalFee}
                  </Text>
                  {"\n"}
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onClose}
                    >
                      Cancel
                    </SecondaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onConfirm}
                    >
                      Confirm
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {/* Notifying modal if user's wallet balance is negative*/}
      {type === "NegativeWalletBalance" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  Please clear outstanding balance in EcoWallet
                </RegularText>
                <View style={styles.nav}>
                  {/* <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onConfirm}
                    >
                      Confirm
                    </SecondaryButton>
                  </View> */}
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onClose}
                    >
                      Close
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {/* Notifying modal if LENDER is doing a late cancellation*/}
      {type === "LenderLateCancellation" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  As this is a late cancellation, a ${totalCancellationFee}{" "}
                  cancellation fee will apply.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onConfirm}
                    >
                      Confirm
                    </SecondaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onClose}
                    >
                      Close
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {/* Notifying modal if BORROWER is doing a late cancellation*/}
      {type === "BorrowerLateCancellation" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  As this is a late cancellation, a ${totalCancellationFee}{" "}
                  cancellation fee will apply.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onConfirm}
                    >
                      Confirm
                    </SecondaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onClose}
                    >
                      Close
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {type === "Reject" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  Are you sure? This action cannot be reversed.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onConfirm}
                    >
                      Confirm
                    </SecondaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onClose}
                    >
                      Cancel
                    </PrimaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {/* Confirmation modal for updating rental status as ONGOING */}
      {type === "Update" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  Update status as ongoing? This action cannot be reversed.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onConfirm}
                    >
                      Update
                    </PrimaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onClose}
                    >
                      Cancel
                    </SecondaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
      {/* Confirmation modal for completing rental status */}
      {type === "Complete" && (
        <View style={[styles.centeredView]}>
          <Modal visible={isVisible} animationType="slide" transparent={false}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <RegularText
                  typography="H4"
                  color={black}
                  style={styles.modalStyle}
                >
                  Complete rental? This action cannot be reversed.
                </RegularText>
                <View style={styles.nav}>
                  <View style={styles.buttonContainer}>
                    <PrimaryButton
                      typography="H3"
                      color={white}
                      onPress={onConfirm}
                    >
                      Complete
                    </PrimaryButton>
                  </View>
                  <View style={styles.buttonContainer}>
                    <SecondaryButton
                      typography="H3"
                      color={primary}
                      onPress={onClose}
                    >
                      Cancel
                    </SecondaryButton>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  modalStyle: {
    marginVertical: 10,
    textAlign: "center",
    textAlignVertical: "center",
  },
  heading: {
    fontSize: 21,
    fontWeight: "bold",
    textAlign: "left",
  },
  subHeading: {
    fontSize: 15,
    textAlign: "left",
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
    height: 70,
    borderColor: white,
    flexDirection: "row",
    borderTopWidth: 1,
    paddingHorizontal: 5,
  },
  buttonContainer: {
    flex: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 0,
    justifyContent: "center",
  },
  input: {
    height: 55,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: 280,
  },
});
export default ConfirmationModal;
