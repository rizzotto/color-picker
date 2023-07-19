import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./Magnifier.css";

function App() {
  const [img, setImg] = useState<string>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log("Text copied to clipboard");
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

    copyToClipboardButton(rgbToHex(red, green, blue));

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
    const ctx = canvas.getContext("2d");
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
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

  return (
    <div>
      <div>Press Ctrl + V to paste an image</div>
      {img && (
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
              border: "4px solid #FDF7E5",
              borderStyle: "dashed",
              borderRadius: 16,
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
      )}
    </div>
  );
}

export default App;
