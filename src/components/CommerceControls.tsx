import { useState } from "react";
import { Linking, Pressable, View } from "react-native";
import { palette as c } from "@/constants/loyloop";
import {
  Button,
  Icon,
  SettingRow,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import type { BusinessDetail } from "@/lib/loyloop-data";
export const sortOptions = [
  "Más usados",
  "Nombre",
  "Mejor calificados",
  "Más cercanos",
] as const;
export type SortOrder = (typeof sortOptions)[number] | "Disponibles primero";
export function SortTrigger({
  value,
  onChange,
  options = sortOptions,
}: {
  value: SortOrder;
  onChange: (v: SortOrder) => void;
  options?: readonly SortOrder[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => setOpen(true)}
        style={[
          ui.row,
          {
            alignSelf: "flex-start",
            paddingHorizontal: 14,
            paddingVertical: 9,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: c.primary,
            backgroundColor: c.soft,
          },
        ]}
      >
        <Icon name="swap-vertical-outline" size={15} />
        <Txt size={11} weight="semibold">
          Ordenar por: {value}
        </Txt>
        <Icon name="chevron-down" size={13} />
      </Pressable>
      <Sheet visible={open} title="Ordenar por" onClose={() => setOpen(false)}>
        {options.map((option) => (
          <SettingRow
            key={option}
            icon={
              option === value ? "checkmark-circle-outline" : "ellipse-outline"
            }
            label={option}
            onPress={() => {
              onChange(option);
              setOpen(false);
            }}
          />
        ))}
      </Sheet>
    </>
  );
}
export function CategoryChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const icon =
    label === "Cafés"
      ? "cafe-outline"
      : label === "Belleza"
        ? "cut-outline"
        : label === "Restaurantes"
          ? "restaurant-outline"
          : label === "Postres"
            ? "ice-cream-outline"
            : "grid-outline";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={{
        minWidth: 65,
        padding: 12,
        gap: 7,
        alignItems: "center",
        backgroundColor: active ? "#F15361" : "#F6F7FA",
        borderRadius: 16,
      }}
    >
      <Icon name={icon} size={20} color={active ? "#fff" : c.ink} />
      <Txt size={10} weight="medium" color={active ? "#fff" : c.ink}>
        {label}
      </Txt>
    </Pressable>
  );
}
export function Locations({
  locations,
}: {
  locations: BusinessDetail["locations"];
}) {
  const [error, setError] = useState("");
  async function navigate(address: string) {
    try {
      await Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      );
    } catch {
      setError("No pudimos abrir el mapa. Inténtalo de nuevo.");
    }
  }
  return (
    <View style={{ gap: 12 }}>
      {!!locations.length && (
        <View
          accessibilityLabel="Vista ilustrativa de las ubicaciones"
          style={{
            height: 166,
            borderRadius: 16,
            backgroundColor: "#EDF1F1",
            overflow: "hidden",
          }}
        >
          {[25, 65, 110, 150].map((top) => (
            <View
              key={top}
              style={{
                position: "absolute",
                top,
                left: -20,
                width: "120%",
                height: 3,
                backgroundColor: "#fff",
                transform: [{ rotate: "-7deg" }],
              }}
            />
          ))}
          {[45, 110, 190, 270].map((left) => (
            <View
              key={left}
              style={{
                position: "absolute",
                left,
                top: -20,
                width: 3,
                height: 220,
                backgroundColor: "#D8E1E0",
                transform: [{ rotate: "-10deg" }],
              }}
            />
          ))}
          <View
            style={{
              position: "absolute",
              right: 20,
              top: 15,
              width: 82,
              height: 37,
              backgroundColor: "#DBECD9",
              borderRadius: 16,
            }}
          />
          {locations.slice(0, 2).map((location, i) => (
            <Pressable
              key={location.id}
              accessibilityRole="button"
              onPress={() => navigate(location.address)}
              style={{
                position: "absolute",
                left: i ? "62%" : "23%",
                top: i ? 90 : 58,
                alignItems: "center",
              }}
            >
              <Icon name="location" size={35} />
              <View
                style={{
                  backgroundColor: "#fff",
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 12,
                }}
              >
                <Txt size={9}>{location.name}</Txt>
              </View>
            </Pressable>
          ))}
          <Txt
            size={9}
            color={c.muted}
            style={{ position: "absolute", bottom: 6, right: 10 }}
          >
            Vista de referencia · Abre el mapa para navegar
          </Txt>
        </View>
      )}
      {locations.map((location) => (
        <View key={location.id} style={[ui.card, { gap: 10 }]}>
          <View style={ui.row}>
            <Icon name="storefront-outline" />
            <Txt weight="bold" size={17} style={{ flex: 1 }}>
              {location.name}
            </Txt>
            {location.distance != null && (
              <Txt color={c.muted} size={11}>
                {location.distance} km
              </Txt>
            )}
          </View>
          <Txt color={c.muted} size={12}>
            {location.address}
          </Txt>
          {location.hours && (
            <Txt size={11} color="#008957">
              Horario · {location.hours}
            </Txt>
          )}
          <Button
            title="Cómo llegar"
            icon="navigate-outline"
            variant="secondary"
            onPress={() => navigate(location.address)}
          />
        </View>
      ))}
      {!!error && <Txt color="#B83149">{error}</Txt>}
    </View>
  );
}
