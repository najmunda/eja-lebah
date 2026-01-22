export default function Header() {
  return (
    <header className="p-2 flex justify-around items-center gap-1 rounded-b-lg">
      <div className="flex items-center gap-2">
        {"EJA".split("").map((letter) => (
          <p
            style={{
              clipPath: "polygon(-50% 50%,50% 100%,150% 50%,50% 0)",
              aspectRatio: "cos(30deg)",
            }}
            className="h-full flex justify-center items-center content-baseline p-2 bg-yellow-200 text-black"
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
            className="h-full flex justify-center items-center content-baseline p-2 bg-yellow-200 text-black"
          >
            {letter}
          </p>
        ))}
      </div>
    </header>
  );
}
