import { Image } from "expo-image";
import { View } from "react-native";
import { artwork } from "@/constants/loyloop";
// Preserve the crop used by Figma's photo layer; never render the surrounding reference board.
export function CommerceHero({
  coffee = false,
  height = 280,
}: {
  coffee?: boolean;
  height?: number;
}) {
  return (
    <View style={{ height, overflow: "hidden", backgroundColor: "#D8C7B5" }}>
      <Image
        source={artwork.cafe}
        contentFit="fill"
        style={
          coffee
            ? {
                position: "absolute",
                width: "614.4%",
                height: "1204.71%",
                left: "-257.6%",
                top: "-230.59%",
              }
            : {
                position: "absolute",
                width: "887.86%",
                height: "922.52%",
                left: "-557.8%",
                top: "-171.17%",
              }
        }
      />
    </View>
  );
}
