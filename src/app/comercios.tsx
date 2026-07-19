import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBusinesses, type BusinessSummary } from "@/lib/loyloop-data";

export default function ComerciosScreen() {
  const [businesses, setBusinesses] = useState<BusinessSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusinesses()
      .then(setBusinesses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Comercios</Text>
        <Text style={styles.subtitle}>Explora los negocios donde puedes acumular beneficios.</Text>

        {loading ? <ActivityIndicator color="#0d6efd" /> : null}

        {businesses.map((business) => (
          <Link key={business.id} href={`/comercio/${business.slug}`} asChild>
            <Pressable style={styles.card}>
              <Text style={styles.name}>{business.name}</Text>
              <Text style={styles.category}>{business.category}</Text>
              <Text style={styles.description}>{business.description}</Text>
              <View style={styles.footer}>
                <Text style={styles.address}>{business.address}</Text>
                <Text style={styles.points}>{business.points} pts</Text>
              </View>
            </Pressable>
          </Link>
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  name: {
    color: "#071225",
    fontSize: 18,
    fontWeight: "900",
  },
  category: {
    marginTop: 2,
    color: "#0d6efd",
    fontWeight: "800",
  },
  description: {
    marginTop: 8,
    color: "#64748b",
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  address: {
    flex: 1,
    color: "#64748b",
    fontSize: 12,
  },
  points: {
    color: "#0d6efd",
    fontWeight: "900",
  },
});
