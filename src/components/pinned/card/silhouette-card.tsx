import type { CardBodyProps } from "../../../types";
import { getCardShadow } from "../helper";

export function SilhouetteCard({ card, isDragging }: CardBodyProps) {
  return (
    <div className="relative">
      {/* Background duplicate card slightly rotated */}
      <div className="absolute inset-0 bg-[#E8E2D2] -rotate-3 z-0 origin-bottom-left shadow-[-6px_12px_24px_rgba(0,0,0,0.9)]" />

      <div
        className="p-4 relative z-10 bg-[#F0EAD6]"
        style={{ boxShadow: getCardShadow(isDragging) }}
      >
        <div className="w-full aspect-3/4 mb-3 flex justify-center items-end overflow-hidden shadow-inner bg-[#d4ceb8]">
          <svg
            viewBox="0 0 100 140"
            className="w-[85%] h-[85%] relative bottom-0"
          >
            <path
              d="M 50 15 A 18 18 0 1 0 50 51 A 18 18 0 1 0 50 15 M 20 70 Q 50 50 80 70 L 95 140 L 5 140 Z"
              fill="#3E1A1A"
            />
            <g
              stroke="#D03020"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M 36 48 C 36 26, 64 26, 64 48 C 64 62, 50 65, 50 82" />
              <circle cx="50" cy="100" r="4.5" fill="#D03020" strokeWidth="0" />
            </g>
          </svg>
        </div>
        <p className="text-center font-['Special_Elite',cursive] text-[12px] text-[#1A1208] leading-[1.2]">
          {card.title}
        </p>
      </div>
    </div>
  );
}
