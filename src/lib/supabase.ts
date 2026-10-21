import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const isBrowser = Platform.OS === "web" && typeof window !== "undefined";
const shouldPersistSession = Platform.OS !== "web" || isBrowser;
const browserStorage = isBrowser
  ? {
      getItem: (key: string) => window.localStorage.getItem(key),
      setItem: (key: string, value: string) => window.localStorage.setItem(key, value),
      removeItem: (key: string) => window.localStorage.removeItem(key),
    }
  : undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabasePublishableKey);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabasePublishableKey || "placeholder-key",
  {
    auth: {
      storage: Platform.OS === "web" ? browserStorage : AsyncStorage,
      autoRefreshToken: shouldPersistSession,
      persistSession: shouldPersistSession,
      detectSessionInUrl: false,
    },
  }
);
