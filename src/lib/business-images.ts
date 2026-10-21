import type { ImageSourcePropType } from "react-native";
const images: Record<string, ImageSourcePropType> = {
  "cafe-central": require("../../assets/figma/ac44e.png"),
  "burger-house": require("../../assets/figma/2a7bb.png"),
  "heladeria-dulce": require("../../assets/figma/96eb5.png"),
  "barberia-norte": require("../../assets/figma/d7ccc.png"),
  "nispero-food": require("../../assets/figma/556cb.png"),
  "green-wash": require("../../assets/images/businesses/green-wash.png"),
};
export function getBusinessImage(
  slug: string,
): ImageSourcePropType | undefined {
  return images[slug];
}
