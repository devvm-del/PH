import AsyncStorage from "@react-native-async-storage/async-storage";

const getUserHandler = async () => {
  try {
    const storedUser = await AsyncStorage.getItem("user");

    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
};

export default getUserHandler;
