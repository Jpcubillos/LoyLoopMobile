import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ComponentProps, PropsWithChildren } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts, palette as c } from "@/constants/loyloop";
import { BottomTabs } from "@/components/BottomTabs";
import { useAppearance } from "@/components/AppearanceProvider";
import { IconMedallion } from "@/components/PremiumIcon";

export type IconName = ComponentProps<typeof Ionicons>["name"];
export function Icon({
  name,
  size = 22,
  color = c.primary,
}: {
  name: IconName;
  size?: number;
  color?: string;
}) {
  return <Ionicons name={name} size={size} color={color} />;
}
export function Txt({
  weight = "regular",
  size = 14,
  color = c.ink,
  style,
  ...props
}: TextProps & { weight?: keyof typeof fonts; size?: number; color?: string }) {
  return (
    <Text
      {...props}
      style={[
        {
          fontFamily: fonts[weight],
          fontSize: size,
          lineHeight: size * 1.4,
          color,
        },
        style,
      ]}
    />
  );
}
export function Screen({
  children,
  tabs = true,
  background = "#fff",
  padding = 24,
}: PropsWithChildren<{
  tabs?: boolean;
  background?: string;
  padding?: number;
}>) {
  const { appearance } = useAppearance();
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: appearance === "Suave" ? c.canvas : background,
      }}
      edges={
        tabs ? ["top", "left", "right"] : ["top", "left", "right", "bottom"]
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding,
          paddingBottom: 32,
          gap: 20,
          flexGrow: 1,
        }}
      >
        {children}
      </ScrollView>
      {tabs && <BottomTabs />}
    </SafeAreaView>
  );
}
export function BrandCard({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <LinearGradient
      colors={["#FF6B6B", "#F5385E", "#E84393"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[ui.brand, style]}
    >
      {children}
    </LinearGradient>
  );
}
export function Button({
  title,
  onPress,
  variant = "primary",
  icon,
  disabled,
  loading,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost";
  icon?: IconName;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const color = variant === "primary" ? "#fff" : c.cta;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        variant === "primary"
          ? { backgroundColor: c.cta }
          : variant === "secondary"
            ? {
                borderWidth: 1,
                borderColor: c.primary,
                backgroundColor: "#fff",
              }
            : { backgroundColor: "transparent" },
        (disabled || loading) && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={color} />
      ) : (
        icon && <Icon name={icon} size={20} color={color} />
      )}
      <Txt
        weight="semibold"
        color={color}
        size={13}
        style={{ textAlign: "center", flexShrink: 1 }}
      >
        {title}
      </Txt>
    </Pressable>
  );
}
export function IconButton({
  name,
  onPress,
  label,
  color = c.ink,
}: {
  name: IconName;
  onPress: () => void;
  label: string;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      style={ui.iconButton}
    >
      <Icon name={name} color={color} size={22} />
    </Pressable>
  );
}
export function Header({
  title,
  subtitle,
  back = false,
}: {
  title: string;
  subtitle?: string;
  back?: boolean;
}) {
  return (
    <View style={{ gap: 6 }}>
      <View style={ui.row}>
        {back && (
          <IconButton
            name="chevron-back"
            label="Volver"
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
          />
        )}
        <Txt size={back ? 21 : 25} weight="bold" style={{ flex: 1 }}>
          {title}
        </Txt>
      </View>
      {subtitle && (
        <Txt size={13} color={c.muted}>
          {subtitle}
        </Txt>
      )}
    </View>
  );
}
export function SectionHeader({
  title,
  action,
  onPress,
  compact = false,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
  compact?: boolean;
}) {
  return (
    <View style={[ui.row, { justifyContent: "space-between", gap: 10 }]}>
      <Txt
        weight={compact ? "semibold" : "bold"}
        size={compact ? 15 : 17}
        style={{ flex: 1 }}
      >
        {title}
      </Txt>
      {action && onPress && (
        <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8}>
          <Txt size={11} color={c.cta} weight={compact ? "semibold" : "medium"}>
            {action}
          </Txt>
        </Pressable>
      )}
    </View>
  );
}
export function Pill({
  text,
  icon,
  tone = "coral",
}: {
  text: string;
  icon?: IconName;
  tone?: "coral" | "green" | "gray";
}) {
  const color =
    tone === "green" ? "#008957" : tone === "gray" ? c.muted : c.cta;
  return (
    <View
      style={[
        ui.pill,
        {
          backgroundColor:
            tone === "green" ? "#E6F8EF" : tone === "gray" ? "#F4F5F8" : c.soft,
        },
      ]}
    >
      {icon && <Icon name={icon} size={12} color={color} />}
      <Txt size={10} weight="medium" color={color}>
        {text}
      </Txt>
    </View>
  );
}
export function Progress({
  value,
  gold = false,
}: {
  value: number;
  gold?: boolean;
}) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(Math.min(1, Math.max(0, value || 0)) * 100),
      }}
      style={[ui.track, gold && { backgroundColor: "#AD315D" }]}
    >
      <View
        style={{
          height: "100%",
          borderRadius: 8,
          width: `${Math.max(0, Math.min(1, value || 0)) * 100}%`,
          backgroundColor: gold ? c.gold : c.primary,
        }}
      />
    </View>
  );
}
export function Tabs<T extends string>({
  items,
  value,
  onChange,
}: {
  items: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={[ui.row, { gap: 8 }]}>
      {items.map((item) => (
        <Pressable
          key={item}
          accessibilityRole="tab"
          accessibilityState={{ selected: value === item }}
          onPress={() => onChange(item)}
          style={[
            ui.tab,
            value === item && {
              backgroundColor: "#F15361",
              borderColor: "#F15361",
            },
          ]}
        >
          <Txt
            size={items.length > 3 ? 10 : 12}
            weight="semibold"
            color={value === item ? "#fff" : c.muted}
            style={{ textAlign: "center" }}
          >
            {item}
          </Txt>
        </Pressable>
      ))}
    </View>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder: string;
}) {
  return (
    <View style={ui.search}>
      <Icon name="search-outline" color={c.muted} size={19} />
      <TextInput
        accessibilityLabel={placeholder}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={c.muted}
        style={[
          ui.input,
          { borderWidth: 0, flex: 1, padding: 0, minHeight: 40 },
        ]}
      />
      {!!value && (
        <Pressable
          accessibilityLabel="Limpiar búsqueda"
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => onChange("")}
        >
          <Icon name="close-circle-outline" color={c.muted} />
        </Pressable>
      )}
    </View>
  );
}
export function Sheet({
  visible,
  title,
  children,
  onClose,
}: PropsWithChildren<{
  visible: boolean;
  title: string;
  onClose: () => void;
}>) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={ui.overlay}
      >
        <Pressable
          accessibilityLabel="Cerrar panel"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={["bottom"]} style={ui.sheet}>
          <View style={ui.handle} />
          <View style={[ui.row, { justifyContent: "space-between" }]}>
            <Txt weight="bold" size={21} style={{ flex: 1 }}>
              {title}
            </Txt>
            <IconButton name="close" label="Cerrar" onPress={onClose} />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ gap: 18, paddingBottom: 20 }}
            style={{ flexGrow: 0 }}
          >
            {children}
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function SettingRow({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: IconName;
  label: string;
  value?: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        ui.setting,
        danger && { backgroundColor: "#FFF2F3", borderRadius: 14 },
      ]}
    >
      <IconMedallion
        name={icon}
        size={38}
        tone={
          icon.includes("moon") || icon.includes("sunny") ? "violet" : "coral"
        }
      />
      <View style={{ flex: 1, gap: 2 }}>
        <Txt weight="semibold" color={danger ? "#D93C54" : c.ink}>
          {label}
        </Txt>
        {value && (
          <Txt size={12} color={c.muted}>
            {value}
          </Txt>
        )}
      </View>
      <Icon name="chevron-forward" size={16} color={c.muted} />
    </Pressable>
  );
}
export function Feedback({
  loading,
  error,
  retry,
}: {
  loading?: boolean;
  error?: string;
  retry?: () => void;
}) {
  if (loading)
    return <ActivityIndicator color={c.primary} style={{ padding: 24 }} />;
  if (!error) return null;
  return (
    <View style={[ui.card, { gap: 12 }]}>
      <Txt color="#B83149">{error}</Txt>
      {retry && (
        <Button title="Volver a intentar" variant="secondary" onPress={retry} />
      )}
    </View>
  );
}
export function Empty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <View style={{ padding: 28, alignItems: "center", gap: 10 }}>
      <IconMedallion name="sparkles" size={58} tone="gold" />
      <Txt weight="semibold" style={{ textAlign: "center" }}>
        {title}
      </Txt>
      <Txt color={c.muted} size={12} style={{ textAlign: "center" }}>
        {description}
      </Txt>
    </View>
  );
}
export const ui = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    padding: 16,
  },
  brand: { borderRadius: 24, padding: 20, gap: 14, overflow: "hidden" },
  button: {
    minHeight: 48,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  track: {
    height: 8,
    backgroundColor: "#E9E9EF",
    borderRadius: 8,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 22,
    paddingHorizontal: 4,
    paddingVertical: 10,
    justifyContent: "center",
  },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    backgroundColor: "#F6F7FA",
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: c.ink,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000077",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    gap: 18,
    maxHeight: "92%",
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  handle: {
    width: 48,
    height: 5,
    backgroundColor: "#C6C2CD",
    borderRadius: 4,
    alignSelf: "center",
    marginTop: -10,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 16,
    minHeight: 62,
  },
});
