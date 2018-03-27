import { Platform } from "react-native";

export const getPlatformIconName = (name: string) =>
  Platform.select({ android: `md-${name}`, ios: `ios-${name}` });
