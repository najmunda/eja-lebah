import { useContext, useState } from "react";
import { AppContext } from "./App";
import clsx from "clsx";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SubmittedAnswersList({
  submittedAnswers,
  isOpen,
  handleListClick,
  message,
}: {
  submittedAnswers: string[],
  isOpen: boolean,
  handleListClick: Function,
  message: string,
}) {
  const { answer, isLoading } = useContext(AppContext);

  if (isOpen || answer.length) {
    submittedAnswers = submittedAnswers.toSorted();
  }

  if (answer.length && !isOpen) {
    submittedAnswers = submittedAnswers.filter((submittedAnswer) =>
      submittedAnswer.startsWith(answer),
    );
  }

  return (
    <ul
      className={clsx(
        "group relative h-fit p-2 flex items-center gap-2 text-sm bg-yellow-200 rounded-lg overflow-hidden",
        { "animate-fade-repeat": isLoading },
        { "flex-wrap pr-10 overflow-visible h-fit": isOpen },
        { "hover:bg-yellow-300 hover:cursor-pointer": message === "" },
        { "justify-center hover:bg-yellow-200": message !== "" },
      )}
      onClick={handleListClick}
    >
      {isOpen && (
        <p className="basis-full">
          Anda menemukan{" "}
          <span className="font-bold">{submittedAnswers.length}</span> kata
        </p>
      )}
      {message !== "" ? (
        <p>{message}</p>
      ) : (
        <>
          {submittedAnswers.length ? (
            submittedAnswers.map((answer, index) => <li key={index}>{answer}</li>)
          ) : (
            <li className={clsx("invisible", {visible: isOpen})}>
              Coba tebak sebuah jawaban...
            </li>
          )}
          <button className="pt-2 pr-2 bg-inherit absolute top-0 right-0 rounded-lg">
            {isOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
        </>
      )}
    </ul>
  );
}
