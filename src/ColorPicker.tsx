import React, { useRef, useEffect } from "react";
import yourImage from "./test.png"; // Import your local image

const ColorPicker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const image = new Image();
    image.src = yourImage;

    image.onload = () => {
      ctx.drawImage(image, 0, 0);
    };
  }, []);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log(ctx);

    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;

    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    const [red, green, blue, alpha] = pixelData;

    console.log(`Pixel color: RGB(${red}, ${green}, ${blue}), Alpha: ${alpha}`);
  };

  return (
    <div>
      <canvas ref={canvasRef} onClick={handleCanvasClick} />
    </div>
  );
};

export default ColorPicker;
