export const getCardShadow = (isDragging: boolean) =>
  isDragging
    ? "-6px 12px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(0,0,0,0.05)"
    : "-4px 6px 12px rgba(0,0,0,0.4), inset 0 0 30px rgba(0,0,0,0.05)";

export const renderLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i} className="block">
      {line}
    </span>
  ));
