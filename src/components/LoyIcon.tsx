import { StyleSheet, Text, View } from "react-native";

export type LoyIconName =
  | "stamp"
  | "gift"
  | "percent"
  | "wallet"
  | "points"
  | "boost"
  | "badge"
  | "target"
  | "repeat"
  | "users"
  | "home"
  | "store"
  | "scan"
  | "user";

type LoyIconProps = {
  name: LoyIconName;
  color?: string;
  size?: number;
};

export function LoyIcon({ name, color = "#0d6efd", size = 24 }: LoyIconProps) {
  if (name === "gift") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.giftLid, { borderColor: color }]} />
        <View style={[styles.giftBody, { borderColor: color }]}>
          <View style={[styles.giftRibbon, { backgroundColor: color }]} />
        </View>
        <View style={[styles.giftBowLeft, { borderColor: color }]} />
        <View style={[styles.giftBowRight, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "stamp") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.stampHandle, { borderColor: color }]} />
        <View style={[styles.stampStem, { backgroundColor: color }]} />
        <View style={[styles.stampPlate, { borderColor: color }]} />
        <View style={[styles.stampBase, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "wallet") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.walletBody, { borderColor: color }]}>
          <View style={[styles.walletPocket, { borderColor: color }]} />
          <View style={[styles.walletDot, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === "points") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.coin, styles.coinBack, { borderColor: color }]} />
        <View style={[styles.coin, styles.coinFront, { borderColor: color }]}>
          <View style={[styles.coinCenter, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === "target") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.targetOuter, { borderColor: color }]}>
          <View style={[styles.targetMiddle, { borderColor: color }]}>
            <View style={[styles.targetDot, { backgroundColor: color }]} />
          </View>
        </View>
      </View>
    );
  }

  if (name === "badge") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.badgeStarCenter, { backgroundColor: color }]} />
        <View style={[styles.badgeStarRay, styles.badgeStarRayTop, { backgroundColor: color }]} />
        <View style={[styles.badgeStarRay, styles.badgeStarRayRight, { backgroundColor: color }]} />
        <View style={[styles.badgeStarRay, styles.badgeStarRayBottom, { backgroundColor: color }]} />
        <View style={[styles.badgeStarRay, styles.badgeStarRayLeft, { backgroundColor: color }]} />
        <View style={[styles.badgeSpark, styles.badgeSparkOne, { backgroundColor: color }]} />
        <View style={[styles.badgeSpark, styles.badgeSparkTwo, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === "home") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.homeRoof, { borderColor: color }]} />
        <View style={[styles.homeBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "store") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.storeAwning, { borderColor: color }]} />
        <View style={[styles.storeBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "scan") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.scanCorner, styles.scanTopLeft, { borderColor: color }]} />
        <View style={[styles.scanCorner, styles.scanTopRight, { borderColor: color }]} />
        <View style={[styles.scanCorner, styles.scanBottomLeft, { borderColor: color }]} />
        <View style={[styles.scanCorner, styles.scanBottomRight, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "user") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.userHead, { borderColor: color }]} />
        <View style={[styles.userBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "users") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.userSideHead, styles.userSideHeadLeft, { borderColor: color }]} />
        <View style={[styles.userSideHead, styles.userSideHeadRight, { borderColor: color }]} />
        <View style={[styles.userHead, { borderColor: color }]} />
        <View style={[styles.userSideBody, styles.userSideBodyLeft, { borderColor: color }]} />
        <View style={[styles.userSideBody, styles.userSideBodyRight, { borderColor: color }]} />
        <View style={[styles.userBody, { borderColor: color }]} />
      </View>
    );
  }

  if (name === "repeat") {
    return (
      <View style={[styles.iconBox, { width: size, height: size }]}>
        <View style={[styles.repeatTopLine, { backgroundColor: color }]} />
        <View style={[styles.repeatTopHead, { borderColor: color }]} />
        <View style={[styles.repeatBottomLine, { backgroundColor: color }]} />
        <View style={[styles.repeatBottomHead, { borderColor: color }]} />
      </View>
    );
  }

  const text = name === "percent" ? "%" : "2x";

  return (
    <View style={[styles.textIconBox, { width: size, height: size }]}>
      <Text style={[styles.textIcon, { color, fontSize: name === "boost" ? size * 0.38 : size * 0.56 }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  textIconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
  textIcon: {
    fontWeight: "900",
  },
  giftLid: {
    position: "absolute",
    top: 8,
    width: 18,
    height: 6,
    borderWidth: 2,
    borderRadius: 3,
  },
  giftBody: {
    position: "absolute",
    top: 14,
    width: 18,
    height: 14,
    borderWidth: 2,
    borderRadius: 4,
  },
  giftRibbon: {
    position: "absolute",
    left: 7,
    top: -2,
    width: 2,
    height: 14,
  },
  giftBowLeft: {
    position: "absolute",
    top: 2,
    left: 7,
    width: 7,
    height: 7,
    borderWidth: 2,
    borderRadius: 5,
  },
  giftBowRight: {
    position: "absolute",
    top: 2,
    right: 7,
    width: 7,
    height: 7,
    borderWidth: 2,
    borderRadius: 5,
  },
  stampHandle: {
    position: "absolute",
    top: 4,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderRadius: 5,
  },
  stampStem: {
    position: "absolute",
    top: 12,
    width: 3,
    height: 9,
    borderRadius: 2,
  },
  stampPlate: {
    position: "absolute",
    top: 19,
    width: 15,
    height: 6,
    borderWidth: 2,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  stampBase: {
    position: "absolute",
    top: 27,
    width: 20,
    height: 2,
    borderRadius: 2,
  },
  walletBody: {
    width: 22,
    height: 17,
    borderWidth: 2,
    borderRadius: 6,
  },
  walletPocket: {
    position: "absolute",
    right: -2,
    top: 4,
    width: 10,
    height: 8,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  walletDot: {
    position: "absolute",
    right: 3,
    top: 7,
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  coin: {
    position: "absolute",
    width: 17,
    height: 17,
    borderWidth: 2,
    borderRadius: 9,
  },
  coinBack: {
    right: 3,
    top: 4,
    opacity: 0.55,
  },
  coinFront: {
    left: 3,
    bottom: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  coinCenter: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  targetOuter: {
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 12,
  },
  targetMiddle: {
    width: 13,
    height: 13,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderRadius: 7,
  },
  targetDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  badgeStarCenter: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeStarRay: {
    position: "absolute",
    width: 4,
    height: 11,
    borderRadius: 2,
  },
  badgeStarRayTop: {
    top: 4,
  },
  badgeStarRayRight: {
    right: 6,
    transform: [{ rotate: "90deg" }],
  },
  badgeStarRayBottom: {
    bottom: 4,
  },
  badgeStarRayLeft: {
    left: 6,
    transform: [{ rotate: "90deg" }],
  },
  badgeSpark: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  badgeSparkOne: {
    top: 3,
    right: 3,
  },
  badgeSparkTwo: {
    left: 4,
    bottom: 5,
  },
  homeRoof: {
    position: "absolute",
    top: 5,
    width: 15,
    height: 15,
    borderLeftWidth: 2,
    borderTopWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
  homeBody: {
    position: "absolute",
    bottom: 4,
    width: 18,
    height: 15,
    borderWidth: 2,
    borderTopWidth: 0,
    borderRadius: 3,
  },
  storeAwning: {
    position: "absolute",
    top: 5,
    width: 22,
    height: 8,
    borderWidth: 2,
    borderRadius: 3,
  },
  storeBody: {
    position: "absolute",
    bottom: 4,
    width: 18,
    height: 15,
    borderWidth: 2,
    borderRadius: 3,
  },
  scanCorner: {
    position: "absolute",
    width: 8,
    height: 8,
  },
  scanTopLeft: {
    top: 5,
    left: 5,
    borderLeftWidth: 2,
    borderTopWidth: 2,
  },
  scanTopRight: {
    top: 5,
    right: 5,
    borderRightWidth: 2,
    borderTopWidth: 2,
  },
  scanBottomLeft: {
    bottom: 5,
    left: 5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
  },
  scanBottomRight: {
    right: 5,
    bottom: 5,
    borderRightWidth: 2,
    borderBottomWidth: 2,
  },
  userHead: {
    position: "absolute",
    top: 5,
    width: 8,
    height: 8,
    borderWidth: 2,
    borderRadius: 5,
  },
  userBody: {
    position: "absolute",
    bottom: 4,
    width: 18,
    height: 10,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  userSideHead: {
    position: "absolute",
    top: 8,
    width: 7,
    height: 7,
    borderWidth: 2,
    borderRadius: 5,
  },
  userSideHeadLeft: {
    left: 4,
  },
  userSideHeadRight: {
    right: 4,
  },
  userSideBody: {
    position: "absolute",
    bottom: 5,
    width: 12,
    height: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
  },
  userSideBodyLeft: {
    left: 2,
  },
  userSideBodyRight: {
    right: 2,
  },
  repeatTopLine: {
    position: "absolute",
    top: 9,
    right: 7,
    width: 14,
    height: 2,
    borderRadius: 2,
  },
  repeatTopHead: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
  repeatBottomLine: {
    position: "absolute",
    left: 7,
    bottom: 9,
    width: 14,
    height: 2,
    borderRadius: 2,
  },
  repeatBottomHead: {
    position: "absolute",
    left: 5,
    bottom: 5,
    width: 8,
    height: 8,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    transform: [{ rotate: "45deg" }],
  },
});
