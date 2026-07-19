import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { RewardCard } from "@/components/RewardCard";
import { StampCard } from "@/components/StampCard";
import { getBusinessDetail, type BusinessDetail } from "@/lib/loyloop-data";

export default function ComercioDetalleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [detail, setDetail] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [claimCode, setClaimCode] = useState("");

  useEffect(() => {
    getBusinessDetail(slug ?? "cafe-central")
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [slug]);

  function createLocalClaim(action: string) {
    setClaimCode(`${action.toUpperCase()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`);
  }

  if (loading || !detail) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator color="#0d6efd" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>{detail.category}</Text>
          <Text style={styles.title}>{detail.name}</Text>
          <Text style={styles.subtitle}>{detail.address}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{detail.points}</Text>
            <Text style={styles.statLabel}>puntos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{detail.credit}</Text>
            <Text style={styles.statLabel}>credito</Text>
          </View>
        </View>

        <StampCard businessName={detail.name} currentStamps={detail.currentStamps} requiredStamps={detail.requiredStamps} />

        <View style={styles.actions}>
          <Pressable style={styles.secondaryButton} onPress={() => createLocalClaim("sello")}>
            <Text style={styles.secondaryText}>Sumar sello</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => createLocalClaim("redimir")}>
            <Text style={styles.primaryText}>Redimir</Text>
          </Pressable>
        </View>

        {claimCode ? (
          <View style={styles.claimBox}>
            <Text style={styles.claimLabel}>Codigo para validar en comercio</Text>
            <Text style={styles.claimCode}>{claimCode}</Text>
            <Text style={styles.claimHelp}>Luego cambiaremos esto por un QR real conectado al backend.</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Recompensas</Text>
        {detail.rewards.map((reward) => (
          <RewardCard key={reward.id} title={reward.title} description={reward.description} meta={reward.meta} />
        ))}

        <Text style={styles.sectionTitle}>Misiones</Text>
        {detail.missions.map((mission) => (
          <View key={mission.id} style={styles.missionCard}>
            <Text style={styles.missionTitle}>{mission.title}</Text>
            <Text style={styles.missionText}>{mission.description}</Text>
            <Text style={styles.missionPoints}>+{mission.points} pts</Text>
          </View>
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 110,
    gap: 14,
  },
  header: {
    borderRadius: 18,
    backgroundColor: "#0d6efd",
    padding: 18,
  },
  kicker: {
    color: "#dbeafe",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  title: {
    marginTop: 6,
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    color: "#dbeafe",
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  statValue: {
    color: "#071225",
    fontSize: 24,
    fontWeight: "900",
  },
  statLabel: {
    color: "#64748b",
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    paddingVertical: 14,
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "900",
    textAlign: "center",
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
  },
  secondaryText: {
    color: "#071225",
    fontWeight: "900",
    textAlign: "center",
  },
  claimBox: {
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    padding: 16,
  },
  claimLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  claimCode: {
    marginTop: 8,
    color: "#0d6efd",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },
  claimHelp: {
    marginTop: 6,
    color: "#1e40af",
    fontSize: 13,
    lineHeight: 18,
  },
  sectionTitle: {
    marginTop: 8,
    color: "#071225",
    fontSize: 18,
    fontWeight: "900",
  },
  missionCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  missionTitle: {
    color: "#071225",
    fontSize: 16,
    fontWeight: "900",
  },
  missionText: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 14,
  },
  missionPoints: {
    marginTop: 10,
    color: "#b45309",
    fontWeight: "900",
  },
});
