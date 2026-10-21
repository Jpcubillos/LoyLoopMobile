import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
type Appearance = "Claro" | "Suave";
const Context = createContext({
  appearance: "Claro" as Appearance,
  setAppearance: (_: Appearance) => {},
});
export function AppearanceProvider({ children }: PropsWithChildren) {
  const [appearance, setValue] = useState<Appearance>("Claro");
  useEffect(() => {
    AsyncStorage.getItem("loyloop.appearance").then((v) => {
      if (v === "Claro" || v === "Suave") setValue(v);
    });
  }, []);
  function setAppearance(value: Appearance) {
    setValue(value);
    void AsyncStorage.setItem("loyloop.appearance", value);
  }
  return (
    <Context.Provider value={{ appearance, setAppearance }}>
      {children}
    </Context.Provider>
  );
}
export const useAppearance = () => useContext(Context);
