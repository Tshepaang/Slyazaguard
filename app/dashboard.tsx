import React, { useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { ref, set } from "firebase/database";
import { db } from "../firebaseConfig";

export default function Dashboard() {
  const [online, setOnline] = useState(false);

  const driverId = "driver_001";
  const router = useRouter();

  // 🔥 Track subscription (VERY IMPORTANT)
  const locationSubscription = useRef<Location.LocationSubscription | null>(
    null
  );

  // 🚀 START LIVE TRACKING
  const startTracking = async () => {
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission Denied", "Location is required.");
      return;
    }

    locationSubscription.current =
      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // every 5 seconds
          distanceInterval: 5, // or every 5 meters
        },
        async (location) => {
          const { latitude, longitude } = location.coords;

          console.log("📍 LIVE:", latitude, longitude);

          // 🔥 SEND LIVE LOCATION TO FIREBASE
          await set(ref(db, "drivers/" + driverId), {
            status: "online",
            timestamp: Date.now(),
            location: {
              latitude,
              longitude,
            },
          });
        }
      );
  };

  // 🛑 STOP TRACKING
  const stopTracking = () => {
    if (locationSubscription.current) {
      locationSubscription.current.remove();
      locationSubscription.current = null;
    }

    set(ref(db, "drivers/" + driverId), {
      status: "offline",
      timestamp: Date.now(),
    });
  };

  // 🔄 TOGGLE DRIVER STATUS
  const toggleStatus = async () => {
    const newStatus = !online;
    setOnline(newStatus);

    if (newStatus) {
      await startTracking();
    } else {
      stopTracking();
    }
  };

  // 🚨 SOS (USES CURRENT LOCATION SNAPSHOT)
  const sendSOS = async () => {
    try {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      await set(ref(db, "alerts/" + Date.now()), {
        driverId: driverId,
        type: "SOS",
        timestamp: Date.now(),
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      });

      Alert.alert("🚨 SOS SENT", "Security team notified");
    } catch (error) {
      console.log("SOS ERROR:", error);
      Alert.alert("Error", "Failed to send SOS");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Slyza Guard</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Driver Status</Text>
        <Text style={styles.value}>
          {online ? "🟢 Online (Tracking)" : "🔴 Offline"}
        </Text>
      </View>

      <TouchableOpacity style={styles.toggleButton} onPress={toggleStatus}>
        <Text style={styles.buttonText}>
          {online ? "Stop Tracking" : "Start Tracking"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
        <Text style={styles.sosText}>PANIC SOS</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => router.push("/map")}
      >
        <Text style={styles.buttonText}>Open Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => router.push("/security")}
      >
        <Text style={styles.buttonText}>Security Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    color: "#FF0000",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },

  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },

  label: {
    color: "#aaa",
    fontSize: 14,
  },

  value: {
    color: "#fff",
    fontSize: 22,
    marginTop: 8,
  },

  toggleButton: {
    backgroundColor: "#FF0000",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  sosButton: {
    backgroundColor: "#8B0000",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  sosText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },

  mapButton: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
});