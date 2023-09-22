import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
  Button,
  Modal,
} from "react-native";

import SafeAreaContainer from "../../components/containers/SafeAreaContainer";
import RegularText from "../../components/text/RegularText";
import RoundedButton from "../../components/buttons/RoundedButton";
import { router } from "expo-router";
import { colours } from "../../components/ColourPalette";
const { white } = colours;

const viewportHeightInPixels = (percentage) => {
  const screenWidth = Dimensions.get("window").height;
  return (percentage / 100) * screenWidth;
};

const TermsAndConditions = () => {
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <SafeAreaContainer>
      <View style={styles.container}>
        <RegularText typography="H1" style={styles.title}>
          Terms and conditions
        </RegularText>
        <ScrollView style={styles.tcContainer} scrollEventThrottle={100}>
          <RegularText typography="B2" style={styles.tcP}>
            Please read these Terms and Conditions ("Terms") carefully before
            using SharEco, a Peer-to-Peer Sharing Rental Platform operated by
            [SharEco] ("Company," "we," "us," or "our"). By accessing or using
            SharEco, you agree to comply with and be bound by these Terms. If
            you do not agree to these Terms, please do not use SharEco.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            1. User Eligibility
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} You are responsible for ensuring that your use of SharEco
            complies with all applicable laws and regulations.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            2. User Accounts
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} You are required to create an account to access certain
            features of SharEco. You must provide accurate and complete
            information when registering.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} You are responsible for maintaining the confidentiality
            of your account credentials and for all activities conducted through
            your account.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} You agree not to share your account credentials with
            third parties and to notify us immediately of any unauthorised
            access to your account.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} We reserve the right to suspend or terminate accounts
            that violate these Terms or engage in fraudulent or unlawful
            activities.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            3. Listing and Renting Items
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Lenders are responsible for accurately listing items
            available for rent, including item descriptions, availability,
            pricing, and any applicable terms and conditions.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Borrowers are responsible for reviewing item listings,
            including fees, rental periods, and any restrictions, before renting
            items.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Lenders are to respond to a rental request within 3 days
            of the request or the start date of the rental, whichever comes
            first.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} All transactions conducted through SharEco are the
            responsibility of the users involved. We do not endorse or guarantee
            the quality, safety, or legality of items listed on the platform.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Users are to first resolve any disputes arising from
            transactions directly with the other party involved. If a common
            ground cannot be established then should the users raise a dispute
            on the platform.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            4. Payment and Platform Fees
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Users agree to pay the fees associated with renting items
            through SharEco as described on the platform.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Payment processing is facilitated through Stripe, and
            users must comply with their terms and conditions.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} SharEco will charge a platform fee of 5% for each rental.
            This platform fee will be extracted from the total rental fee paid
            by the Borrower, where 5% of the rental fee (exclusive of deposit
            fee) goes to SharEco and the other 95% of the rental fee would go to
            the lender.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            5. Late Charges
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} As a Lender, if you were to lend the item in the booking
            late, you would be charged 20% of the rental fee for each hour or
            part thereof late.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} As a Borrower, if you were to return the item in the
            booking late, you would be charged 20% of the rental fee for each
            hour or part thereof late.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} SharEco will take 25% of the late fees charged.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            6. Cancellation Policy
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} As a Lender, you may at any time cancel an accepted
            booking without any charge at least 24 hours before the booking OR
            any time as long as you have not accepted the request.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} As a Borrower, you may at any time cancel an accepted
            booking without any charge at least 24 hours before the booking OR
            any time as long as your booking request has not been accepted.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} However if you cancel a rental listing within 24 hours of
            the booking fulfilment time, you agree to pay a cancellation charge
            of 30% of the Rental (“the Cancellation Charge’).
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} ShareEco takes 25% of cancellation fees charged.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            7. Content and Conduct
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Users agree not to post, upload, or share any content
            that is illegal, offensive, harmful, or violates the rights of
            others.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Users agree to treat other users with respect and not
            engage in harassment, discrimination, or any form of harmful
            behaviour.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} We reserve the right to remove or block any content or
            user accounts that violate these Terms.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            8. Privacy
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Your use of SharEco is also governed by our Privacy
            Policy, which outlines how we collect, use, and protect your
            personal information.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            9. Termination
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} We may suspend or terminate your access to SharEco at our
            discretion, with or without cause and with or without notice.
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Upon termination, all rights and obligations under these
            Terms will cease, except those that by their nature should survive,
            such as payment obligations and dispute resolution.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            10. Dispute Resolution
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Any disputes between users and the Company related to
            SharEco shall be resolved through negotiation and, if necessary,
            binding arbitration in accordance with the rules of the Singapore
            International Arbitration Centre (SIAC).
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} Users agree to waive their right to participate in
            class-action lawsuits and class-wide arbitration.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            11. Modifications
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} We reserve the right to modify or update these Terms at
            any time. Updates will be posted on SharEco, and your continued use
            of the platform constitutes acceptance of the revised Terms.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
            12. Governing Law
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} These Terms are governed by the laws of Singapore,
            without regard to its conflict of law principles.
          </RegularText>
          <RegularText typography="H3" style={styles.tcP}>
          13. Contact Us
          </RegularText>
          <RegularText typography="B2" style={styles.tcL}>
            {"\u2022"} If you have any questions or concerns about these Terms
            or SharEco, please contact us at help@shareco.com.
          </RegularText>
          <RegularText typography="B2" style={styles.tcP}>
            By using SharEco, you acknowledge that you have read, understood,
            and agreed to these Terms and Conditions.
          </RegularText>
        </ScrollView>
        <View style={{marginTop:viewportHeightInPixels(-3)}}>
        <RoundedButton typography="B1" color={white} onPress={handleClose}>
          Close Terms and Conditions
        </RoundedButton>
        </View>
        
      </View>
    </SafeAreaContainer>
  );
};
const { width, height } = Dimensions.get("window");

const styles = {
  container: {
    flex: 1,
    backgroundColor: white,
    width:"85%",
    alignSelf: "center"
  },
  title: {
    fontSize: 22,
    alignSelf: "center",
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcP: {
    marginTop: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: height * 0.7,
  },

  button: {
    padding: 10,
  },

  buttonDisabled: {
    backgroundColor: "#999",
    borderRadius: 5,
    padding: 10,
  },

  buttonLabel: {
    fontSize: 14,
    color: "#FFF",
    alignSelf: "center",
  },
};
export default TermsAndConditions;
