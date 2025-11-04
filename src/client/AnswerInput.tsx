import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function AnswerInput({ value, handleKeyDown }) {
  const { isLoading } = useContext(AppContext);

  return (
    <input 
      type="text" 
      name="" 
      id="" 
      value={value}
      onKeyDown={handleKeyDown}
      className={clsx("p-2 text-center bg-yellow-200 text-4xl rounded-lg", {
        "animate-pulse": isLoading,
      })}
    />
  )
}
