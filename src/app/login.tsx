import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!isSupabaseConfigured) {
      setFeedback("Primero llena EXPO_PUBLIC_SUPABASE_URL y EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY en .env.");
      return;
    }

    setLoading(true);
    setFeedback("");

    const result = mode === "login"
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password);

    setLoading(false);

    if (result.error) {
      setFeedback(result.error.message);
      return;
    }

    setFeedback(mode === "signup" ? "Cuenta creada." : "Sesion iniciada.");
    router.replace("/");
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.kicker}>LoyLoop</Text>
        <Text style={styles.title}>{mode === "login" ? "Entrar" : "Crear cuenta"}</Text>
        <Text style={styles.text}>Accede como cliente para ver comercios, sellos y recompensas.</Text>

        <View style={styles.segment}>
          <Pressable style={[styles.segmentButton, mode === "login" && styles.segmentActive]} onPress={() => setMode("login")}>
            <Text style={[styles.segmentText, mode === "login" && styles.segmentTextActive]}>Entrar</Text>
          </Pressable>
          <Pressable style={[styles.segmentButton, mode === "signup" && styles.segmentActive]} onPress={() => setMode("signup")}>
            <Text style={[styles.segmentText, mode === "signup" && styles.segmentTextActive]}>Crear cuenta</Text>
          </Pressable>
        </View>

        <TextInput
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Contrasena"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}

        <Pressable style={styles.button} onPress={submit} disabled={loading || !email || !password}>
          {loading ? <ActivityIndicator color="#ffffff" /> : <Text style={styles.buttonText}>{mode === "login" ? "Entrar" : "Crear cuenta"}</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8fafc",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 14,
  },
  kicker: {
    color: "#0d6efd",
    fontSize: 14,
    fontWeight: "900",
  },
  title: {
    color: "#071225",
    fontSize: 32,
    fontWeight: "900",
  },
  text: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },
  segment: {
    flexDirection: "row",
    borderRadius: 12,
    backgroundColor: "#f1f5f9",
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    borderRadius: 9,
    paddingVertical: 10,
  },
  segmentActive: {
    backgroundColor: "#ffffff",
  },
  segmentText: {
    color: "#64748b",
    fontWeight: "900",
    textAlign: "center",
  },
  segmentTextActive: {
    color: "#0d6efd",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#071225",
    fontSize: 16,
  },
  feedback: {
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    padding: 12,
    color: "#1e40af",
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#0d6efd",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
  },
});
