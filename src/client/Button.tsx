import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function Button({
  children,
  handleClick,
}: {
  children: any;
  handleClick: any;
}) {
  const { isLoading } = useContext(AppContext);
  return (
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "px-2 py-1 h-fit flex items-center gap-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 cursor-pointer transition-colors duration-250",
        { "animate-pulse text-yellow-200": isLoading },
      )}
    >
      {children}
    </button>
  );
}
