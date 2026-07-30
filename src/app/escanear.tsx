import { CameraView, useCameraPermissions } from "expo-camera";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BottomTabs } from "@/components/BottomTabs";

export default function EscanearScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [lastCode, setLastCode] = useState("");
  const [locked, setLocked] = useState(false);

  if (!permission) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.text}>Preparando camara...</Text>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Escanear QR</Text>
        <Text style={styles.text}>Necesitamos permiso de camara para leer codigos QR.</Text>
        <Pressable style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Escanear</Text>
        <Text style={styles.text}>Apunta al QR del comercio o del cliente.</Text>

        <View style={styles.cameraFrame}>
          <CameraView
            style={styles.camera}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={({ data }) => {
              if (locked) return;
              setLocked(true);
              setLastCode(data);
            }}
          />
        </View>

        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Ultimo codigo</Text>
          <Text style={styles.resultText}>{lastCode || "Sin lectura todavia"}</Text>
        </View>

        {locked ? (
          <Pressable style={styles.button} onPress={() => setLocked(false)}>
            <Text style={styles.buttonText}>Escanear otro</Text>
          </Pressable>
        ) : null}
      </View>
      <BottomTabs />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8fafc",
    gap: 14,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingBottom: 110,
    gap: 14,
  },
  title: {
    color: "#071225",
    fontSize: 30,
    fontWeight: "900",
  },
  text: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },
  cameraFrame: {
    overflow: "hidden",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#0f172a",
    aspectRatio: 1,
  },
  camera: {
    flex: 1,
  },
  resultBox: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  resultLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  resultText: {
    marginTop: 8,
    color: "#071225",
    fontSize: 16,
    fontWeight: "800",
  },
  button: {
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
  },
});
