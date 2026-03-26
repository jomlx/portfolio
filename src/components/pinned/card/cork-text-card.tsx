import type { CardBodyProps } from "../../../types";

export function CorkTextCard({ card }: CardBodyProps) {
  const renderLines = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(important)/gi);
      return (
        <span key={i} className="block">
          {parts.map((part, j) =>
            part.toLowerCase() === "important" ? (
              <span
                key={j}
                className="inline-block relative z-10 px-1 py-0.5 mt-0.5"
              >
                {part}
              </span>
            ) : (
              part
            ),
          )}
        </span>
      );
    });
  };

  return (
    <div className="relative w-full h-full pointer-events-none">
      <p
        style={{
          fontFamily: '"Special Elite", cursive',
          fontSize: "12px",
          color: "#000",
          lineHeight: 1.3,
          transform: "rotate(-1deg)",
        }}
      >
        {renderLines(card.content)}
      </p>

      {/* Marker box and arrow */}
      <svg
        className="absolute pointer-events-none z-0 overflow-visible"
        style={{ width: "100px", height: "100px", top: "-15%", left: "-20%" }}
      >
        {/* Box around "important" */}
        <path
          d="M 48 85 Q 90 83 115 85 Q 118 78 113 70 Q 90 68 70 70 Q 64 78 68 85"
          fill="none"
          stroke="#C0392B"
          strokeWidth="2"
          strokeOpacity="0.8"
        />
        {/* Arrow going up */}
        <path
          d="M 35 70 Q 0 30 30 0"
          fill="none"
          stroke="#C0392B"
          strokeWidth="2.5"
          strokeOpacity="0.9"
        />
        <path
          d="M 10 5 L 30 0 L 34 15"
          fill="none"
          stroke="#C0392B"
          strokeWidth="2.5"
          strokeOpacity="0.9"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
