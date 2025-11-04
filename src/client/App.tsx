import { useEffect, useRef, useState, createContext } from "react";
import { Eraser, SendHorizontal, Shuffle } from "lucide-react";
import SubmittedAnswersList from "./SubmittedAnswersList";
import AnswerInput from "./AnswerInput";
import HexaButton from "./HexaButton";
import Header from "./Header";
import ScoreLine from "./ScoreLine";
import Button from "./Button";

export const AppContext = createContext({ answer: "", isLoading: true });

export default function App() {
  // State
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmittedAnswersListOpen, setSubmittedAnswersListIsOpen] = useState(false);

  const centerLetter = useRef("a");
  const sideLetterRef = useRef("aaaaaa");
  const [sideLetters, setSideLetters] = useState(new Array(6).fill(""));
  const correctAnswers = useRef([]);
  const [currentScore, setCurrentScore] = useState(0);
  const maxScore = useRef(0);
  const [submittedAnswers, setSubmittedAnswers]: [string[], Function] =
    useState([]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmittedAnswersListClick() {
    if (message === "") {
      setSubmittedAnswersListIsOpen((prevIsSubmittedAnswersListOpen) => !prevIsSubmittedAnswersListOpen);
    }
  }

  function showMessage(message, seconds, callback) {
    console.log(message);
    setMessage(message);
    setTimeout(() => {
      setMessage("");
      if (callback) callback();
    }, seconds * 1000);
  }

  function handleLetterButtonClick(e) {
    const clickedButtonValue = e.currentTarget.getAttribute("value");
    setAnswer((prevAnswer) => prevAnswer + clickedButtonValue);
    setSubmittedAnswersListIsOpen(false);
  }

  function handleDeleteButtonClick() {
    setAnswer((prevAnswer) => prevAnswer.substring(0, prevAnswer.length - 1));
  }

  function handleShuffleButtonClick() {
    setSideLetters((prevSideLetters) =>
      prevSideLetters.toSorted((a, b) => (Math.random() > 0.5 ? 1 : -1)),
    );
  }

  function handleSubmitButtonClick() {
    setSubmittedAnswersListIsOpen(false);
    if (answer.length < 4) {
      showMessage("Jawaban terlalu pendek...", 1.5);
    } else if (answer.includes(centerLetter.current) === false) {
      showMessage("Huruf kunci tidak digunakan...", 1.5);
    } else if (submittedAnswers.includes(answer)) {
      showMessage("Jawaban sudah pernah ditebak sebelumnya...", 1.5);
    } else if (correctAnswers.current.includes(answer) === false) {
      showMessage("Jawaban salah...", 1.5);
    } else {
      showMessage(`Jawaban benar! Kamu mendapat ${answer.length} poin!`, 1.5, () => {setAnswer("");});
      setSubmittedAnswers((prevSubmittedAnswers: string[]) => {
        const updatedSubmittedAnswers = [answer, ...prevSubmittedAnswers];
        const savedData = JSON.parse(
          localStorage.getItem("eja_lebah_data") ?? "{}",
        );
        savedData["submitted_answers"] = updatedSubmittedAnswers;
        localStorage.setItem("eja_lebah_data", JSON.stringify(savedData));
        return updatedSubmittedAnswers;
      });
      setCurrentScore((prevScore) => prevScore + answer.length);
    }
  }

  // Handle keyboard
  function handleKeyDown(e) {
    console.log(answer)
    if (e.key === "Backspace") {
      setAnswer((prevAnswer) => prevAnswer.substring(0, prevAnswer.length - 1));
    } else if (sideLetterRef.current.includes(e.key) || e.key === centerLetter.current) {
      setAnswer((prevAnswer) => {
        console.log(prevAnswer)
        return prevAnswer + e.key
      });
    } else if (e.key === "Enter") {
      handleSubmitButtonClick();
    }
  }

  useEffect(() => {
    // { key_letter: "a", letters: "bcdefg", words: "["answer1", ...]",
    // word_count: 54, max_score: 102, create_date: "2025-10-15 06:17:15",
    // submitted_answers: "["answer1", ...]" }
    const todayDate = new Date();
    const todayDateStr = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
    const savedData = JSON.parse(
      localStorage.getItem("eja_lebah_data") ?? "{}",
    );
    console.log(savedData["create_date"]);
    console.log(todayDateStr);
    if (savedData["create_date"] == todayDateStr) {
      // Set latest buttons and correct answers with saved data
      centerLetter.current = savedData["key_letter"];
      sideLetterRef.current = savedData["letters"];
      setSideLetters(savedData["letters"].split(""));
      correctAnswers.current = savedData["words"];
      maxScore.current = savedData["max_score"];
      setSubmittedAnswers(savedData["submitted_answers"]);
      setCurrentScore(
        savedData["submitted_answers"].reduce(
          (lengthTotal, answer) => lengthTotal + answer.length,
          0,
        ),
      );
    } else {
      console.log("fetch");
      fetch("/api/answers")
        .then((response) => response.json())
        .then((fetchedData) => {
          // Set latest buttons and correct answers with fetched data
          centerLetter.current = fetchedData["key_letter"];
          sideLetterRef.current = fetchedData["letters"];
          setSideLetters(fetchedData["letters"].split(""));
          maxScore.current = fetchedData["max_score"];
          correctAnswers.current = JSON.parse(fetchedData["words"]);
          fetchedData["submitted_answers"] = [];

          // Save fetched data to localStorage
          localStorage.setItem("eja_lebah_data", JSON.stringify(fetchedData));
        });
    }
    setIsLoading(false);
  }, []);

  return (
    <AppContext value={{ answer: answer, isLoading: isLoading }}>
      <Header />
      <main className="px-2 flex-1 flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:grid-rows-[repeat(2,_minmax(0,_min-content))] auto-rows-min">
        <div className="flex flex-col gap-4">
          <ScoreLine currentScore={currentScore} maxScore={maxScore.current} />
          <SubmittedAnswersList 
            submittedAnswers={submittedAnswers} 
            isOpen={isSubmittedAnswersListOpen} 
            handleListClick={handleSubmittedAnswersListClick}
            message={message} />
          <AnswerInput value={answer} handleKeyDown={handleKeyDown} />
        </div>
        <div className="flex flex-col items-center self-center sm:row-span-2">
          <div className="-mb-4 flex gap-1 justify-center">
            <HexaButton
              letter={sideLetters[0]}
              handleClick={handleLetterButtonClick}
            />
            <HexaButton
              letter={sideLetters[1]}
              handleClick={handleLetterButtonClick}
            />
          </div>
          <div className="flex gap-1 justify-center">
            <HexaButton
              letter={sideLetters[2]}
              handleClick={handleLetterButtonClick}
            />
            <HexaButton
              letter={centerLetter.current}
              handleClick={handleLetterButtonClick}
              isCenter={true}
            />
            <HexaButton
              letter={sideLetters[3]}
              handleClick={handleLetterButtonClick}
            />
          </div>
          <div className="-mt-4 flex gap-1 justify-center">
            <HexaButton
              letter={sideLetters[4]}
              handleClick={handleLetterButtonClick}
            />
            <HexaButton
              letter={sideLetters[5]}
              handleClick={handleLetterButtonClick}
            />
          </div>
        </div>
        <div className="h-fit flex justify-center gap-2">
          <Button handleClick={handleDeleteButtonClick}>
            <Eraser size={18} />
            Hapus
          </Button>
          <Button handleClick={handleShuffleButtonClick}>
            <Shuffle size={18} />
            Acak
          </Button>
          <Button handleClick={handleSubmitButtonClick}>
            <SendHorizontal size={18} />
            Submit
          </Button>
        </div>
      </main>
      <footer className="p-2 flex justify-center">
        <p className="text-sm">eja-lebah 2025 | Oleh Najmunda</p>
      </footer>
    </AppContext>
  );
}
