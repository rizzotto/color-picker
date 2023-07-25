import { BiSolidCopy } from "react-icons/bi";
import { BsFillGearFill } from "react-icons/bs";
import copyToClipboard from "../utils/copyToClipboard";
import { useAppContext } from "../../context/provider";
import { useState } from "react";
import Chrome from "@uiw/react-color-chrome";
import useOnclickOutside from "react-cool-onclickoutside";
import { ColorResult } from "@uiw/color-convert";

type Props = {
  isFirstRender: boolean;
  handleReset: () => void;
  foregroundColor: string;
};

export default function ColorDisplay({
  isFirstRender,
  handleReset,
  foregroundColor,
}: Props) {
  const { currentColor, setCurrentColor } = useAppContext();

  const [showPopover, setShowPopover] = useState(false);

  const ref = useOnclickOutside(() => {
    setShowPopover(false);
  });

  return (
    <>
      <div className="mb-2 text-2xl font-semibold text-[#FDF7E5]">Color</div>
      <div
        style={{
          backgroundColor: !isFirstRender ? currentColor : "#FDF7E5",
          color: !isFirstRender ? foregroundColor : "#212121",
          border: `2px solid ${!isFirstRender ? foregroundColor : "#212121"}`,
        }}
        className="relative flex items-center justify-center p-16 px-32 rounded-xl"
      >
        <div className="absolute flex items-center justify-center gap-4 top-3 right-3">
          {!isFirstRender && (
            <>
              <button
                onClick={handleReset}
                style={{
                  borderColor: foregroundColor,
                }}
                className={`hover:opacity-70 border-2 rounded-lg px-3`}
              >
                Reset
              </button>
              <button
                className="hover:opacity-70"
                onClick={() => copyToClipboard(currentColor)}
              >
                <BiSolidCopy size={20} />
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowPopover(true)}
                  className="hover:opacity-70"
                >
                  <BsFillGearFill size={20} />
                </button>

                {showPopover && (
                  <div ref={ref} className="absolute right-[-8px] top-8 z-10">
                    <Chrome
                      color={currentColor}
                      placement={"TR" as any}
                      onChange={(color: ColorResult) => {
                        console.log(color);
                        setCurrentColor(color.hexa);
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <span className={`text-3xl min-w-[150px] text-center`}>
          {currentColor}
        </span>
        <div className="absolute font-semibold bottom-1 right-3 ">
          {!isFirstRender &&
            (foregroundColor === "#FFFF"
              ? "Foreground: Light"
              : "Foreground: Dark")}
        </div>
      </div>
    </>
  );
}
