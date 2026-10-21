import { View } from "react-native";
import { palette as c } from "@/constants/loyloop";
import { Icon, Txt, ui } from "@/components/ui/loyloop";
export function StampCard({
  businessName,
  currentStamps,
  requiredStamps,
  reward = "una recompensa",
}: {
  businessName: string;
  currentStamps: number;
  requiredStamps: number;
  reward?: string;
}) {
  return (
    <View
      style={{
        gap: 14,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: c.border,
      }}
    >
      <View style={[ui.row, { justifyContent: "space-between" }]}>
        <Txt weight="semibold" size={14}>
          Tu tarjeta de sellos
        </Txt>
        <Txt weight="bold" color={c.cta}>
          {currentStamps} / {requiredStamps}
        </Txt>
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {Array.from({ length: Math.min(requiredStamps, 30) }, (_, i) => (
          <View
            key={i}
            accessibilityLabel={`Sello ${i + 1}${i < currentStamps ? " completado" : " pendiente"}`}
            style={{
              width: "17%",
              aspectRatio: 1,
              borderRadius: 30,
              borderWidth: 1,
              borderStyle: i < currentStamps ? "solid" : "dashed",
              borderColor: i < currentStamps ? c.primary : "#DADDE5",
              backgroundColor: i < currentStamps ? c.soft : "#F7F8FA",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              name={i < currentStamps ? "checkmark" : "cafe-outline"}
              color={i < currentStamps ? c.cta : "#C4C8D3"}
            />
          </View>
        ))}
      </View>
      <Txt color={c.muted} size={12}>
        Al completar {requiredStamps} sellos obtienes {reward.toLowerCase()} en{" "}
        {businessName}.
      </Txt>
    </View>
  );
}
