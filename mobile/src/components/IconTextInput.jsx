import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const IconTextInput = ({
  label,
  style,
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.container, style, error && styles.errorBorder]}>
        <Ionicons name={icon} size={22} color="#A1A1AA" style={styles.icon} />

        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
        />

        {/* Eye icon*/}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#A1A1AA"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default IconTextInput;

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginVertical: 5,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2D2D38",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
    backgroundColor: "#25252F",
    marginVertical: 5,
  },

  label: {
    color: "#F8FAFC",
    fontSize: 12,
    fontWeight: "600",
    marginStart: 5,
    marginBottom: 5,
  },

  icon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#F8FAFC",
  },

  eyeButton: {
    padding: 5,
    marginLeft: 5,
  },

  errorBorder: {
    borderColor: "#B91C1C",
    borderWidth: 1,
  },
});
