import { getContrast } from "polished";
import { toast } from "react-hot-toast";

export default function copyToClipboard(text: string) {
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
}
