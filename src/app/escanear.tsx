import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Linking, TextInput, View } from "react-native";
import {
  Button,
  Feedback,
  Header,
  Icon,
  Screen,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";
import { parseCommerceQr } from "@/lib/loyalty-rules";
import { getBusinessDetail } from "@/lib/loyloop-data";
export default function EscanearScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [manual, setManual] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  async function scan(value: string) {
    if (locked.current) return;
    locked.current = true;
    setError("");
    const slug = parseCommerceQr(value);
    if (!slug) {
      setError("Este QR no corresponde a un comercio de LoyLoop.");
      locked.current = false;
      return;
    }
    setBusy(true);
    try {
      await getBusinessDetail(slug);
      router.replace(`/comercio/${slug}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No encontramos el comercio.",
      );
      locked.current = false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen tabs={false}>
      <Header
        title="Únete con QR"
        subtitle="Escanea el código del comercio y empieza a disfrutar sus beneficios."
        back
      />
      <View
        style={{
          aspectRatio: 1,
          backgroundColor: "#101F3C",
          borderRadius: 28,
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {permission?.granted ? (
          <CameraView
            style={{ width: "100%", height: "100%" }}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            onBarcodeScanned={({ data }) => {
              void scan(data);
            }}
          />
        ) : (
          <View style={{ padding: 28, alignItems: "center", gap: 18 }}>
            <Icon name="qr-code-outline" color="#fff" size={72} />
            <Txt color="#fff" style={{ textAlign: "center" }}>
              Permite el acceso a la cámara para escanear el QR.
            </Txt>
            <Button
              title={
                permission && !permission.canAskAgain
                  ? "Abrir ajustes"
                  : "Activar cámara"
              }
              onPress={() => {
                if (permission && !permission.canAskAgain)
                  void Linking.openSettings();
                else void requestPermission();
              }}
            />
          </View>
        )}
      </View>
      <Feedback loading={busy} error={error} />
      <Txt size={12} color={c.muted} style={{ textAlign: "center" }}>
        Encontrarás el QR en caja, en una mesa o en la recepción del comercio.
      </Txt>
      <View style={[ui.card, { gap: 12 }]}>
        <Txt weight="semibold">¿Tienes el enlace o código del comercio?</Txt>
        <TextInput
          accessibilityLabel="Enlace o código del comercio"
          placeholder="Ej. cafe-central"
          placeholderTextColor={c.muted}
          value={manual}
          onChangeText={setManual}
          autoCapitalize="none"
          style={ui.input}
        />
        <Button
          title="Buscar comercio"
          variant="secondary"
          disabled={!manual.trim() || busy}
          onPress={() => scan(manual)}
        />
      </View>
    </Screen>
  );
}
