import { StyleSheet, Text, View } from "react-native";

type RewardCardProps = {
  title: string;
  description: string;
  meta?: string;
};

export function RewardCard({ title, description, meta }: RewardCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {meta ? <Text style={styles.meta}>{meta}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  title: {
    color: "#071225",
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    marginTop: 10,
    color: "#0d6efd",
    fontSize: 13,
    fontWeight: "800",
  },
});
