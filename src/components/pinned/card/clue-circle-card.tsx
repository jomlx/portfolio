import type { CardBodyProps } from "../../../interface/card";
import { renderLines } from "../helper";

import figmaIcon from "../../../assets/skill/figma.png";
import photoshopIcon from "../../../assets/skill/adobe-photoshop.png";
import illustratorIcon from "../../../assets/skill/adobe-illustrator.png";
import reactIcon from "../../../assets/skill/react.png";
import capcutIcon from "../../../assets/skill/capcut.webp";
import canvaIcon from "../../../assets/skill/canva.png";
import tailwindIcon from "../../../assets/skill/tailwind-css.png";

// 3 – 4 layout (7 total). `forceBlack` renders icon as pure black.
const SKILL_ROWS: { icon: string; label: string; rotate: string }[][] = [
  [
    { icon: figmaIcon, label: "Figma", rotate: "-3deg" },
    { icon: photoshopIcon, label: "Photoshop", rotate: "2deg" },
    { icon: illustratorIcon, label: "Illustrator", rotate: "-1deg" },
  ],
  [
    { icon: reactIcon, label: "React", rotate: "2deg" },
    { icon: capcutIcon, label: "CapCut", rotate: "-2deg" },
    { icon: tailwindIcon, label: "Tailwind", rotate: "3deg" },
    { icon: canvaIcon, label: "Canva", rotate: "-1deg" },
  ],
];

// SVG fractal-noise grain data URI for grunge overlay
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

function GrungeIcon({
  icon,
  label,
  rotate,
}: {
  icon: string;
  label: string;
  rotate: string;
}) {
  return (
    <div style={{ transform: `rotate(${rotate})` }}>
      <div
        className="relative overflow-hidden"
        style={{
          width: 32,
          height: 32,
        }}
      >
        <img
          src={icon}
          alt={label}
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "grayscale(60%) sepia(35%) contrast(115%) brightness(0.78)",
            mixBlendMode: "multiply",
            background: "#c0a882",
          }}
        />
        {/* Grain noise */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: GRAIN_SVG,
            backgroundSize: "90px 90px",
            mixBlendMode: "overlay",
            opacity: 0.55,
          }}
        />
        {/* Edge vignette */}
        {/* background: "radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.5) 100%)", */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            mixBlendMode: "multiply",
          }}
        />
      </div>
    </div>
  );
}

{
  /* boxShadow: getCardShadow(isDragging),
        clipPath: "polygon(0% 0%, 98% 2%, 100% 98%, 2% 100%)", */
}
export function ClueCircleCard({ card }: CardBodyProps) {
  return (
    <div
      className="p-4 bg-transparent relative w-full h-full flex flex-col items-center"
      style={{}}
    >
      {/* ── Title + oval ring ─────────────────────────────────────── */}
      <div className="relative w-full">
        {/* Title — sits above the SVG in z order */}
        <h3
          className="relative z-10 text-center text-xl mt-1"
          style={{
            fontFamily: '"Architects_Daughter", cursive',
            color: "#BA3B2B",
            lineHeight: 1.2,
          }}
        >
          {renderLines(card.title)}
        </h3>

        {/* Hand-drawn oval — encircles the title only */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <ellipse
            cx="50"
            cy="55"
            rx="42"
            ry="25"
            fill="none"
            stroke="#C0392B"
            strokeWidth="2"
            style={{ opacity: 0.8 }}
          />
          <ellipse
            cx="51"
            cy="54"
            rx="44"
            ry="28"
            fill="none"
            stroke="#C0392B"
            strokeWidth="1.5"
            style={{ opacity: 0.5 }}
            transform="rotate(3 50 50)"
          />
        </svg>
      </div>

      {/* ── Skill icon grid — 3 / 4 ───────────────────────────────── */}
      <div className="flex flex-col items-center gap-[5px] mt-3">
        {SKILL_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-[5px]">
            {row.map((skill) => (
              <GrungeIcon key={skill.label} {...skill} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
