import { Redirect } from "expo-router";

// Preserve old links without creating another discovery screen.
export default function ExploreRedirect() {
  return (
    <Redirect href={{ pathname: "/comercios", params: { tab: "explorar" } }} />
  );
}
