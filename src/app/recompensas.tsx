import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RewardCard } from "@/components/RewardCard";
import { getRewards, type RewardSummary } from "@/lib/loyloop-data";

export default function RecompensasScreen() {
  const [rewards, setRewards] = useState<RewardSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRewards()
      .then(setRewards)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Recompensas</Text>
        <Text style={styles.subtitle}>Beneficios activos en tus comercios.</Text>

        {loading ? <ActivityIndicator color="#0d6efd" /> : null}

        {rewards.map((reward) => (
          <RewardCard
            key={reward.id}
            title={reward.title}
            description={`${reward.businessName} · ${reward.description}`}
            meta={reward.meta}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 110,
    gap: 14,
  },
  title: {
    color: "#071225",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },
});
