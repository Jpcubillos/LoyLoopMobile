import { useState } from "react";
import { Pressable, View } from "react-native";
import { BusinessDetail, nextCommerceTier } from "@/lib/loyloop-data";
import { StampCard } from "@/components/StampCard";
import { Icon, Pill, Progress, Txt, ui } from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";
import { IconMedallion } from "@/components/PremiumIcon";
export function MembershipProgressCard({
  business,
}: {
  business: BusinessDetail;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <View
      style={[
        ui.card,
        {
          gap: 14,
          shadowColor: c.primary,
          shadowOpacity: 0.09,
          shadowOffset: { width: 0, height: 5 },
          shadowRadius: 14,
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={`${expanded ? "Ocultar" : "Mostrar"} tarjeta de sellos`}
        onPress={() => setExpanded((v) => !v)}
        style={{ gap: 14 }}
      >
        <View style={ui.row}>
          <IconMedallion name="ribbon" size={46} tone="gold" />
          <View style={{ flex: 1 }}>
            <Txt size={11} color={c.cta}>
              Tu nivel en este comercio
            </Txt>
            <Txt weight="bold" size={16}>
              {business.tier}
            </Txt>
          </View>
          <Pill
            text={`${business.currentStamps}/${business.requiredStamps} sellos`}
            icon="checkmark-circle-outline"
          />
        </View>
        <View style={[ui.row, { justifyContent: "space-between" }]}>
          <Txt size={12} color={c.muted}>
            {business.points} pts de fidelidad
          </Txt>
          <Icon name={expanded ? "chevron-up" : "chevron-down"} size={18} />
        </View>
        {business.pointsToVip !== null && (
          <Progress
            value={
              business.points /
              Math.max(1, business.points + business.pointsToVip)
            }
          />
        )}
        <Txt size={11} color={c.muted}>
          {business.pointsToVip === null
            ? "Tus puntos de fidelidad se acumulan y no se gastan."
            : business.pointsToVip
              ? `Te faltan ${business.pointsToVip} pts para ${nextCommerceTier(business.points)}.`
              : "¡Disfruta todos los beneficios de tu nivel VIP!"}
        </Txt>
      </Pressable>
      {expanded && (
        <StampCard
          businessName={business.name}
          currentStamps={business.currentStamps}
          requiredStamps={business.requiredStamps}
          reward={business.stampReward}
        />
      )}
    </View>
  );
}
