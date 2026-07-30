import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import QRGenerator from "qrcode";

import { BottomTabs } from "@/components/BottomTabs";
import { LoyIcon, type LoyIconName } from "@/components/LoyIcon";
import { StampCard } from "@/components/StampCard";
import { createClaimRequest, type ClaimAction } from "@/lib/claims";
import { getBusinessDetail, type BusinessDetail } from "@/lib/loyloop-data";
import { getBusinessImage } from "@/lib/business-images";

type ClaimState = {
  title: string;
  description: string;
  code?: string;
  error?: string;
  loading?: boolean;
} | null;

function LocalQrCode({ value, size = 210 }: { value: string; size?: number }) {
  const rows = useMemo(() => {
    const qr = QRGenerator.create(value, { errorCorrectionLevel: "M" });
    const modules = qr.modules;
    const width = modules.size;
    const data = Array.prototype.slice.call(modules.data, 0) as boolean[];

    return Array.from({ length: width }, (_, rowIndex) =>
      data.slice(rowIndex * width, rowIndex * width + width),
    );
  }, [value]);

  const quietZone = 4;
  const moduleCount = rows.length + quietZone * 2;
  const cellSize = size / moduleCount;

  return (
    <View style={[styles.qrFrame, { width: size, height: size, padding: cellSize * quietZone }]}>
      {rows.map((row, rowIndex) => (
        <View key={`qr-row-${rowIndex}`} style={styles.qrRow}>
          {row.map((filled, columnIndex) => (
            <View
              key={`qr-cell-${rowIndex}-${columnIndex}`}
              style={[
                styles.qrCell,
                {
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: filled ? "#0d6efd" : "#ffffff",
                },
              ]}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

function BenefitIcon({ icon, tone = "blue" }: { icon: LoyIconName; tone?: "blue" | "green" | "amber" | "slate" }) {
  const iconColor = tone === "green" ? "#059669" : tone === "amber" ? "#b45309" : tone === "slate" ? "#334155" : "#0d6efd";

  return (
    <View style={[styles.benefitIcon, styles[`${tone}Icon`]]}>
      <LoyIcon name={icon} color={iconColor} size={28} />
    </View>
  );
}

function getRewardIcon(type: string): { icon: LoyIconName; tone: "blue" | "green" | "amber" | "slate" } {
  if (type === "discount") return { icon: "percent", tone: "blue" };
  if (type === "credit") return { icon: "wallet", tone: "green" };
  if (type === "points") return { icon: "points", tone: "amber" };
  return { icon: "gift", tone: "green" };
}

function getMissionIcon(mission: BusinessDetail["missions"][number]): LoyIconName {
  const text = `${mission.title} ${mission.description}`.toLowerCase();

  if (text.includes("invita") || text.includes("amigo") || text.includes("refer")) return "users";
  if (text.includes("minipay") || text.includes("paga") || text.includes("pago")) return "wallet";
  if (text.includes("compra") || text.includes("visita") || text.includes("veces")) return "repeat";
  if (text.includes("review") || text.includes("resena") || text.includes("opinion")) return "target";

  return "target";
}

export default function ComercioDetalleScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [detail, setDetail] = useState<BusinessDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [claim, setClaim] = useState<ClaimState>(null);

  useEffect(() => {
    getBusinessDetail(slug ?? "cafe-central")
      .then(setDetail)
      .finally(() => setLoading(false));
  }, [slug]);

  async function openClaim(title: string, description: string, actionType: ClaimAction, payload: Record<string, unknown> = {}) {
    setClaim({
      title,
      description,
      loading: true,
    });

    try {
      const request = await createClaimRequest({
        actionType,
        businessSlug: detail?.slug ?? "cafe-central",
        payload,
      });

      setClaim({
        title,
        description,
        code: request.code,
      });
    } catch (error) {
      setClaim({
        title,
        description,
        error: error instanceof Error ? error.message : "No se pudo generar el QR.",
      });
    }
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
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            {getBusinessImage(detail.slug) ? (
              <Image source={getBusinessImage(detail.slug)} style={styles.logoImage} />
            ) : (
              <Text style={styles.logoText}>{detail.name.slice(0, 2).toUpperCase()}</Text>
            )}
          </View>
          <View style={styles.heroTextWrap}>
            <Text style={styles.heroTitle}>{detail.name}</Text>
            <Text style={styles.heroSubtitle}>{detail.category}</Text>
            <Text style={styles.heroAddress}>{detail.address}</Text>
          </View>
        </View>

        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>Nivel actual</Text>
              <Text style={styles.levelTitle}>{detail.tier}</Text>
            </View>
            <BenefitIcon icon="badge" tone="amber" />
          </View>
          <View style={styles.levelTrack}>
            <View style={[styles.levelFill, { width: `${Math.min(88, Math.max(24, 100 - detail.pointsToVip / 2))}%` }]} />
          </View>
          <Text style={styles.levelHelp}>Te faltan {detail.pointsToVip} puntos para llegar a VIP.</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.pointsCard}>
            <View style={styles.statIconBadge}>
              <LoyIcon name="points" color="#b45309" size={30} />
            </View>
            <Text style={styles.pointsValue}>{detail.points}</Text>
            <Text style={styles.pointsLabel}>puntos</Text>
          </View>
          <View style={styles.creditCard}>
            <View style={styles.statIconBadgeGreen}>
              <LoyIcon name="wallet" color="#059669" size={30} />
            </View>
            <Text style={styles.creditValue}>{detail.credit}</Text>
            <Text style={styles.creditLabel}>saldo a favor</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recompensas activas</Text>
        <StampCard businessName={detail.name} currentStamps={detail.currentStamps} requiredStamps={detail.requiredStamps} />

        <View style={styles.actions}>
          <Pressable
            style={styles.secondaryButton}
            onPress={() => openClaim("Sumar sello", "Muestrale este QR al comercio despues de confirmar tu compra.", "stamp_add")}
          >
            <Text style={styles.secondaryText}>Sumar sello</Text>
          </Pressable>
          <Pressable
            style={[styles.primaryButton, detail.currentStamps < detail.requiredStamps && styles.disabledButton]}
            onPress={() => openClaim("Redimir sello", "El comercio valida este QR y reclama tu recompensa.", "stamp_redeem")}
            disabled={detail.currentStamps < detail.requiredStamps}
          >
            <Text style={[styles.primaryText, detail.currentStamps < detail.requiredStamps && styles.disabledText]}>
              {detail.currentStamps < detail.requiredStamps ? "Redimir bloqueado" : "Redimir"}
            </Text>
          </Pressable>
        </View>

        {detail.currentStamps < detail.requiredStamps ? (
          <Text style={styles.redeemHelp}>Podras redimir cuando completes los {detail.requiredStamps} sellos.</Text>
        ) : null}

        {detail.rewards
          .filter((reward) => reward.title !== "Cafe gratis con 10 sellos")
          .map((reward) => (
            <Pressable
              key={reward.id}
              style={styles.benefitCard}
              onPress={() => openClaim(
                reward.title,
                reward.description,
                reward.type === "discount" ? "discount_redeem" : reward.type === "points" ? "points_boost" : "discount_redeem",
                {
                  rewardId: reward.id,
                  rewardName: reward.title,
                  rewardType: reward.type,
                }
              )}
            >
              <BenefitIcon {...getRewardIcon(reward.type)} />
              <View style={styles.benefitBody}>
                <Text style={styles.benefitTitle}>{reward.title}</Text>
                <Text style={styles.benefitText}>{reward.description}</Text>
              </View>
              <Text style={styles.benefitMeta}>{reward.meta}</Text>
            </Pressable>
          ))}

        {detail.campaigns.map((campaign) => (
          <Pressable
            key={campaign.id}
            style={styles.benefitCard}
            onPress={() => openClaim(campaign.title, campaign.description, campaign.action, campaign.payload)}
          >
            <BenefitIcon icon={campaign.action === "points_boost" ? "boost" : "percent"} tone={campaign.action === "points_boost" ? "amber" : "blue"} />
            <View style={styles.benefitBody}>
              <Text style={styles.benefitTitle}>{campaign.title}</Text>
              <Text style={styles.benefitText}>{campaign.description}</Text>
            </View>
            <Text style={styles.benefitMeta}>{campaign.meta}</Text>
          </Pressable>
        ))}

        <Text style={styles.sectionTitle}>Misiones activas</Text>
        {detail.missions.map((mission, index) => (
          <Pressable
            key={mission.id}
            style={({ pressed }) => [styles.missionCard, pressed && styles.pressedCard]}
            onPress={() =>
              openClaim(
                mission.title,
                `El comercio escanea este QR para validar tu avance y sumar ${mission.points} puntos.`,
                "points_boost",
                {
                  missionId: mission.id,
                  missionName: mission.title,
                  campaignName: mission.title,
                  rewardPoints: mission.points,
                },
              )
            }
          >
            <BenefitIcon icon={getMissionIcon(mission)} tone="slate" />
            <View style={styles.benefitBody}>
              <Text style={styles.benefitTitle}>{mission.title}</Text>
              <Text style={styles.benefitText}>{mission.description}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: index === 0 ? "50%" : "10%" }]} />
              </View>
            </View>
            <Text style={styles.missionPoints}>+{mission.points} pts</Text>
          </Pressable>
        ))}
      </ScrollView>
      <BottomTabs />

      <Modal visible={Boolean(claim)} transparent animationType="slide" onRequestClose={() => setClaim(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalKicker}>{detail.name}</Text>
                <Text style={styles.modalTitle}>{claim?.title}</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={() => setClaim(null)}>
                <Text style={styles.closeText}>X</Text>
              </Pressable>
            </View>
            <Text style={styles.modalDescription}>{claim?.description}</Text>
            <View style={styles.qrBox}>
              {claim?.loading ? (
                <ActivityIndicator color="#0d6efd" />
              ) : claim?.code ? (
                <LocalQrCode value={claim.code} size={210} />
              ) : (
                <Text style={styles.qrError}>{claim?.error ?? "No se pudo generar el QR."}</Text>
              )}
            </View>
            <View style={styles.codeBox}>
              <Text style={styles.codeLabel}>Codigo de validacion</Text>
              <Text style={styles.codeText}>{claim?.code ?? "..."}</Text>
            </View>
            <Text style={styles.modalHelp}>Muestrale este QR al comercio. Se valida desde el panel del negocio.</Text>
            <Pressable style={styles.primaryButtonFull} onPress={() => setClaim(null)}>
              <Text style={styles.primaryText}>Listo</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e5e7eb",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  content: {
    paddingBottom: 110,
    backgroundColor: "#f8fafc",
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#0d6efd",
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 28,
  },
  logo: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 29,
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.35)",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  logoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 29,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "900",
  },
  heroSubtitle: {
    marginTop: 2,
    color: "#dbeafe",
    fontSize: 14,
    fontWeight: "800",
  },
  heroAddress: {
    marginTop: 4,
    color: "#dbeafe",
    fontSize: 12,
  },
  levelCard: {
    marginHorizontal: 20,
    marginTop: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  levelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  levelLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "900",
  },
  levelTitle: {
    marginTop: 6,
    color: "#071225",
    fontSize: 26,
    fontWeight: "900",
  },
  levelTrack: {
    height: 8,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    marginTop: 18,
  },
  levelFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#0d6efd",
  },
  levelHelp: {
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 14,
  },
  pointsCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fde68a",
    backgroundColor: "#fffbeb",
    padding: 16,
  },
  creditCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    backgroundColor: "#ecfdf5",
    padding: 16,
  },
  statIconBadge: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#fef3c7",
  },
  statIconBadgeGreen: {
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#d1fae5",
  },
  pointsValue: {
    marginTop: 14,
    color: "#78350f",
    fontSize: 32,
    fontWeight: "900",
  },
  pointsLabel: {
    color: "#92400e",
    fontSize: 12,
  },
  creditValue: {
    marginTop: 14,
    color: "#059669",
    fontSize: 30,
    fontWeight: "900",
  },
  creditLabel: {
    color: "#047857",
    fontSize: 12,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
    color: "#071225",
    fontSize: 18,
    fontWeight: "900",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: "#0d6efd",
    paddingVertical: 14,
  },
  disabledButton: {
    backgroundColor: "#e2e8f0",
  },
  disabledText: {
    color: "#64748b",
  },
  primaryButtonFull: {
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
  redeemHelp: {
    marginHorizontal: 20,
    marginTop: 10,
    color: "#64748b",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 14,
  },
  missionCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#dbe4f0",
    backgroundColor: "#ffffff",
    padding: 14,
  },
  pressedCard: {
    borderColor: "#93c5fd",
    backgroundColor: "#f8fbff",
  },
  benefitIcon: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  blueIcon: {
    backgroundColor: "#eff6ff",
  },
  greenIcon: {
    backgroundColor: "#ecfdf5",
  },
  amberIcon: {
    backgroundColor: "#fffbeb",
  },
  slateIcon: {
    backgroundColor: "#f1f5f9",
  },
  benefitBody: {
    flex: 1,
  },
  benefitTitle: {
    color: "#071225",
    fontSize: 15,
    fontWeight: "900",
  },
  benefitText: {
    marginTop: 3,
    color: "#64748b",
    fontSize: 13,
    lineHeight: 18,
  },
  benefitMeta: {
    color: "#0d6efd",
    fontSize: 12,
    fontWeight: "900",
  },
  missionPoints: {
    color: "#b45309",
    fontSize: 12,
    fontWeight: "900",
  },
  progressTrack: {
    height: 6,
    overflow: "hidden",
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    marginTop: 10,
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: "#0d6efd",
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(15,23,42,0.45)",
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#ffffff",
    padding: 20,
    gap: 14,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  modalKicker: {
    color: "#0d6efd",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  modalTitle: {
    marginTop: 4,
    color: "#071225",
    fontSize: 24,
    fontWeight: "900",
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
  },
  closeText: {
    color: "#64748b",
    fontWeight: "900",
  },
  modalDescription: {
    color: "#64748b",
    fontSize: 15,
    lineHeight: 22,
  },
  qrBox: {
    height: 242,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#dbeafe",
  },
  qrFrame: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    backgroundColor: "#ffffff",
  },
  qrRow: {
    flexDirection: "row",
  },
  qrCell: {
    flexShrink: 0,
  },
  qrError: {
    color: "#dc2626",
    fontSize: 14,
    fontWeight: "900",
    paddingHorizontal: 20,
    textAlign: "center",
  },
  codeBox: {
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    padding: 14,
  },
  codeLabel: {
    color: "#64748b",
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
  },
  codeText: {
    marginTop: 8,
    color: "#071225",
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
  },
  modalHelp: {
    color: "#047857",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});
