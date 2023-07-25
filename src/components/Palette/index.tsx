import { ColorExtractor } from "react-color-extractor";
import copyToClipboard from "../utils/copyToClipboard";
import { useAppContext } from "../../context/provider";
import useMediaQuery from "@sjblurton/use-media-query";

type Props = {
  img?: string;
};

export default function Palette({ img }: Props) {
  const { setPalette, palette, setCurrentColor } = useAppContext();
  const isSmall = useMediaQuery("(max-width: 620px)");

  return (
    <div>
      <div className="mt-4 mb-2 text-2xl font-semibold text-[#FDF7E5]">
        Predominant Palette
      </div>
      <ColorExtractor getColors={(colors) => setPalette(colors)}>
        <img className="hidden" src={img} />
      </ColorExtractor>
      <div
        className={`${
          isSmall ? "flex-col" : "flex-row"
        } flex items-center justify-center bg-[#FDF7E5] border-2 border-[#212121] rounded-lg px-4 py-2 min-h-[94px]`}
      >
        {palette.length !== 0 ? (
          palette.map((color, i) => (
            <button
              key={`${color}-${i}`}
              style={{ backgroundColor: color }}
              className="m-2 rounded-lg p-7"
              onClick={() => {
                setCurrentColor(color);
                copyToClipboard(color);
              }}
            />
          ))
        ) : (
          <div className="flex self-center text-2xl">No Palette</div>
        )}
      </div>
    </div>
  );
}
