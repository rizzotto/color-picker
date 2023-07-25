import { ChangeEvent, useEffect, useRef, useState } from "react";
import { getContrast } from "polished";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "../../context/provider";
import Magnifier from "../Magnifier";
import rgbToHex from "../utils/rgbToHex";
import copyToClipboard from "../utils/copyToClipboard";
import Palette from "../Palette";
import ColorDisplay from "../ColorDisplay";
import useMediaQuery from "@sjblurton/use-media-query";

export default function ColorPicker(): JSX.Element {
  const [img, setImg] = useState<string>();
  const [showMagnifier, setShowMagnifier] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSmall = useMediaQuery("(max-width: 620px)");
  const isExtraSmall = useMediaQuery("(max-width: 400px)");

  const { setMagnifier, currentColor, setCurrentColor, setPalette } =
    useAppContext();

  const isFirstRender = currentColor === "No Color Picked";
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
    const [red, green, blue] = pixelData;

    const hexColor = rgbToHex(red, green, blue);

    setCurrentColor(hexColor);
    copyToClipboard(hexColor);
  };

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

    setMagnifier({
      x: event.clientX,
      y: event.clientY,
      color: rgbToHex(red, green, blue),
    });
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImg(imageUrl);
    }
  };

  function handleReset() {
    setImg(undefined);
    setCurrentColor("No Color Picked");
    setPalette([]);
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 ">
      <div className="grid place-items-center grid-flow-col auto-cols-max gap-40 max-[1250px]:grid-flow-row max-[1250px]:auto-rows-max max-[1250px]:gap-8">
        <div
          className={`h-[400px] ${isSmall ? "w-[376px]" : "w-[600px]"} ${
            isExtraSmall ? "w-[250px]" : "w-[600px]"
          } bg-[#FDF7E5] border-2 border-[#212121] rounded-xl shadow-lg box-content items-center justify-center flex`}
        >
          {img ? (
            <>
              <canvas
                className="cursor-crosshair"
                onMouseEnter={handleCanvasMouseEnter}
                onMouseLeave={handleCanvasMouseLeave}
                onMouseMove={handleCanvasMouseMove}
                width={isSmall ? 300 : isExtraSmall ? 250 : 500}
                height={isExtraSmall ? 150 : 300}
                style={{
                  objectFit: "cover",
                }}
                ref={canvasRef}
                onClick={handleCanvasClick}
              />
              <Magnifier show={showMagnifier} />
            </>
          ) : (
            <div>
              <span className="mr-2 text-lg font-semibold text-[#212121]">
                Ctrl + v or{" "}
              </span>
              <label
                htmlFor="fileInput"
                className="px-4 py-2 font-semibold text-white transition-all bg-blue-400 rounded-lg cursor-pointer hover:bg-blue-500"
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
        <div
          className={` ${isSmall ? "w-[376px]" : "w-[600px]"} ${
            isExtraSmall ? "w-[250px]" : "w-[600px]"
          }`}
        >
          <ColorDisplay
            foregroundColor={foregroundColor}
            handleReset={handleReset}
            isFirstRender={isFirstRender}
          />
          <Palette img={img} />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
