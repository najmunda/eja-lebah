import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./App";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function SubmittedAnswersList({
  submittedAnswers,
  isOpen,
  handleListClick,
  message,
}: {
  submittedAnswers: string[];
  isOpen: boolean;
  handleListClick: Function;
  message: string;
}) {
  const { answer, isLoading } = useContext(AppContext);
  const [height, setHeight] = useState(0);
  const ghostRef = useRef();

  let renderedSubmittedAnswers;

  if (!isOpen && answer.length) {
    renderedSubmittedAnswers = submittedAnswers.filter((submittedAnswer) =>
      submittedAnswer.startsWith(answer),
    );
  } else if (isOpen || answer.length) {
    renderedSubmittedAnswers = submittedAnswers.toSorted();
  } else {
    renderedSubmittedAnswers = submittedAnswers;
  }

  useEffect(() => {
    ghostRef.current.style.display = "flex";
    const height = ghostRef.current.offsetHeight;
    setHeight(height);
    ghostRef.current.style.display = "none";
  }, [submittedAnswers]);

  return (
    <section className="relative">
      <ul
        ref={ghostRef}
        className="opacity-0 absolute top-0 p-2 flex content-start flex-wrap gap-2 text-sm pr-10 overflow-visible"
      >
        {renderedSubmittedAnswers.map((answer, index) => (
          <li key={`ghost-${index}`}>{answer}</li>
        ))}
        {renderedSubmittedAnswers.length || (
          <li>Coba tebak sebuah jawaban...</li>
        )}
        <li className="basis-full">
          Anda menemukan{" "}
          <span className="font-bold">{renderedSubmittedAnswers.length}</span>{" "}
          kata
        </li>
      </ul>
      <ul
        style={{ height: isOpen ? height : 36 }}
        className={clsx(
          "group relative w-full p-2 flex gap-2 content-start text-sm bg-yellow-200 rounded-lg overflow-hidden transition-[background-color,_height] duration-250",
          { "animate-pulse": isLoading },
          { "flex-wrap pr-10 overflow-visible": isOpen },
          { "hover:bg-yellow-300 hover:cursor-pointer": message === "" },
          { "hover:bg-yellow-200": message !== "" },
        )}
        onClick={handleListClick}
      >
        <AnimatePresence>
          {message && (
            <motion.p
              key={message}
              className="w-full text-center absolute bg-yellow-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
        {isLoading || (
          <>
            {renderedSubmittedAnswers.length
              ? renderedSubmittedAnswers.map((answer, index) => (
                  <li key={answer}>{answer}</li>
                ))
              : isOpen && <li>Coba tebak sebuah jawaban...</li>}
            {isOpen && (
              <li className="basis-full">
                Anda menemukan{" "}
                <span className="font-bold">
                  {renderedSubmittedAnswers.length}
                </span>{" "}
                kata
              </li>
            )}
            <div className="pt-2 pr-2 bg-inherit absolute top-0 right-0 rounded-lg">
              {isOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
          </>
        )}
      </ul>
    </section>
  );
}
