import { StyleSheet, Text, View } from "react-native";

type StampCardProps = {
  businessName: string;
  currentStamps: number;
  requiredStamps: number;
};

export function StampCard({ businessName, currentStamps, requiredStamps }: StampCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.kicker}>Tarjeta de sellos</Text>
      <Text style={styles.title}>{businessName}</Text>
      <Text style={styles.meta}>
        {currentStamps}/{requiredStamps} sellos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#fff7ed",
    padding: 16,
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
  meta: {
    marginTop: 4,
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
});
