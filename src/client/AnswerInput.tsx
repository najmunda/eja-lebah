import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

export default function AnswerInput({ value, ref, handleKeyDown }) {
  const { isLoading } = useContext(AppContext);
  const [answerWidth, setAnswerWidth] = useState(0);
  const answerRef = useRef();

  useEffect(() => {
    const width = answerRef.current.offsetWidth;
    setAnswerWidth(width);
  }, [value]);

  return (
    <div
      className={clsx(
        "flex justify-center items-center bg-yellow-200 text-4xl rounded-lg relative",
        {
          "animate-pulse": isLoading,
        },
      )}
    >
      <input
        type="text"
        name=""
        id=""
        ref={ref}
        value={value}
        onKeyDown={handleKeyDown}
        className="p-2 h-full w-full text-center text-yellow-200 caret-yellow-200 rounded-lg"
      />
      <p ref={answerRef} className="absolute opacity-0">
        {value}
      </p>
      <p
        className="absolute transition-[width] duration-150"
        style={{ width: answerWidth }}
      >
        {value}
        <span className="animate-fade-repeat">|</span>
      </p>
    </div>
  );
}
