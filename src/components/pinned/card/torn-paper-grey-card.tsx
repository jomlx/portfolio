import type { CardBodyProps } from "../../../interface/card";
import { getCardShadow } from "../helper";

export function TornPaperGreyCard({ card, isDragging }: CardBodyProps) {
  return (
    <div style={{ filter: "drop-shadow(-4px 3px 6px rgba(0,0,0,0.5))" }}>
      <div
        className="relative py-4 px-6 md:px-10 w-full"
        style={{
          background: "#D1CEC4",
          boxShadow: getCardShadow(isDragging),
          clipPath:
            "polygon(0% 2%, 95% 0%, 100% 90%, 95% 94%, 90% 88%, 85% 96%, 80% 90%, 75% 95%, 70% 88%, 65% 96%, 60% 89%, 55% 97%, 50% 90%, 45% 95%, 40% 89%, 35% 96%, 30% 88%, 25% 95%, 20% 89%, 15% 96%, 10% 88%, 5% 94%, 0% 88%)",
        }}
      >
        <h3
          className="text-2xl text-black w-full"
          style={{
            fontFamily: '"Architects Daughter", cursive',
            padding: "15px 16px",
            whiteSpace: "nowrap",
            letterSpacing: "1px",
          }}
        >
          {card.title}
        </h3>
      </div>
    </div>
  );
}
