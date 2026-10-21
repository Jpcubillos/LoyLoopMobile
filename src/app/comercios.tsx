import { useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { CommerceCard } from "@/components/CommerceCard";
import {
  CategoryChip,
  Locations,
  SortOrder,
  SortTrigger,
} from "@/components/CommerceControls";
import {
  Empty,
  Feedback,
  Header,
  Screen,
  SearchField,
  SectionHeader,
  Sheet,
  Tabs,
} from "@/components/ui/loyloop";
import { useResource } from "@/hooks/use-resource";
import { getBusinesses } from "@/lib/loyloop-data";
export default function ComerciosScreen() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<"Mis comercios" | "Explorar">(
    params.tab === "explorar" ? "Explorar" : "Mis comercios",
  );
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [sort, setSort] = useState<SortOrder>("Más usados");
  const [map, setMap] = useState(false);
  const { data = [], loading, error, reload } = useResource(getBusinesses);
  useEffect(() => {
    if (params.tab)
      setTab(params.tab === "explorar" ? "Explorar" : "Mis comercios");
  }, [params.tab]);
  const filtered = useMemo(() => {
    const normalize = (v: string) =>
      v
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    return data
      .filter(
        (b) =>
          (tab === "Explorar" || b.isMember) &&
          (category === "Todos" ||
            tab === "Mis comercios" ||
            b.category === category) &&
          normalize(`${b.name} ${b.category}`).includes(normalize(query)),
      )
      .sort((a, b) =>
        sort === "Nombre"
          ? a.name.localeCompare(b.name)
          : sort === "Mejor calificados"
            ? (b.rating ?? 0) - (a.rating ?? 0)
            : sort === "Más cercanos"
              ? (a.distance ?? Infinity) - (b.distance ?? Infinity)
              : b.points - a.points,
      );
  }, [data, tab, query, category, sort]);
  return (
    <Screen padding={16}>
      <Header title="Comercios" />
      <Tabs
        items={["Mis comercios", "Explorar"] as const}
        value={tab}
        onChange={setTab}
      />
      <SearchField
        value={query}
        onChange={setQuery}
        placeholder={
          tab === "Mis comercios"
            ? "Buscar en mis comercios…"
            : "Encuentra tu próximo lugar favorito…"
        }
      />
      <SortTrigger value={sort} onChange={setSort} />
      {tab === "Explorar" && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
        >
          {["Todos", ...new Set(data.map((b) => b.category))].map((label) => (
            <CategoryChip
              key={label}
              label={label}
              active={category === label}
              onPress={() => setCategory(label)}
            />
          ))}
        </ScrollView>
      )}
      <Feedback loading={loading} error={error} retry={reload} />
      {tab === "Explorar" && filtered.some((b) => b.sponsored) && (
        <View style={{ gap: 12 }}>
          <SectionHeader title="Comercios destacados" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {filtered
              .filter((b) => b.sponsored)
              .map((b) => (
                <CommerceCard key={b.id} business={b} variant="featured" />
              ))}
          </ScrollView>
        </View>
      )}
      <SectionHeader
        title={
          tab === "Mis comercios"
            ? `Tus comercios (${filtered.length})`
            : "Descubre nuevos lugares"
        }
        action="Ver mapa"
        onPress={() => setMap(true)}
      />
      <View style={{ gap: 10 }}>
        {filtered.map((b) => (
          <CommerceCard key={b.id} business={b} />
        ))}
      </View>
      {!loading && !error && !filtered.length && (
        <Empty
          title={
            query ? "No encontramos coincidencias" : "Aquí empieza tu comunidad"
          }
          description={
            query
              ? "Prueba con otro nombre o categoría."
              : "Explora un comercio o escanea su QR para unirte."
          }
        />
      )}
      <Sheet visible={map} title="Ubicaciones" onClose={() => setMap(false)}>
        <Locations
          locations={filtered
            .filter((b) => b.address)
            .map((b) => ({
              id: b.id,
              name: b.name,
              address: b.address,
              distance: b.distance,
            }))}
        />
      </Sheet>
    </Screen>
  );
}
