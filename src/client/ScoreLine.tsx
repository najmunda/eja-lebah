import { useContext } from "react";
import { AppContext } from "./App";
import clsx from "clsx";

function CheckPoint({ minPercentage, currentPercentage }) {
  return (
    <div 
      className={clsx(
        "rounded-full size-3 border-2 border-yellow-300 bg-white z-10",
        {"bg-yellow-300": currentPercentage >= minPercentage}
      )}
    ></div>
  )
}

function Line() {
  return (
    <div className="h-1 flex-1 bg-yellow-100"></div>
  )
}

export default function ScoreLine({ currentScore, maxScore }) {
  const { isLoading } = useContext(AppContext);
  const currentPercentage = currentScore/maxScore*100;
  return (
    <section className={clsx("h-8 flex items-center", { "animate-pulse": isLoading },)}>
      <div className={clsx("flex-1 flex justify-between items-center relative")}>
        <div 
          style={{width: `${currentPercentage}%`}}
          className="h-1 bg-yellow-200 absolute"></div>
        <p
          style={{left: `${currentPercentage}%`}} 
          className={clsx(
            "rounded-full size-8 border-2 text-xs flex justify-center items-center border-yellow-300 bg-white absolute z-20",
            {"hidden": currentPercentage === 100}
          )}
        >{isLoading ? "" : currentScore}</p>
        <CheckPoint minPercentage={0} currentPercentage={currentPercentage} />
        <Line />
        <CheckPoint minPercentage={25} currentPercentage={currentPercentage} />
        <Line />
        <CheckPoint minPercentage={50} currentPercentage={currentPercentage} />
        <Line />
        <CheckPoint minPercentage={75} currentPercentage={currentPercentage} />
        <Line />
        <CheckPoint minPercentage={100} currentPercentage={currentPercentage} />
        <p 
          className={clsx(
            "rounded-full size-8 border-2 text-xs flex justify-center items-center border-yellow-300 bg-white absolute right-0 z-10",
            {"hidden": currentPercentage === 100}
          )}
        >{isLoading ? "" : maxScore}</p>
      </div>
    </section>
  )
}