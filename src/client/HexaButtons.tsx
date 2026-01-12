import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

function HexaButton({
  letter,
  handleClick,
  isCenter,
  sideLetters,
}: {
  letter: string;
  handleClick: any;
  isCenter?: boolean;
  sideLetters: string[];
}) {
  const { isLoading } = useContext(AppContext);
  const key = isCenter ? letter : sideLetters.join("");

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
        "p-2 h-20 w-18 flex justify-center items-center text-2xl font-medium cursor-pointer relative transition-colors duration-250",
        {
          "bg-yellow-300 hover:bg-yellow-400": isCenter,
          "bg-yellow-200 hover:bg-yellow-300": !isCenter,
        },
        { "animate-pulse": isLoading },
      )}
      disabled={isLoading}
    >
      <AnimatePresence initial={false}>
        {isLoading || (
          <motion.p
            key={key}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.25 } }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute"
          >
            {letter.toUpperCase()}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function HexaButtons({
  centerLetter,
  sideLetters,
  handleButtonClick,
}) {
  return (
    <>
      <div className="-mb-4 flex gap-1 justify-center">
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[0]}
          handleClick={handleButtonClick}
        />
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[1]}
          handleClick={handleButtonClick}
        />
      </div>
      <div className="flex gap-1 justify-center">
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[2]}
          handleClick={handleButtonClick}
        />
        <HexaButton
          sideLetters={sideLetters}
          letter={centerLetter}
          handleClick={handleButtonClick}
          isCenter={true}
        />
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[3]}
          handleClick={handleButtonClick}
        />
      </div>
      <div className="-mt-4 flex gap-1 justify-center">
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[4]}
          handleClick={handleButtonClick}
        />
        <HexaButton
          sideLetters={sideLetters}
          letter={sideLetters[5]}
          handleClick={handleButtonClick}
        />
      </div>
    </>
  );
}
