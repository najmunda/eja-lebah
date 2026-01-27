import { useEffect, useRef, useState, createContext } from "react";
import { Eraser, SendHorizontal, Shuffle, Smile } from "lucide-react";
import SubmittedAnswersList from "./SubmittedAnswersList";
import AnswerInput from "./AnswerInput";
import HexaButtons from "./HexaButtons";
import ScoreLine from "./ScoreLine";
import Button from "./Button";
import { useErrorBoundary } from "react-error-boundary";
import { delay } from "./utils";
import { countWordScore } from "../utils";

export const AppContext = createContext({ answer: "", isLoading: true });

export default function App() {
  // State
  const [isLoading, setIsLoading] = useState(true);

  const [isSubmittedAnswersListOpen, setSubmittedAnswersListIsOpen] =
    useState(false);

  const centerLetter = useRef("a");
  const sideLetterRef = useRef("aaaaaa");
  const [sideLetters, setSideLetters] = useState(new Array(6).fill(""));
  const correctAnswers = useRef([]);
  const [currentScore, setCurrentScore] = useState(0);
  const maxScore = useRef(1);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const { showBoundary } = useErrorBoundary();

  function handleSubmittedAnswersListClick() {
    try {
      if (message === "") {
        setSubmittedAnswersListIsOpen(
          (prevIsSubmittedAnswersListOpen) => !prevIsSubmittedAnswersListOpen,
        );
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  function handleLetterButtonClick(e) {
    try {
      const clickedButtonValue = e.currentTarget.getAttribute("value");
      setAnswer((prevAnswer) => prevAnswer + clickedButtonValue);
      setSubmittedAnswersListIsOpen(false);
    } catch (error) {
      showBoundary(error);
    }
  }

  function handleDeleteButtonClick() {
    try {
      setAnswer((prevAnswer) => prevAnswer.substring(0, prevAnswer.length - 1));
    } catch (error) {
      showBoundary(error);
    }
  }

  function handleShuffleButtonClick() {
    try {
      setSideLetters((prevSideLetters) =>
        prevSideLetters.toSorted(() => (Math.random() > 0.5 ? 1 : -1)),
      );
    } catch (error) {
      showBoundary(error);
    }
  }

  async function handleSubmitAnswer(e) {
    e.preventDefault();
    try {
      setSubmittedAnswersListIsOpen(false);
      if (answer.length < 4) {
        await showMessage("Jawaban terlalu pendek...", 1.5);
      } else if (answer.includes(centerLetter.current) === false) {
        await showMessage("Huruf kunci tidak digunakan...", 1.5);
      } else if (submittedAnswers.includes(answer)) {
        await showMessage("Jawaban sudah pernah ditebak sebelumnya...", 1.5);
      } else if (correctAnswers.current.includes(answer) === false) {
        await showMessage("Jawaban salah...", 1.5);
      } else {
        setCurrentScore((prevScore) => prevScore + countWordScore(answer));
        await showMessage(
          `Jawaban benar! Kamu mendapat ${answer.length} poin!`,
          1.5,
        );
        setAnswer("");
        setSubmittedAnswers((prevSubmittedAnswers: string[]) => {
          const updatedSubmittedAnswers = [answer, ...prevSubmittedAnswers];
          const savedData = JSON.parse(
            localStorage.getItem("eja_lebah_data") ?? "{}",
          );
          savedData["submitted_answers"] = updatedSubmittedAnswers;
          localStorage.setItem("eja_lebah_data", JSON.stringify(savedData));
          return updatedSubmittedAnswers;
        });
      }
    } catch (error) {
      showBoundary(error);
    }
  }

  // Handle keyboard
  function handleAnswerInputChange(e) {
    try {
      const nextAnswer = e.currentTarget.value.toLowerCase();
      const lastLetter = nextAnswer.at(-1);
      setAnswer((prevAnswer) => {
        if (
          prevAnswer.length > nextAnswer.length ||
          sideLetterRef.current.includes(lastLetter) ||
          lastLetter === centerLetter.current
        )
          return nextAnswer;
        else return prevAnswer;
      });
    } catch (error) {
      showBoundary(error);
    }
  }

  async function showMessage(message, seconds) {
    try {
      setMessage(message);
      await delay(seconds * 1000);
      setMessage("");
    } catch (error) {
      showBoundary(error);
    }
  }

  useEffect(() => {
    // { key_letter: "a", letters: "bcdefg", words: "["answer1", ...]",
    // word_count: 54, max_score: 102, create_date: "2025-10-15 06:17:15",
    // submitted_answers: "["answer1", ...]" }
    async function loadData() {
      try {
        const todayDate = new Date();
        const todayDateStr = `${todayDate.getFullYear()}-${todayDate.getMonth() + 1}-${todayDate.getDate()}`;
        const savedData = JSON.parse(
          localStorage.getItem("eja_lebah_data") ?? "{}",
        );
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
          await fetch("/api/answers")
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
              localStorage.setItem(
                "eja_lebah_data",
                JSON.stringify(fetchedData),
              );
            });
        }
        setIsLoading(false);
      } catch (error) {
        showBoundary(error);
      }
    }
    loadData();
  }, []);

  return (
    <main className="flex flex-col gap-[inherit]">
      {currentScore < maxScore.current ? (
        <AppContext value={{ answer: answer, isLoading: isLoading }}>
          <section className="px-2 flex flex-col items-center gap-8">
            <div className="w-full min-w-sm max-w-sm flex flex-col items-stretch gap-4">
              <ScoreLine
                currentScore={currentScore}
                maxScore={maxScore.current}
              />
              <SubmittedAnswersList
                submittedAnswers={submittedAnswers}
                isOpen={isSubmittedAnswersListOpen}
                handleListClick={handleSubmittedAnswersListClick}
                message={message}
              />
              <AnswerInput
                value={answer}
                handleAnswerInputChange={handleAnswerInputChange}
                handleSubmit={handleSubmitAnswer}
              />
            </div>
            <div className="flex flex-col items-center self-center">
              <HexaButtons
                centerLetter={centerLetter.current}
                sideLetters={sideLetters}
                handleButtonClick={handleLetterButtonClick}
              />
            </div>
            <div className="h-fit flex justify-center gap-2">
              <Button type="button" onClick={handleDeleteButtonClick}>
                <Eraser size={18} />
                Hapus
              </Button>
              <Button type="button" onClick={handleShuffleButtonClick}>
                <Shuffle size={18} />
                Acak
              </Button>
              <Button type="submit" form="answer-form">
                <SendHorizontal size={18} />
                Submit
              </Button>
            </div>
          </section>
        </AppContext>
      ) : (
        <section className="px-2 flex-1 flex flex-col items-center justify-center text-center gap-4">
          <Smile size={100} />
          <p className="text-4xl">Selamat!</p>
          <p>
            Anda berhasil menyelesaikan kuis hari ini! <br />
            Datang kembali besok!
          </p>
        </section>
      )}
      <br />
      <section className="px-2 flex flex-col items-stretch gap-[inherit]">
        <div className="p-2 text-center gap-3 bg-yellow-200 rounded-lg">
          <h2 className="text-2xl font-bold">Cara Bermain</h2>
          <p className="text-sm font-light">
            Cari kata sebanyak-banyaknya! Kata terdiri dari 4 atau lebih huruf,
            terdiri dari huruf yang ada di layar, dan harus memuat huruf kunci
            (berada di tengah kumpulan huruf)!
          </p>
          <p className="text-sm font-light">
            Kata dengan 4 huruf bernilai 1 poin, dan kata dengan lebih dari 4
            huruf bernilai sama dengan jumlah huruf. Jika kamu dapat menggunakan
            seluruh huruf dalam 1 jawaban kamu akan mendapatkan 7 poin tambahan!
          </p>
          <p className="text-sm font-light">
            Input jawaban menggunakan keyboard, atau dengan menekan tombol huruf
            di layar.
          </p>
        </div>
        <div className="p-2 text-center gap-3 bg-yellow-200 rounded-lg">
          <h2 className="text-2xl font-bold">Tentang Gim</h2>
          <p className="text-sm font-light">
            Gim dibuat terinspirasi spelling bee dari New York Times, karena
            saya tidak mempunyai list kata Bahasa Inggris yang kaya dan tidak
            bisa mendapat poin tinggi.
          </p>
          <p className="text-sm font-light">
            List kata didapat dari Wiktionary, mungkin jawaban yang kamu ketik
            tidak ditemukan atau baku.
          </p>
        </div>
      </section>
    </main>
  );
}
