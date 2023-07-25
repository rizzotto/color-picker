export default function rgbToHex(red: number, green: number, blue: number) {
  const redHex = red.toString(16).padStart(2, "0");
  const greenHex = green.toString(16).padStart(2, "0");
  const blueHex = blue.toString(16).padStart(2, "0");

  const hexCode = `#${redHex}${greenHex}${blueHex}`;

  return hexCode;
}
