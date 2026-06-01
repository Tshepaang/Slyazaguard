import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function HomeScreen() {
  const goToRegister = () => {
    router.push("/register");
  };

  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DriverGuard</Text>

      <Text style={styles.subtitle}>
        Safety • Tracking • Emergency Response
      </Text>

      <TouchableOpacity style={styles.button} onPress={goToRegister}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={goToLogin}
      >
        <Text style={styles.secondaryText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050B1A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#00E676",
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 50,
  },

  button: {
    backgroundColor: "#00E676",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 18,
  },

  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#00E676",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  secondaryText: {
    color: "#00E676",
    fontSize: 18,
    fontWeight: "bold",
  },
});