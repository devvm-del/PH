import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/global";

const ProfileHeader = ({ navigation, navigateTo, style }) => {
  return (
    <View style={[styles.header, style]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate(navigateTo)}
      >
        <View>
          <Ionicons name="arrow-back-outline" size={28} color="#F8FAFC" />
        </View>
      </TouchableOpacity>
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 35,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: "#F8FAFC",
            fontWeight: "700",
            fontSize: 20,
          }}
        >
          Profile
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
