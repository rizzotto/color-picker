import { ChangeEvent, useEffect, useRef, useState } from "react";
import "./Magnifier.css";
import { getContrast } from "polished";
import { BsFillGearFill } from "react-icons/bs";
import { ColorExtractor } from "react-color-extractor";
import toast, { Toaster } from "react-hot-toast";
import useEyeDropper from "use-eye-dropper";

function App() {
  const [img, setImg] = useState<string>();
  const [currentColor, setCurrentColor] = useState<string>("No Color");
  const [palette, setPalette] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isFirstRender = currentColor === "No Color";
  const lightContrast = !isFirstRender && getContrast(currentColor, "#FFFF");
  const darkContrast = !isFirstRender && getContrast(currentColor, "#212121");

  const foregroundColor = lightContrast >= darkContrast ? "#FFFF" : "#212121";

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          if (item.type.startsWith("image/")) {
            const blob = item.getAsFile();
            if (blob) {
              const imageUrl = URL.createObjectURL(blob);
              setImg(imageUrl);
              break;
            }
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const copyToClipboardButton = (text: string) => {
    const lightContrast = getContrast(text, "#FFFF");
    const darkContrast = getContrast(text, "#212121");

    const scopedForegroundColor =
      lightContrast >= darkContrast ? "#FFFF" : "#212121";

    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast(`${text} copied to clipboard.`, {
          position: "bottom-center",
          style: {
            backgroundColor: text,
            color: scopedForegroundColor,
          },
        });
      })
      .catch((error) => {
        console.error("Error copying text to clipboard:", error);
      });
  };

  useEffect(() => {
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas?.getContext("2d");

    const image = new Image();
    image.src = img as string;

    image.onload = () => {
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const imageWidth = image.width;
      const imageHeight = image.height;

      // Calculate the scaling factor
      const scaleX = canvasWidth / imageWidth;
      const scaleY = canvasHeight / imageHeight;
      const scale = Math.min(scaleX, scaleY);

      // Calculate the resized dimensions
      const resizedWidth = imageWidth * scale;
      const resizedHeight = imageHeight * scale;

      // Calculate the center coordinates
      const centerX = canvasWidth / 2 - resizedWidth / 2;
      const centerY = canvasHeight / 2 - resizedHeight / 2;

      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      ctx?.drawImage(image, centerX, centerY, resizedWidth, resizedHeight);
    };

    return () => {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [img]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") as CanvasRenderingContext2D;

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const [red, green, blue, alpha] = pixelData;

    const hexColor = rgbToHex(red, green, blue);

    setCurrentColor(hexColor);
    copyToClipboardButton(hexColor);

    console.log(`Pixel color: RGB(${red}, ${green}, ${blue}), Alpha: ${alpha}`);
  };

  // MAGNIFIER
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [pixelColor, setPixelColor] = useState("");

  const handleCanvasMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleCanvasMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleCanvasMouseMove = (
    event: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const canvas = event.currentTarget;
    const ctx = canvas?.getContext("2d");
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    if (!ctx) {
      return;
    }

    const pixelData = ctx.getImageData(x, y, 1, 1).data;

    if (!pixelData || pixelData.length < 3) {
      return;
    }

    const [red, green, blue] = pixelData;

    setMagnifierPosition({ x: event.clientX, y: event.clientY });
    setPixelColor(rgbToHex(red, green, blue));
  };

  // rgb to hex
  function rgbToHex(red: number, green: number, blue: number) {
    const redHex = red.toString(16).padStart(2, "0");
    const greenHex = green.toString(16).padStart(2, "0");
    const blueHex = blue.toString(16).padStart(2, "0");

    const hexCode = `#${redHex}${greenHex}${blueHex}`;

    return hexCode;
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImg(imageUrl);
    }
  };

  function handleReset() {
    setImg(undefined);
    setCurrentColor("No Color");
    setPalette([]);
  }

  return (
    <div className="flex flex-col h-screen items-center justify-center max-w-6xl mx-auto py-10 px-4 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-neutral-400  dark:scrollbar-thumb-neutral-700 dark:scrollbar-track-neutral-900">
      <div className="text-white font-bold text-2xl p-3 mb-4">
        Press Ctrl + V to paste an image
      </div>
      <div className="grid grid-flow-col auto-cols-max gap-40 max-[1250px]:grid-flow-row max-[1250px]:auto-rows-max max-[1250px]:gap-8">
        <div className="w-[600px] h-[400px] bg-[#FDF7E5] rounded-xl shadow-lg box-content items-center justify-center flex">
          {img ? (
            <>
              <canvas
                className="magnifier-canvas"
                onMouseEnter={handleCanvasMouseEnter}
                onMouseLeave={handleCanvasMouseLeave}
                onMouseMove={handleCanvasMouseMove}
                width={500}
                height={300}
                style={{
                  objectFit: "cover",
                }}
                ref={canvasRef}
                onClick={handleCanvasClick}
              />
              {showMagnifier && (
                <div
                  className="magnifier"
                  style={{
                    left: magnifierPosition.x,
                    top: magnifierPosition.y,
                    backgroundColor: pixelColor,
                  }}
                >
                  <div className="magnifier-crosshair" />
                  <div className="magnifier-color">{pixelColor}</div>
                </div>
              )}
            </>
          ) : (
            <div>
              <span className="mr-2 text-lg font-semibold text-[#212121]">
                Ctrl + v or{" "}
              </span>
              <label
                htmlFor="fileInput"
                className="bg-blue-400 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer transition-all"
              >
                Upload File
              </label>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <div>
          <div className="text-white text-2xl font-semibold mb-2">Color</div>
          <div
            style={{
              backgroundColor: !isFirstRender ? currentColor : "#FDF7E5",
              color: !isFirstRender ? foregroundColor : "#212121",
            }}
            className="p-16 px-32 rounded-xl flex items-center justify-center relative"
          >
            <div className="absolute top-3 right-3 flex items-center justify-center gap-4">
              <button
                onClick={handleReset}
                style={{
                  borderColor: foregroundColor,
                }}
                className={`hover:opacity-70 border-2 rounded-lg px-3`}
              >
                Reset
              </button>
              <BsFillGearFill size={20} />
            </div>
            <span className="text-3xl min-w-[120px] text-center">
              {currentColor}
            </span>
          </div>
          <div>
            <div className="text-white text-2xl font-semibold mb-2 mt-4">
              Palette
            </div>
            <ColorExtractor getColors={(colors) => setPalette(colors)}>
              <img className="hidden" src={img} />
            </ColorExtractor>
            <div className="flex items-center justify-center bg-[#FDF7E5] rounded-lg px-4 py-2 min-w-[465px] min-h-[88px]">
              {/* Think Later */}
              {palette.length !== 0 ? (
                palette.map((color) => (
                  <button
                    key={color}
                    style={{ backgroundColor: color }}
                    className="p-7 m-2 rounded-lg"
                    onClick={() => {
                      setCurrentColor(color);
                      copyToClipboardButton(color);
                    }}
                  />
                ))
              ) : (
                <div className="flex self-center text-2xl">No Palette</div>
              )}
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default App;
