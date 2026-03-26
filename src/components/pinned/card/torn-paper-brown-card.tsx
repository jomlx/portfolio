import type { CardBodyProps } from "../../../interface/card";
import { getCardShadow, renderLines } from "../helper";

export function TornPaperBrownCard({ card, isDragging }: CardBodyProps) {
  const isFind = card.title.includes("find");
  const isPhoto = card.title.includes("Photo");
  const isIllustration = card.title.includes("Illustration");

  return (
    <div style={{ filter: "drop-shadow(-4px 3px 6px rgba(0,0,0,0.9))" }}>
      <div
        className={`relative ${isIllustration && "flex justify-center items-center"}`}
        style={{
          background: isFind ? "#8A7050" : "#A98C63",
          boxShadow: getCardShadow(isDragging),
          padding: isPhoto
            ? "20px 32px"
            : isIllustration
              ? "18px 32px"
              : "16px",
          width: isIllustration ? "200px !important" : undefined,
          clipPath:
            "polygon(2% 5%, 98% 0%, 100% 95%, 85% 98%, 70% 92%, 50% 100%, 30% 93%, 15% 98%, 0% 95%)",
        }}
      >
        {/* Paper grain texture */}
        <div
          className="absolute inset-0 mix-blend-multiply opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />

        <h3
          className="text-2xl"
          style={{
            fontFamily: '"Architects Daughter", cursive',
            color: "#4A1D15",
            transform: isFind ? "rotate(-3deg)" : "none",
            fontWeight: "bold",
            // width: isIllustration ? "fit-content" : undefined,
          }}
        >
          {renderLines(card.title)}
        </h3>
      </div>
    </div>
  );
}
