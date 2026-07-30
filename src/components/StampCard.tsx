import { StyleSheet, Text, View } from "react-native";
import { LoyIcon } from "@/components/LoyIcon";

type StampCardProps = {
  businessName: string;
  currentStamps: number;
  requiredStamps: number;
};

export function StampCard({ businessName, currentStamps, requiredStamps }: StampCardProps) {
  const stamps = Array.from({ length: requiredStamps }, (_, index) => index + 1);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Tarjeta de sellos</Text>
          <Text style={styles.title}>{businessName}</Text>
        </View>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{currentStamps}/{requiredStamps}</Text>
        </View>
      </View>

      <View style={styles.stampGrid}>
        {stamps.map((stamp) => {
          const filled = stamp <= currentStamps;

          return (
            <View key={stamp} style={[styles.stamp, filled ? styles.stampFilled : styles.stampEmpty]}>
              {filled ? (
                <LoyIcon name="stamp" color="#b45309" size={30} />
              ) : (
                <Text style={styles.stampTextEmpty}>{stamp}</Text>
              )}
            </View>
          );
        })}
      </View>

      <Text style={styles.meta}>Completa {requiredStamps} compras registradas y reclama en caja.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#facc15",
    backgroundColor: "#fff7ed",
    padding: 18,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  kicker: {
    color: "#b45309",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 8,
    color: "#071225",
    fontSize: 20,
    fontWeight: "900",
  },
  counter: {
    borderRadius: 999,
    backgroundColor: "#fef3c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  counterText: {
    color: "#92400e",
    fontSize: 14,
    fontWeight: "900",
  },
  stampGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 18,
  },
  stamp: {
    width: 54,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 27,
    borderWidth: 2,
  },
  stampFilled: {
    borderColor: "#f59e0b",
    backgroundColor: "#fef3c7",
  },
  stampEmpty: {
    borderColor: "#cbd5e1",
    backgroundColor: "#f8fafc",
  },
  stampTextEmpty: {
    color: "#cbd5e1",
    fontSize: 14,
    fontWeight: "900",
  },
  meta: {
    marginTop: 16,
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
});
