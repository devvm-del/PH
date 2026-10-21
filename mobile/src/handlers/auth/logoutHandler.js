import AsyncStorage from "@react-native-async-storage/async-storage";

const logoutHandler = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);

      // Navigate to Login
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    handleLogout,
  };
};

export default logoutHandler;
