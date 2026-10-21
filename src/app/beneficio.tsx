import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import { CommerceHero } from "@/components/CommerceHero";
import { CommerceLogo } from "@/components/CommerceCard";
import { QRClaimCard, ClaimInput } from "@/components/QRClaimCard";
import {
  Button,
  Feedback,
  Header,
  Icon,
  Pill,
  Progress,
  Screen,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { palette as c } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getOffer } from "@/lib/loyloop-data";
export default function BenefitDetailScreen() {
  const { slug, id } = useLocalSearchParams<{ slug: string; id: string }>();
  const loader = useCallback(() => getOffer(slug, id), [slug, id]);
  const { data, error, loading, reload } = useResource(loader);
  const [claim, setClaim] = useState<ClaimInput | null>(null);
  const [terms, setTerms] = useState(false);
  const offer = data?.offer;
  return (
    <Screen tabs={false} padding={16}>
      <Header
        title={
          offer?.kind === "mission"
            ? "Detalle de misión"
            : offer?.kind === "promotion"
              ? "Detalle de promoción"
              : "Detalle del beneficio"
        }
        back
      />
      <Feedback loading={loading && !data} error={error} retry={reload} />
      {offer && data && (
        <>
          <View style={{ borderRadius: 22, overflow: "hidden" }}>
            <CommerceHero coffee height={178} />
          </View>
          <View style={ui.row}>
            <CommerceLogo business={data.detail} size={56} />
            <View style={{ flex: 1 }}>
              <Txt size={18} weight="bold">
                {offer.businessName}
              </Txt>
              <Txt size={12} color={c.muted}>
                {data.detail.category}
              </Txt>
            </View>
          </View>
          <Pill
            text={
              offer.kind === "promotion"
                ? "Promoción temporal"
                : offer.kind === "reward"
                  ? "Recompensa por tu fidelidad"
                  : offer.kind === "mission"
                    ? "Misión del comercio"
                    : "Beneficio disponible"
            }
          />
          <View style={[ui.card, ui.row, { paddingVertical: 22 }]}>
            <View
              style={{ padding: 12, backgroundColor: c.soft, borderRadius: 28 }}
            >
              <Icon
                name={
                  offer.kind === "mission"
                    ? "flag-outline"
                    : offer.kind === "promotion"
                      ? "pricetag-outline"
                      : "gift-outline"
                }
                size={25}
              />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Txt weight="bold" size={18}>
                {offer.title}
              </Txt>
              <Txt size={13} color={c.muted}>
                {offer.description}
              </Txt>
            </View>
          </View>
          {offer.kind === "mission" && (
            <View style={{ gap: 10 }}>
              <Txt weight="semibold">{offer.meta}</Txt>
              <Progress value={(offer.progress ?? 0) / (offer.goal || 1)} />
              <Txt color={c.muted} size={12}>
                {offer.progress ?? 0} / {offer.goal ?? 1} completadas. El
                comercio valida tu progreso.
              </Txt>
            </View>
          )}
          <View style={{ gap: 24, paddingVertical: 12 }}>
            <View style={ui.row}>
              <Icon name="calendar-outline" color="#52618B" />
              <Txt size={13} color={c.muted} style={{ flex: 1 }}>
                {offer.meta}
              </Txt>
            </View>
            <View style={ui.row}>
              <Icon name="storefront-outline" color="#52618B" />
              <Txt size={13} color={c.muted} style={{ flex: 1 }}>
                Validación presencial en {offer.businessName}
              </Txt>
            </View>
            {!!offer.requiredPoints && (
              <View style={ui.row}>
                <Icon name="ribbon-outline" color="#52618B" />
                <Txt size={13} color={c.muted} style={{ flex: 1 }}>
                  Tus puntos de fidelidad no se gastan al reclamar.
                </Txt>
              </View>
            )}
          </View>
          <Button
            title="Ver términos y condiciones"
            icon="document-text-outline"
            variant="ghost"
            onPress={() => setTerms(true)}
          />
          {!offer.isMember ? (
            <Button
              title="Únete para participar"
              onPress={() => router.push(`/comercio/${slug}`)}
            />
          ) : (
            offer.kind !== "mission" && (
              <Button
                title={
                  offer.available
                    ? offer.kind === "promotion"
                      ? "Reclamar promoción"
                      : offer.kind === "reward"
                        ? "Reclamar recompensa"
                        : "Reclamar beneficio"
                    : "Aún por desbloquear"
                }
                disabled={!offer.available || !offer.action}
                onPress={() => {
                  if (offer.action)
                    setClaim({
                      title: offer.title,
                      businessName: offer.businessName,
                      businessSlug: slug,
                      action: offer.action,
                      kind: offer.kind === "mission" ? "benefit" : offer.kind,
                      payload: offer.payload,
                    });
                }}
              />
            )
          )}
          {offer.available && !offer.action && (
            <Txt size={12} color={c.muted}>
              Consulta al comercio para aplicar este tipo de beneficio.
            </Txt>
          )}
          <Sheet
            visible={terms}
            title="Condiciones"
            onClose={() => setTerms(false)}
          >
            <Txt>{offer.description}</Txt>
            <Txt color={c.muted}>
              {offer.meta}. Requiere membresía activa y validación del comercio.
              Cada QR es de un solo uso.
            </Txt>
            {!!offer.requiredPoints && (
              <Txt color={c.muted}>
                Requiere {offer.requiredPoints} puntos de fidelidad. Los puntos
                se conservan.
              </Txt>
            )}
          </Sheet>
        </>
      )}
      <QRClaimCard
        input={claim}
        onClose={() => setClaim(null)}
        onApproved={reload}
      />
    </Screen>
  );
}
