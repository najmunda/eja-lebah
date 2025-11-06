import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function AnswerInput({ value, ref, handleKeyDown }) {
  const { isLoading } = useContext(AppContext);

  return (
    <input 
      type="text" 
      name="" 
      id="" 
      ref={ref}
      value={value}
      onKeyDown={handleKeyDown}
      className={clsx("p-2 text-center bg-yellow-200 text-4xl rounded-lg", {
        "animate-pulse": isLoading,
      })}
    />
  )
}
