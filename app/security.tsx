import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import { onValue, ref } from "firebase/database";
import { db } from "../firebaseConfig";

const { width, height } = Dimensions.get("window");

export default function SecurityScreen() {
  const [drivers, setDrivers] = useState<any>({});
  const [alerts, setAlerts] = useState<any>({});

  // 🔴 LISTEN TO DRIVERS (live location)
  useEffect(() => {
    const driversRef = ref(db, "drivers");

    const unsubscribeDrivers = onValue(driversRef, (snapshot) => {
      if (snapshot.exists()) {
        setDrivers(snapshot.val());
      }
    });

    return () => unsubscribeDrivers();
  }, []);

  // 🚨 LISTEN TO SOS ALERTS (REAL-TIME)
  useEffect(() => {
    const alertsRef = ref(db, "alerts");

    const unsubscribeAlerts = onValue(alertsRef, (snapshot) => {
      if (snapshot.exists()) {
        setAlerts(snapshot.val());
      }
    });

    return () => unsubscribeAlerts();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -26.2041,
          longitude: 28.0473,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* 🚗 DRIVER MARKERS */}
        {drivers &&
          Object.keys(drivers).map((id) => {
            const driver = drivers[id];

            if (!driver.location) return null;

            return (
              <Marker
                key={id}
                coordinate={{
                  latitude: driver.location.latitude,
                  longitude: driver.location.longitude,
                }}
                title={`Driver: ${id}`}
                description={driver.status}
                pinColor="green"
              />
            );
          })}

        {/* 🚨 SOS ALERT MARKERS */}
        {alerts &&
          Object.keys(alerts).map((id) => {
            const alert = alerts[id];

            if (!alert.location) return null;

            return (
              <Marker
                key={id}
                coordinate={{
                  latitude: alert.location.latitude,
                  longitude: alert.location.longitude,
                }}
                title="🚨 SOS ALERT"
                description={`Driver: ${alert.driverId}`}
                pinColor="red"
              />
            );
          })}
      </MapView>

      {/* 🔴 ALERT PANEL */}
      <View style={styles.alertPanel}>
        <Text style={styles.alertTitle}>🚨 Live Alerts</Text>

        {alerts &&
          Object.keys(alerts).map((id) => {
            const alert = alerts[id];

            return (
              <Text key={id} style={styles.alertItem}>
                🚨 {alert.driverId} sent SOS
              </Text>
            );
          })}
      </View>
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
  alertPanel: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#000",
    padding: 15,
  },
  alertTitle: {
    color: "#FF0000",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertItem: {
    color: "#fff",
    marginBottom: 5,
  },
});