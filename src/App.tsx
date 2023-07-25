import AppProvider from "./context/provider";
import ColorPicker from "./components/ColorPicker";

function App() {
  return (
    <AppProvider>
      <div className="flex flex-col items-center justify-center h-screen max-w-6xl mx-auto scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-400 dark:scrollbar-thumb-neutral-700 dark:scrollbar-track-neutral-900">
        <header className="text-center">
          <div className="p-6 mb-4 text-4xl font-bold text-[#FDF7E5]">
            Press Ctrl + V to paste an image
          </div>
        </header>
        <div className="my-auto">
          <ColorPicker />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
