import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function AnswerInput({
  value,
  handleAnswerInputChange,
  handleSubmit,
}) {
  const { isLoading } = useContext(AppContext);
  const isTouchDevice =
    "ontouchstart" in window || "onmsgesturechange" in window;

  return (
    <form
      id="answer-form"
      onSubmit={handleSubmit}
      className={clsx(
        "flex justify-center items-center bg-yellow-200 text-4xl rounded-lg relative",
        {
          "animate-pulse": isLoading,
        },
      )}
    >
      <input
        type="text"
        name="answer-input"
        id="answer-input"
        value={value}
        onChange={handleAnswerInputChange}
        onBlur={(e) => e.currentTarget.focus()}
        autoFocus
        readOnly={isTouchDevice}
        autoComplete="off"
        inputMode="none"
        className="p-2 h-full w-full text-center rounded-lg"
      />
    </form>
  );
}
