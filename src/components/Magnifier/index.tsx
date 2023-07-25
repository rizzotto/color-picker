import { useAppContext } from "../../context/provider";

export default function Magnifier({
  show,
}: {
  show: boolean;
}): JSX.Element | null {
  const { magnifier } = useAppContext();

  return show ? (
    <div
      className="absolute w-[70px] h-[70px] rounded-full pointer-events-none shadow-xl"
      style={{
        left: magnifier.x,
        top: magnifier.y,
        backgroundColor: magnifier.color,
      }}
    >
      <div className="absolute top-[110%] left-[50%] translate-x-[-50%] text-xl font-bold text-[#FDF7E5] bg-neutral-800 px-3 py-1 rounded-lg">
        {magnifier.color}
      </div>
    </div>
  ) : null;
}
