import { Image } from "expo-image";
import { router } from "expo-router";
import QRGenerator from "qrcode";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import { artwork, palette as c } from "@/constants/loyloop";
import { createClaimRequest, ClaimAction } from "@/lib/claims";
import { readClaimStatus } from "@/lib/claim-status";
import { getClaimState } from "@/lib/loyalty-rules";
import { isDemo } from "@/lib/loyloop-data";
import {
  Button,
  Feedback,
  Icon,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";

export type ClaimInput = {
  title: string;
  businessSlug: string;
  businessName: string;
  action: ClaimAction;
  kind?: "benefit" | "reward" | "promotion";
  payload?: Record<string, unknown>;
};
export function LocalQrCode({
  value,
  size = 210,
}: {
  value: string;
  size?: number;
}) {
  const rows = useMemo(() => {
    const { modules } = QRGenerator.create(value, {
      errorCorrectionLevel: "M",
    });
    return Array.from({ length: modules.size }, (_, row) =>
      Array.from(
        { length: modules.size },
        (_, column) => !!modules.data[row * modules.size + column],
      ),
    );
  }, [value]);
  const cell = size / (rows.length + 8);
  return (
    <View
      accessible
      accessibilityLabel="Código QR para validación presencial"
      style={{
        padding: cell * 4,
        backgroundColor: "#fff",
        width: size,
        height: size,
      }}
    >
      {rows.map((row, i) => (
        <View key={i} style={{ flexDirection: "row" }}>
          {row.map((filled, j) => (
            <View
              key={j}
              style={{
                width: cell,
                height: cell,
                backgroundColor: filled ? "#101522" : "#fff",
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
export function SuccessState({
  title,
  description,
  onContinue,
}: {
  title: string;
  description: string;
  onContinue: () => void;
}) {
  return (
    <View style={{ alignItems: "center", gap: 22, paddingVertical: 28 }}>
      <Image
        source={artwork.success}
        contentFit="contain"
        style={{ width: 210, height: 170 }}
      />
      <Txt size={24} weight="bold" style={{ textAlign: "center" }}>
        {title}
      </Txt>
      <Txt color={c.muted} style={{ textAlign: "center" }}>
        {description}
      </Txt>
      <Button
        title="Continuar"
        onPress={onContinue}
        style={{ alignSelf: "stretch" }}
      />
    </View>
  );
}
export function QRClaimCard({
  input,
  onClose,
  onApproved,
}: {
  input: ClaimInput | null;
  onClose: () => void;
  onApproved?: () => void;
}) {
  const [request, setRequest] = useState<{ code: string; expiresAt: string }>();
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [attempt, setAttempt] = useState(0);
  const notified = useRef(false);
  useEffect(() => {
    let active = true;
    setRequest(undefined);
    setError("");
    setStatus("pending");
    notified.current = false;
    if (!input) return;
    setLoading(true);
    const operation = isDemo
      ? Promise.resolve({
          code: `DEMO-${input.businessSlug.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
          expiresAt: new Date(Date.now() + 300000).toISOString(),
        })
      : createClaimRequest({
          actionType: input.action,
          businessSlug: input.businessSlug,
          payload: input.payload,
        });
    operation
      .then((value) => {
        if (active) setRequest(value);
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof Error ? err.message : "No se pudo generar el QR.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [input, attempt]);
  useEffect(() => {
    if (!request || !input) return;
    let active = true,
      polling = false;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const poll = async () => {
      if (isDemo || polling) return;
      polling = true;
      try {
        const result = await readClaimStatus(request.code);
        if (active) {
          setStatus(result.status);
          setError("");
        }
      } catch {
        if (active)
          setError(
            "No pudimos consultar la validación. Seguiremos intentando.",
          );
      } finally {
        polling = false;
      }
    };
    void poll();
    const timer = setInterval(() => {
      if (status === "pending") void poll();
    }, 3500);
    return () => {
      active = false;
      clearInterval(timer);
      clearInterval(tick);
    };
  }, [request, input, status]);
  const state = request
    ? getClaimState(status, request.expiresAt, now)
    : "pending";
  useEffect(() => {
    if (state === "approved" && !notified.current) {
      notified.current = true;
      onApproved?.();
    }
  }, [state, onApproved]);
  const remaining = request
    ? Math.max(0, Math.ceil((Date.parse(request.expiresAt) - now) / 1000))
    : 0;
  const successTitle =
    input?.action === "stamp_add"
      ? "¡Sello aplicado!"
      : input?.kind === "promotion"
        ? "¡Promoción aplicada!"
        : input?.kind === "benefit"
          ? "¡Beneficio aplicado!"
          : "¡Recompensa aplicada!";
  return (
    <Sheet
      visible={!!input}
      title={state === "approved" ? "Confirmación" : "Listo para usar"}
      onClose={onClose}
    >
      {state === "approved" ? (
        <SuccessState
          title={successTitle}
          description={`${input?.title} · ${input?.businessName}`}
          onContinue={onClose}
        />
      ) : (
        <>
          <Txt color={c.muted} size={13} style={{ textAlign: "center" }}>
            Muestra este QR o el código al personal de {input?.businessName}{" "}
            para validar tu beneficio.
          </Txt>
          <Feedback
            loading={loading}
            error={error}
            retry={!request ? () => setAttempt((v) => v + 1) : undefined}
          />
          {!!error && !request && (
            <Button
              title="Iniciar sesión"
              variant="secondary"
              onPress={() => {
                onClose();
                router.push("/login");
              }}
            />
          )}
          {request && state === "pending" && (
            <>
              <View
                style={[
                  ui.card,
                  {
                    alignItems: "center",
                    alignSelf: "center",
                    padding: 10,
                    shadowColor: "#17213F",
                    shadowOpacity: 0.08,
                    shadowOffset: { width: 0, height: 4 },
                    shadowRadius: 12,
                  },
                ]}
              >
                <LocalQrCode value={request.code} />
                <Txt weight="bold">LoyLoop</Txt>
              </View>
              <Txt size={12} color={c.muted} style={{ textAlign: "center" }}>
                Código para ingresar manualmente
              </Txt>
              <View
                style={{
                  backgroundColor: "#F6F7FB",
                  padding: 18,
                  borderRadius: 16,
                }}
              >
                <Txt
                  selectable
                  weight="bold"
                  size={16}
                  style={{ letterSpacing: 2, textAlign: "center" }}
                >
                  {request.code}
                </Txt>
              </View>
              <View style={{ alignItems: "center", gap: 3 }}>
                <Txt color={c.cta} size={12}>
                  Este código expira en
                </Txt>
                <Txt color={c.cta} size={23} weight="bold">
                  {Math.floor(remaining / 60)}:
                  {String(remaining % 60).padStart(2, "0")}
                </Txt>
              </View>
              <View
                style={[
                  ui.row,
                  { padding: 14, borderRadius: 16, backgroundColor: "#FFF7DF" },
                ]}
              >
                <Icon name="information-circle-outline" color="#C38B21" />
                <Txt size={12} color={c.muted} style={{ flex: 1 }}>
                  {isDemo
                    ? "Demostración: este código no es válido en comercios."
                    : "Esperando la validación del comercio. Esta pantalla se actualizará automáticamente."}
                </Txt>
              </View>
            </>
          )}
          {state === "expired" && (
            <>
              <Txt color={c.cta}>
                Este código expiró. Genera uno nuevo para continuar.
              </Txt>
              <Button
                title="Generar otro QR"
                onPress={() => setAttempt((v) => v + 1)}
              />
            </>
          )}
          {state === "rejected" && (
            <Txt color={c.cta}>
              El comercio no aprobó este reclamo. Consulta al personal antes de
              volver a intentarlo.
            </Txt>
          )}
          {isDemo && request && state === "pending" && (
            <Button
              variant="secondary"
              title="Simular validación · demo"
              onPress={() => setStatus("approved")}
            />
          )}
          <Button title="Cerrar" variant="secondary" onPress={onClose} />
          {request && (
            <Txt size={10} color={c.muted}>
              Cerrar esta vista no anula el código. Solo puede validarse una vez
              y vence automáticamente.
            </Txt>
          )}
        </>
      )}
    </Sheet>
  );
}
