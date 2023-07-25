import { createContext, useState, useContext } from "react";

type AppContextType = {
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  magnifier: { x: number; y: number; color: string };
  setMagnifier: React.Dispatch<
    React.SetStateAction<{ x: number; y: number; color: string }>
  >;
  currentColor: string;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  palette: string[];
  setPalette: React.Dispatch<React.SetStateAction<string[]>>;
};

// Context
const AppContext = createContext<AppContextType>({
  color: "",
  setColor: () => undefined,
  magnifier: { x: 0, y: 0, color: "" },
  setMagnifier: () => undefined,
  currentColor: "No Color Picked",
  setCurrentColor: () => undefined,
  palette: [],
  setPalette: () => undefined,
});

// Provider
export default function AppProvider({ children }: { children: JSX.Element }) {
  // Here it's possible to set many states to use in the app
  const [color, setColor] = useState<string>("");
  const [magnifier, setMagnifier] = useState({ x: 0, y: 0, color: "" });
  const [currentColor, setCurrentColor] = useState<string>("No Color Picked");
  const [palette, setPalette] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        color,
        setColor,
        magnifier,
        setMagnifier,
        currentColor,
        setCurrentColor,
        palette,
        setPalette,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const {
    color,
    setColor,
    magnifier,
    setMagnifier,
    currentColor,
    setCurrentColor,
    palette,
    setPalette,
  } = useContext(AppContext);
  return {
    color,
    setColor,
    magnifier,
    setMagnifier,
    currentColor,
    setCurrentColor,
    palette,
    setPalette,
  };
}
