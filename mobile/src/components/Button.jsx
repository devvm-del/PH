import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Button = ({
  title,
  onPress,
  style,
  textStyle,
  loading = false,
  icon,
  iconSize = 20,
  iconColor = "#F8FAFC",
  iconPosition = "left",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#F8FAFC" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === "left" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.leftIcon}
            />
          )}

          <Text style={[styles.buttonText, textStyle]}>{title}</Text>

          {icon && iconPosition === "right" && (
            <Ionicons
              name={icon}
              size={iconSize}
              color={iconColor}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 55,
    backgroundColor: "#2563EB",
    borderRadius: 14,

    justifyContent: "center",
    alignItems: "center",

    marginTop: 15,

    shadowColor: "#2563EB",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  leftIcon: {
    marginRight: 8,
  },

  rightIcon: {
    marginLeft: 8,
  },

  buttonText: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "700",
    includeFontPadding: false,
    lineHeight: 20,
    textAlignVertical: "center",
  },
});
