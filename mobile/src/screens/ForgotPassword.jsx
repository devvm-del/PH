import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import IconTextInput from "../components/IconTextInput";
import Button from "../components/Button";
import AppModal from "../components/AppModal";
import { Ionicons } from "@expo/vector-icons";

import useAuth from "../hooks/useAuth";
import forgotPasswordHandler from "../handlers/auth/forgotPasswordHandler";

const ForgotPassword = () => {
  const navigation = useNavigation();

  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [message, setMessage] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const { handleForgotPassword } = forgotPasswordHandler({
    forgotPassword,
    navigation,
    email,
    setEmailError,
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
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Ionicons name="arrow-back-outline" size={35} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="lock-closed-outline" size={60} color="#2563EB" />
        </View>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subTitle}>
          Enter your email to get a verification code.
        </Text>

        <IconTextInput
          label="EMAIL"
          style={{ height: 55 }}
          icon="mail-outline"
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          keyboardType="email-address"
          error={emailError}
        />

        {emailError ? (
          <Text
            style={{
              color: "#B91C1C",
              marginTop: 0,
              width: "100%",
              fontSize: 12,
            }}
          >
            {emailError}
          </Text>
        ) : null}

        <Button
          title="Submit"
          onPress={handleForgotPassword}
          loading={loading}
          style={{ width: "100%" }}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#A1A1AA" }}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.createAccountText}>Create an Account</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AppModal
        visible={modalVisible}
        message={message}
        onClose={() => {
          setModalVisible(false);
          if (message === "Verification code has been sent.") {
            navigation.navigate("VerifyOtp", { email: email.trim() });
          }
        }}
      />
    </ScrollView>
  );
};

export default ForgotPassword;

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

  subTitle: {
    fontSize: 15,
    color: "#71717A",
    marginBottom: 20,
  },

  createAccountText: {
    textAlign: "center",
    color: "#60A5FA",
    textDecorationLine: "underline",
    fontWeight: 600,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },
});
