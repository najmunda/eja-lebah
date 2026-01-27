export default function Header() {
  return (
    <header className="bg-yellow-200 p-2 flex justify-around items-center gap-1">
      <div className="flex items-center gap-px text-lg font-medium">
        {"EJA".split("").map((letter) => (
          <p
            style={{
              clipPath: "polygon(-50% 50%,50% 100%,150% 50%,50% 0)",
              aspectRatio: "cos(30deg)",
            }}
            className="h-full flex justify-center items-center content-baseline p-2 bg-yellow-100 text-black"
          >
            {letter}
          </p>
        ))}
        <br />
        {"LEBAH".split("").map((letter) => (
          <p
            style={{
              clipPath: "polygon(-50% 50%,50% 100%,150% 50%,50% 0)",
              aspectRatio: "cos(30deg)",
            }}
            className="h-full flex justify-center items-center content-baseline p-2 bg-yellow-100 text-black"
          >
            {letter}
          </p>
        ))}
      </div>
    </header>
  );
}
