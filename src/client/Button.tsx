export default function Button({
  children,
  handleClick,
}: {
  children: any;
  handleClick: any;
}) {
  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-2 py-1 h-fit flex items-center gap-2 rounded-lg bg-yellow-200 hover:bg-yellow-300 cursor-pointer"
    >
      {children}
    </button>
  );
}
