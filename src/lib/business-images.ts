import type { ImageSourcePropType } from "react-native";

const businessImages: Record<string, ImageSourcePropType> = {
  "cafe-central": require("../../assets/images/businesses/cafe-central.png"),
  "barberia-norte": require("../../assets/images/businesses/barberia-norte.png"),
  "green-wash": require("../../assets/images/businesses/green-wash.png"),
};

export function getBusinessImage(slug: string): ImageSourcePropType | undefined {
  return businessImages[slug];
}
