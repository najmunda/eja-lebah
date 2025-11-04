import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function HexaButton({
  letter,
  handleClick,
  isCenter,
}: {
  letter: string;
  handleClick: any;
  isCenter?: boolean;
}) {
  const { isLoading } = useContext(AppContext);

  return (
    <button
      type="button"
      value={letter}
      style={{
        clipPath: "polygon(-50% 50%,50% 100%,150% 50%,50% 0)",
        aspectRatio: "cos(30deg)",
      }}
      onClick={handleClick}
      className={clsx(
        "p-2 h-20 w-18 flex justify-center items-center text-2xl font-medium cursor-pointer",
        {
          "bg-yellow-300 hover:bg-yellow-400": isCenter,
          "bg-yellow-200 hover:bg-yellow-300": !isCenter,
        },
        { "animate-pulse": isLoading },
      )}
      disabled={isLoading}
    >
      {isLoading ? "" : letter.toUpperCase()}
    </button>
  );
}
