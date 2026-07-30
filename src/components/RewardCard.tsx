import { StyleSheet, Text, View } from "react-native";
import { LoyIcon, type LoyIconName } from "@/components/LoyIcon";

type RewardCardProps = {
  title: string;
  description: string;
  meta?: string;
  icon?: LoyIconName;
  tone?: "blue" | "green" | "amber";
};

export function RewardCard({ title, description, meta, icon = "gift", tone = "blue" }: RewardCardProps) {
  const color = tone === "green" ? "#059669" : tone === "amber" ? "#b45309" : "#0d6efd";

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.iconBadge, tone === "green" ? styles.greenBadge : tone === "amber" ? styles.amberBadge : styles.blueBadge]}>
          <LoyIcon name={icon} color={color} size={28} />
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {meta ? <Text style={[styles.meta, { color }]}>{meta}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  blueBadge: {
    backgroundColor: "#eff6ff",
  },
  greenBadge: {
    backgroundColor: "#ecfdf5",
  },
  amberBadge: {
    backgroundColor: "#fffbeb",
  },
  body: {
    flex: 1,
  },
  title: {
    color: "#071225",
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },
  meta: {
    fontSize: 12,
    fontWeight: "900",
  },
});
