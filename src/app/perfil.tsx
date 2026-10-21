import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { useAppearance } from "@/components/AppearanceProvider";
import {
  BrandCard,
  Button,
  Empty,
  Feedback,
  Header,
  Icon,
  Pill,
  Progress,
  Screen,
  SectionHeader,
  SettingRow,
  Sheet,
  Txt,
  ui,
} from "@/components/ui/loyloop";
import { artwork, palette as c } from "@/constants/loyloop";
import { useResource } from "@/hooks/use-resource";
import { signOut } from "@/lib/auth";
import { getUserProfile, isDemo } from "@/lib/loyloop-data";
import { IconMedallion, PremiumIcon } from "@/components/PremiumIcon";
export default function PerfilScreen() {
  const params = useLocalSearchParams<{ panel?: string }>();
  const { data: profile, error, loading, reload } = useResource(getUserProfile);
  const [panel, setPanel] = useState(params.panel || "");
  const [actionError, setActionError] = useState("");
  const { appearance, setAppearance } = useAppearance();
  async function logout() {
    const { error } = await signOut();
    if (error) {
      setActionError(error.message);
      return;
    }
    setPanel("");
    router.replace("/login");
  }
  return (
    <Screen>
      <Header title="Mi perfil" subtitle="Tu información y configuración." />
      <Feedback loading={loading} error={error || actionError} retry={reload} />
      {profile && (
        <BrandCard style={{ padding: 24, gap: 18 }}>
          <Txt color="#fff" weight="semibold">
            Tu LoyLevel ✦
          </Txt>
          <View style={ui.row}>
            <Image
              source={artwork.gold}
              contentFit="contain"
              style={{ width: 54, height: 58 }}
            />
            <View>
              <Txt color={c.gold} size={29} weight="bold">
                {profile.level}
              </Txt>
              <Txt size={11} color="#fff">
                Nivel global LoyLoop
              </Txt>
            </View>
          </View>
          <View>
            <View style={[ui.row, { alignItems: "baseline" }]}>
              <Txt size={34} weight="bold" color={c.gold}>
                {profile.xp.toLocaleString("es-CO")}
              </Txt>
              <Txt color="#FFFFFFBB" size={16} weight="bold">
                XP
              </Txt>
            </View>
            <Txt color="#fff" size={10}>
              ★ Puntos de experiencia LoyLoop
            </Txt>
          </View>
          <View style={{ gap: 8 }}>
            <Progress value={profile.xp / profile.nextXp} gold />
            <View style={[ui.row, { justifyContent: "space-between" }]}>
              <Txt color="#fff" size={10}>
                {profile.xp.toLocaleString("es-CO")} /{" "}
                {profile.nextXp.toLocaleString("es-CO")} XP
              </Txt>
              <Txt color="#fff" size={10}>
                {profile.nextXp - profile.xp} XP para {profile.nextLevel}
              </Txt>
            </View>
          </View>
          <View style={[ui.row, { gap: 40, paddingTop: 10 }]}>
            <View style={{ gap: 6 }}>
              <PremiumIcon kind="gift" size={42} />
              <Txt color="#fff" size={12} weight="semibold">
                Beneficios
              </Txt>
              <Txt color="#fff" size={11}>
                {profile.globalBenefits.length} activos
              </Txt>
            </View>
            <View style={{ gap: 6 }}>
              <IconMedallion name="trophy" size={42} tone="gold" />
              <Txt color="#fff" size={12} weight="semibold">
                Insignias
              </Txt>
              <Txt color="#fff" size={11}>
                {profile.badges.length} obtenidas
              </Txt>
            </View>
          </View>
          <Button
            title="Ver mi progreso y beneficios   ›"
            onPress={() => setPanel("nivel")}
            style={{
              backgroundColor: "#FFFFFF18",
              borderWidth: 1,
              borderColor: "#FFFFFF50",
            }}
          />
        </BrandCard>
      )}
      <View>
        <SectionHeader title="Mi cuenta" />
        <SettingRow
          icon="person-outline"
          label="Información personal"
          onPress={() => router.push("/informacion-personal")}
        />
        <SettingRow
          icon="moon-outline"
          label="Tema"
          value={appearance}
          onPress={() => setPanel("tema")}
        />
        <SettingRow
          icon="log-out-outline"
          label={
            profile?.authenticated || isDemo
              ? "Cerrar sesión"
              : "Iniciar sesión"
          }
          onPress={() =>
            profile?.authenticated ? setPanel("salir") : router.push("/login")
          }
        />
      </View>
      <View>
        <SectionHeader title="Ayuda" />
        <SettingRow
          icon="help-circle-outline"
          label="Centro de ayuda"
          onPress={() => setPanel("ayuda")}
        />
        <SettingRow
          icon="document-text-outline"
          label="Términos y privacidad"
          onPress={() => setPanel("legal")}
        />
      </View>
      <Txt size={11} color={c.muted} style={{ textAlign: "center" }}>
        LoyLoop · Descubre. Disfruta. Vuelve.
      </Txt>
      <Sheet
        visible={!!panel}
        title={
          panel === "nivel"
            ? "Tu LoyLevel global"
            : panel === "tema"
              ? "Elige tu tema"
              : panel === "salir"
                ? "Cerrar sesión"
                : panel === "ayuda"
                  ? "Centro de ayuda"
                  : "Términos y privacidad"
        }
        onClose={() => setPanel("")}
      >
        {panel === "nivel" && profile && (
          <>
            <Pill text={`LoyLoop ${profile.level}`} icon="ribbon-outline" />
            <Txt color={c.muted}>
              Tu progreso global es independiente del nivel que tienes en cada
              comercio.
            </Txt>
            <SectionHeader title="Beneficios de tu nivel" />
            {profile.globalBenefits.map((item) => (
              <View key={item} style={ui.row}>
                <Icon name="gift-outline" />
                <Txt style={{ flex: 1 }}>{item}</Txt>
              </View>
            ))}
            {!profile.globalBenefits.length && (
              <Empty
                title="Sigue descubriendo"
                description="Los beneficios globales se mostrarán aquí cuando estén disponibles para tu cuenta."
              />
            )}
            <SectionHeader title="Tus insignias" />
            <View style={[ui.row, { flexWrap: "wrap" }]}>
              {profile.badges.map((b) => (
                <Pill key={b} text={b} icon="ribbon-outline" />
              ))}
            </View>
          </>
        )}
        {panel === "tema" && (
          <>
            <SettingRow
              icon="sunny-outline"
              label="Claro"
              value="Fondo blanco"
              onPress={() => {
                setAppearance("Claro");
                setPanel("");
              }}
            />
            <SettingRow
              icon="partly-sunny-outline"
              label="Suave"
              value="Fondo gris muy claro"
              onPress={() => {
                setAppearance("Suave");
                setPanel("");
              }}
            />
          </>
        )}
        {panel === "salir" && (
          <>
            <Txt>
              Podrás volver a entrar para consultar tus comercios y tu progreso.
            </Txt>
            <Button title="Cerrar sesión" onPress={logout} />
            <Button
              title="Cancelar"
              variant="secondary"
              onPress={() => setPanel("")}
            />
          </>
        )}
        {panel === "ayuda" && (
          <>
            <Txt weight="bold">¿Cómo me uno a un comercio?</Txt>
            <Txt>
              Busca el comercio en Explorar o escanea su QR físico. Abre su
              detalle y pulsa “Unirme al comercio”.
            </Txt>
            <Txt weight="bold">¿Cómo uso mis beneficios?</Txt>
            <Txt>
              Abre el beneficio, pulsa Reclamar y muestra el QR al personal.
              También pueden ingresar el código manualmente.
            </Txt>
            <Txt weight="bold">¿Mis puntos se gastan?</Txt>
            <Txt>
              No. Los puntos de fidelidad te ayudan a subir de nivel dentro de
              cada comercio. Los sellos avanzan hacia una recompensa específica.
            </Txt>
          </>
        )}
        {panel === "legal" && (
          <>
            <Txt>
              Consulta las condiciones de cada beneficio antes de reclamarlo. El
              comercio valida su aplicación presencial.
            </Txt>
            <Txt color={c.muted}>
              Los documentos legales de LoyLoop aún no se han publicado en esta
              aplicación. Las condiciones y la política de privacidad oficiales
              deben estar disponibles antes de su lanzamiento.
            </Txt>
          </>
        )}
      </Sheet>
    </Screen>
  );
}
