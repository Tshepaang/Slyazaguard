import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import { onValue, ref } from "firebase/database";
import { db } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function MapScreen() {
  const [location, setLocation] = useState<any>(null);
  const [route, setRoute] = useState<any[]>([]);

  const driverId = "driver_001";

  useEffect(() => {
    const driverRef = ref(db, "drivers/" + driverId);

    const unsubscribe = onValue(driverRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        if (data.location) {
          const newLocation = {
            latitude: data.location.latitude,
            longitude: data.location.longitude,
          };

          setLocation(newLocation);

          // 🚀 ADD POINT TO ROUTE
          setRoute((prev) => [...prev, newLocation]);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  if (!location) return null;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* 📍 CURRENT LOCATION */}
        <Marker coordinate={location} title="Driver" />

        {/* 🛣️ ROUTE LINE */}
        <Polyline
          coordinates={route}
          strokeWidth={4}
          strokeColor="red"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width,
    height,
  },
});