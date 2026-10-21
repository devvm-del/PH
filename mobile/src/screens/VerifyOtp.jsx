import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";
import AppModal from "../components/AppModal";
import Button from "../components/Button";
import { Ionicons } from "@expo/vector-icons";

import useAuth from "../hooks/useAuth";
import verifyOtpHandler from "../handlers/auth/verifyOtpHandler";
import resendOtpHandler from "../handlers/auth/resendOtpHandler";

const VerifyOTP = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { email } = route.params || {};

  const { verifyOtp, resendOtp, loading } = useAuth();

  const [resetToken, setResetToken] = useState(null);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const inputRefs = useRef([]);

  const { handleChange, handleKeyPress, handleVerifyOtp } = verifyOtpHandler({
    verifyOtp,
    navigation,
    email,
    otp,
    setOtp,
    setResetToken,
    setOtpError,
    setMessage,
    setModalVisible,
    inputRefs,
  });

  const { handleResendOtp } = resendOtpHandler({
    resendOtp,
    email,
    setOtp,
    setMessage,
    setModalVisible,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
          <Ionicons name="arrow-back-outline" size={35} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="shield-checkmark-outline" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.subtTitle}>
          We've sent a 6-digit verification code to your email address. Please
          enter the code below to continue.
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputRefs.current[index] = ref;
              }}
              style={[styles.otpInput, value ? styles.otpInputActive : null]}
              value={value}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {otpError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {otpError}
          </Text>
        ) : null}

        <Button
          title="Verify Code"
          onPress={handleVerifyOtp}
          loading={loading}
          style={{ width: "100%" }}
        />

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code?</Text>

          <TouchableOpacity onPress={handleResendOtp}>
            <Text style={styles.resendButton}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);
          if (message === "OTP verified successfully.") {
            navigation.navigate("ResetPassword", { resetToken });
          }
        }}
      />
    </ScrollView>
  );
};

export default VerifyOTP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#15151B",
    marginTop: 37,
  },

  content: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 120,
  },

  backButtonContainer: {
    paddingBottom: 30,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },

  iconContainer: {
    width: 150,
    height: 150,

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 25,

    backgroundColor: "#25252F",

    borderRadius: 25,
  },

  title: {
    color: "#F8FAFC",

    fontSize: 28,
    fontWeight: "700",

    textAlign: "center",

    marginBottom: 10,
  },

  subtTitle: {
    color: "#A1A1AA",

    fontSize: 15,
    lineHeight: 22,

    textAlign: "center",

    marginBottom: 25,

    maxWidth: 350,
  },

  otpContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    width: "100%",

    gap: 8,

    marginBottom: 20,
  },

  otpInput: {
    width: 48,
    height: 58,

    backgroundColor: "#25252F",

    borderRadius: 12,

    borderWidth: 1,
    borderColor: "#3F3F46",

    color: "#F8FAFC",

    fontSize: 22,
    fontWeight: "700",

    textAlign: "center",
  },

  otpInputActive: {
    borderColor: "#2563EB",
    backgroundColor: "#172554",
  },

  resendContainer: {
    flexDirection: "row",

    justifyContent: "center",
    alignItems: "center",

    marginTop: 20,
  },

  resendText: {
    color: "#A1A1AA",

    fontSize: 14,
  },

  resendButton: {
    color: "#60A5FA",

    fontSize: 14,
    fontWeight: "600",

    marginLeft: 5,

    textDecorationLine: "underline",
  },
});
