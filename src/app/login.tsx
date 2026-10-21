import { router } from "expo-router";
import { useState } from "react";
import { TextInput, View } from "react-native";
import {
  Button,
  Feedback,
  Header,
  Icon,
  Screen,
  Tabs,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";
import { signInWithEmail, signUpWithEmail } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export default function LoginScreen() {
  const [mode, setMode] = useState<"Entrar" | "Crear cuenta">("Entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit() {
    setError("");
    setMessage("");
    if (!isSupabaseConfigured) {
      setError("El acceso no está disponible en esta demostración.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Ingresa un correo válido.");
      return;
    }
    setBusy(true);
    try {
      const result =
        mode === "Entrar"
          ? await signInWithEmail(email, password)
          : await signUpWithEmail(email, password);
      if (result.error) throw result.error;
      if (result.data.session) router.replace("/");
      else
        setMessage(
          "Revisa tu correo para confirmar tu cuenta. Después podrás iniciar sesión.",
        );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos iniciar sesión. Inténtalo nuevamente.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Screen tabs={false}>
      <Header title="LoyLoop" back />
      <View style={{ gap: 24, paddingTop: 32 }}>
        <Icon name="sparkles-outline" size={42} />
        <Txt size={29} weight="bold">
          Tus lugares favoritos,{"\n"}más cerca de ti.
        </Txt>
        <Txt color={c.muted}>
          Descubre comercios, desbloquea beneficios y encuentra razones para
          volver.
        </Txt>
        <Tabs
          items={["Entrar", "Crear cuenta"] as const}
          value={mode}
          onChange={setMode}
        />
        <View style={{ gap: 10 }}>
          <Txt weight="medium">Correo electrónico</Txt>
          <TextInput
            accessibilityLabel="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="tu@correo.com"
            placeholderTextColor={c.muted}
            style={ui.input}
          />
        </View>
        <View style={{ gap: 10 }}>
          <Txt weight="medium">Contraseña</Txt>
          <TextInput
            accessibilityLabel="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoComplete={
              mode === "Entrar" ? "current-password" : "new-password"
            }
            style={ui.input}
          />
        </View>
        <Feedback error={error} />
        {!!message && <Txt color="#008957">{message}</Txt>}
        <Button
          title={mode}
          onPress={submit}
          loading={busy}
          disabled={!email || password.length < 6}
        />
        <Button
          title="Seguir explorando"
          variant="ghost"
          onPress={() => router.replace("/")}
        />
      </View>
    </Screen>
  );
}
