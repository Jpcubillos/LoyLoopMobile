import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { SuccessState } from "@/components/QRClaimCard";
import {
  Button,
  Feedback,
  Header,
  Icon,
  Screen,
  SectionHeader,
  SettingRow,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getUserProfile, isDemo } from "@/lib/loyloop-data";
import {
  deleteAccount,
  ProfileField,
  requestEmailChange,
  updatePassword,
  updateProfile,
  uploadAvatar,
  verifyEmailChange,
} from "@/lib/profile";
type Panel = ProfileField | "email" | "password" | "delete" | "";
const labels = {
  name: "Nombre completo",
  phone: "Número de celular",
  birthDate: "Fecha de nacimiento",
  avatar: "Avatar",
  email: "Correo electrónico",
  password: "Cambiar contraseña",
  delete: "Eliminar mi cuenta",
  "": "",
};
export default function PersonalInformationScreen() {
  const { data: profile, loading, error, reload } = useResource(getUserProfile);
  const [panel, setPanel] = useState<Panel>("");
  const [value, setValue] = useState("");
  const [current, setCurrent] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  function edit(next: Panel) {
    setPanel(next);
    setValue(
      next && profile && next in profile
        ? String(profile[next as keyof typeof profile])
        : "",
    );
    setCurrent("");
    setConfirm("");
    setCode("");
    setVerifying(false);
    setFailure("");
    setSuccess("");
  }
  async function save() {
    setFailure("");
    setBusy(true);
    try {
      if (panel === "email") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()))
          throw new Error("Ingresa un correo válido.");
        if (!verifying) {
          await requestEmailChange(value);
          setVerifying(true);
          return;
        }
        if (!/^\d{6,8}$/.test(code.trim()))
          throw new Error("Ingresa el código que recibiste por correo.");
        await verifyEmailChange(value, code);
        setSuccess("Correo actualizado");
      } else if (panel === "password") {
        if (value.length < 8)
          throw new Error(
            "Usa al menos 8 caracteres para tu nueva contraseña.",
          );
        if (value !== confirm) throw new Error("Las contraseñas no coinciden.");
        await updatePassword(current, value);
        setSuccess("Contraseña actualizada");
      } else if (panel === "delete") {
        if (value !== "ELIMINAR")
          throw new Error("Escribe ELIMINAR para confirmar.");
        await deleteAccount();
        setPanel("");
        router.replace("/login");
        return;
      } else if (panel) {
        if (panel === "name" && value.trim().length < 2)
          throw new Error("Ingresa tu nombre completo.");
        if (panel === "phone" && !/^\+?[\d ()-]{7,20}$/.test(value.trim()))
          throw new Error("Ingresa un número de celular válido.");
        if (
          panel === "birthDate" &&
          (!/^\d{4}-\d{2}-\d{2}$/.test(value) ||
            !Number.isFinite(Date.parse(value)) ||
            new Date(value).toISOString().slice(0, 10) !== value ||
            Date.parse(value) > Date.now())
        )
          throw new Error("Usa una fecha válida en formato AAAA-MM-DD.");
        await updateProfile(panel, value.trim());
        setSuccess("Información actualizada");
      }
      await reload();
    } catch (err) {
      setFailure(
        err instanceof Error ? err.message : "No pudimos guardar los cambios.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function changeAvatar() {
    setFailure("");
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.4,
        base64: true,
      });
      if (result.canceled) return;
      const base64 = result.assets[0].base64;
      if (!base64) throw new Error("No se pudo leer la imagen.");
      setBusy(true);
      await uploadAvatar(base64);
      await reload();
    } catch (err) {
      setFailure(
        err instanceof Error ? err.message : "No pudimos actualizar tu avatar.",
      );
    } finally {
      setBusy(false);
    }
  }
  const field = (
    label: string,
    text: string,
    change: (v: string) => void,
    password = false,
  ) => (
    <View style={{ gap: 8 }}>
      <Txt weight="semibold" size={13}>
        {label}
      </Txt>
      <TextInput
        accessibilityLabel={label}
        value={text}
        onChangeText={change}
        secureTextEntry={password && !showPassword}
        autoCapitalize={password || panel === "email" ? "none" : "sentences"}
        keyboardType={
          panel === "phone"
            ? "phone-pad"
            : panel === "email"
              ? verifying
                ? "number-pad"
                : "email-address"
              : "default"
        }
        style={ui.input}
      />
    </View>
  );
  return (
    <Screen tabs={false}>
      <Header
        title="Información personal"
        subtitle="Gestiona tus datos y mantén tu cuenta actualizada."
        back
      />
      <Feedback
        loading={loading || (busy && !panel)}
        error={error || !panel ? error || failure : ""}
        retry={reload}
      />
      {profile && (
        <>
          <View style={{ alignItems: "center", gap: 6, paddingVertical: 12 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Cambiar avatar"
              disabled={busy}
              onPress={changeAvatar}
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: c.soft,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              {profile.avatar ? (
                <Image
                  source={{ uri: profile.avatar }}
                  contentFit="cover"
                  style={{ width: 88, height: 88 }}
                />
              ) : (
                <Txt size={28} weight="semibold" color={c.cta}>
                  {profile.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </Txt>
              )}
              <View
                style={{
                  position: "absolute",
                  right: 2,
                  bottom: 0,
                  backgroundColor: "#fff",
                  borderRadius: 14,
                  padding: 4,
                }}
              >
                <Icon name="camera-outline" size={18} color={c.muted} />
              </View>
            </Pressable>
            <Txt weight="bold" size={18}>
              {profile.name}
            </Txt>
            <Txt size={12} color={c.muted}>
              {profile.joinedAt
                ? `Miembro desde ${new Date(profile.joinedAt).toLocaleDateString("es-CO", { month: "short", year: "numeric" })}`
                : "Tu perfil LoyLoop"}
            </Txt>
          </View>
          {!profile.authenticated && !isDemo && (
            <Button
              title="Iniciar sesión para editar"
              onPress={() => router.push("/login")}
            />
          )}
          <View>
            <SettingRow
              icon="person-outline"
              label="Nombre completo"
              value={profile.name}
              onPress={() => edit("name")}
            />
            <SettingRow
              icon="mail-outline"
              label="Correo electrónico"
              value={profile.email || "Añadir correo"}
              onPress={() => edit("email")}
            />
            <SettingRow
              icon="call-outline"
              label="Número de celular"
              value={profile.phone || "Añadir celular"}
              onPress={() => edit("phone")}
            />
            <SettingRow
              icon="calendar-outline"
              label="Fecha de nacimiento"
              value={profile.birthDate || "Añadir fecha"}
              onPress={() => edit("birthDate")}
            />
          </View>
          <SectionHeader title="Seguridad" />
          <SettingRow
            icon="lock-closed-outline"
            label="Cambiar contraseña"
            onPress={() => edit("password")}
          />
          <SettingRow
            icon="trash-outline"
            label="Eliminar mi cuenta"
            danger
            onPress={() => edit("delete")}
          />
        </>
      )}
      <Sheet
        visible={!!panel}
        title={
          success
            ? "Confirmación"
            : verifying
              ? "Verificar correo"
              : panel === "password" || panel === "delete"
                ? labels[panel]
                : `Editar ${labels[panel].toLowerCase()}`
        }
        onClose={() => !busy && setPanel("")}
      >
        {success ? (
          <SuccessState
            title={success}
            description="Tus cambios se guardaron correctamente."
            onContinue={() => setPanel("")}
          />
        ) : (
          <>
            {panel === "delete" && (
              <Txt>
                Esta acción elimina tu cuenta y tu progreso de fidelidad de
                forma permanente. Escribe ELIMINAR para confirmar.
              </Txt>
            )}
            {panel === "email" && (
              <Txt color={c.muted}>
                {verifying
                  ? `Ingresa el código enviado a ${value}. Si recibes una confirmación en tu correo anterior, complétala también.`
                  : "Te enviaremos un código para verificar tu nuevo correo."}
              </Txt>
            )}
            {panel === "birthDate" && (
              <Txt color={c.muted}>Ingresa tu fecha en formato AAAA-MM-DD.</Txt>
            )}
            {panel === "password" &&
              field("Contraseña actual", current, setCurrent, true)}
            {verifying
              ? field("Código de verificación", code, setCode)
              : field(
                  panel === "delete"
                    ? "Confirmación"
                    : panel === "password"
                      ? "Nueva contraseña"
                      : labels[panel],
                  value,
                  setValue,
                  panel === "password",
                )}
            {panel === "password" && (
              <>
                {field("Confirmar nueva contraseña", confirm, setConfirm, true)}
                <Button
                  title={
                    showPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"
                  }
                  variant="ghost"
                  onPress={() => setShowPassword((v) => !v)}
                />
              </>
            )}
            <Feedback error={failure} />
            <Button
              title={
                panel === "delete"
                  ? "Eliminar mi cuenta definitivamente"
                  : panel === "email"
                    ? verifying
                      ? "Verificar"
                      : "Enviar código"
                    : "Guardar cambios"
              }
              loading={busy}
              onPress={save}
            />
            {verifying && (
              <Button
                title="Reenviar código"
                disabled={busy}
                variant="ghost"
                onPress={async () => {
                  setBusy(true);
                  try {
                    await requestEmailChange(value);
                    setFailure("");
                  } catch (err) {
                    setFailure(
                      err instanceof Error
                        ? err.message
                        : "No se pudo reenviar.",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              />
            )}
          </>
        )}
      </Sheet>
    </Screen>
  );
}
