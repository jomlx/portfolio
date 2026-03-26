import type { CardBodyProps } from "../../../interface/card";
import { renderLines } from "../helper";
import logoWhite from "../../../assets/logo-white.png";

export function TapedPolaroidCard({ card }: CardBodyProps) {
  return (
    <div
      className="relative"
      style={{ filter: "drop-shadow(-4px 3px 6px rgba(0,0,0,0.9))" }}
    >
      {/* Yellow sticky note background */}
      <div
        className="absolute inset-0 bg-[#E5D275] -rotate-2 -left-4 -right-20 origin-bottom-left shadow-lg"
        style={{
          clipPath: "polygon(0 0, 100% 2%, 98% 100%, 2% 98%)",
          left: "10%",
          bottom: "15%",
        }}
      >
        <h3
          className="absolute right-3 top-10 rotate-7 leading-none text-xl"
          style={{
            fontFamily: '"Architects_Daughter", cursive',
            color: "#1A1208",
            opacity: 0.8,
            letterSpacing: "1px",
          }}
        >
          {renderLines(card.title)}
        </h3>
      </div>

      {/* Red tape strips */}
      <div
        className="absolute z-20 -top-2 left-[10%] w-10 h-6 bg-[#A82B2B]/90 -rotate-15 shadow-sm"
        style={{ clipPath: "polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)" }}
      />
      <div
        className="absolute z-20 top-0 right-[10%] w-12 h-6 bg-[#A82B2B]/90 rotate-10 shadow-sm"
        style={{ clipPath: "polygon(2% 0%, 98% 5%, 100% 95%, 0% 90%)" }}
      />

      {/* Polaroid frame */}
      <div
        className="relative z-10 ml-2"
        style={{
          background: "#FAF6F0",
          boxShadow: "2px 4px 8px rgba(0,0,0,0.4)",
          padding: "10px 10px 30px 10px",
          width: "85%",
        }}
      >
        <div className="w-full aspect-[1/0.95] mb-2 bg-[#1A1A1A] relative overflow-hidden flex items-center justify-center">
          <img
            src={logoWhite}
            alt="Logo"
            className="w-4/5 h-4/5 object-contain"
          />
        </div>
      </div>
    </div>
  );
}
