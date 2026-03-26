import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Bulb from "./Bulb";
import StringConnector from "./StringConnector";
import CaseFileModal from "./CaseFileModal";
import caseFiles from "../data/caseFiles";
import Paper from "../assets/paper.webp";
import Wall from "../assets/wall.webp";
import type { CaseFile, PinPosition, CardConnection } from "../types";
import {
  buildConnectionMap,
  calculateRelativePinPosition,
} from "../utils/positions";
import { PORTFOLIO_META, ANIMATION_TIMINGS } from "../constants/config";
import { EFFECTS } from "../constants/styles";
import PinnedCard from "./pinned/pin-card";
import { ThumbTack } from "./thumb-tacks";

/* ── Spring config shared between CorkBoard slide-out and CaseFileModal slide-in ── */
const SLIDE_SPRING = { type: "spring", damping: 28, stiffness: 280 } as const;

export default function CorkBoard() {
  const boardRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<CaseFile | null>(null);
  const [hasEntered, setHasEntered] = useState(false);

  /* ── Single shared bulb state ── */
  const [isLightOn, setIsLightOn] = useState(true);

  const [pinPositions, setPinPositions] = useState<Record<string, PinPosition>>(
    {},
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStateChange = useCallback((id: string, isDragging: boolean) => {
    setDraggingId(isDragging ? id : null);
  }, []);

  const handleModalClose = useCallback(() => setSelectedCard(null), []);
  const handleToggleLight = useCallback(() => setIsLightOn((p) => !p), []);

  const updatePinPositions = useCallback(() => {
    if (!boardRef.current) return;
    const board = boardRef.current;
    const rect = board.getBoundingClientRect();
    const positions: Record<string, PinPosition> = {};

    caseFiles.forEach((card) => {
      const el = document.getElementById(`card-${card.id}`);
      if (el) {
        const pinEl = document.getElementById(`pin-${card.id}`);
        if (pinEl) {
          const pinRect = pinEl.getBoundingClientRect();
          positions[card.id] = {
            x: pinRect.left + pinRect.width / 2 - rect.left,
            y: pinRect.top + pinRect.height / 2 - rect.top,
          };
        } else {
          const cardRect = el.getBoundingClientRect();
          positions[card.id] = {
            x:
              cardRect.left +
              cardRect.width / 2 +
              (card.pinOffset?.x || 0) -
              rect.left,
            y: cardRect.top + 7 + (card.pinOffset?.y || 0) - rect.top,
          };
        }
      } else {
        positions[card.id] = {
          x: card.x * rect.width + (card.pinOffset?.x || 0),
          y: card.y * rect.height + (card.pinOffset?.y || 0),
        };
      }
    });
    setPinPositions(positions);
  }, []);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const startTime = Date.now();

    const loop = () => {
      updatePinPositions();
      if (Date.now() - startTime < ANIMATION_TIMINGS.layoutUpdateWindow) {
        timeoutId = setTimeout(loop, 40); // Throttle string updates to ~25fps to prevent severe layout thrashing
      }
    };
    loop();

    window.addEventListener("resize", updatePinPositions);
    const observer = new ResizeObserver(() => updatePinPositions());
    if (boardRef.current) observer.observe(boardRef.current);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updatePinPositions);
      observer.disconnect();
    };
  }, [updatePinPositions, hasEntered]);

  useEffect(() => {
    const timer = setTimeout(
      () => setHasEntered(true),
      ANIMATION_TIMINGS.cardEntryDelay,
    );
    return () => clearTimeout(timer);
  }, []);

  const handlePinMove = useCallback(
    (id: string, absX: number, absY: number) => {
      if (!boardRef.current) return;
      const rect = boardRef.current.getBoundingClientRect();
      const relativePos = calculateRelativePinPosition(absX, absY, rect);
      setPinPositions((prev) => ({
        ...prev,
        [id]: relativePos,
      }));
    },
    [],
  );

  const connections = useMemo<CardConnection[]>(
    () => buildConnectionMap(caseFiles),
    [],
  );

  const isModalOpen = selectedCard !== null;

  return (
    <div
      ref={boardRef}
      className="relative w-full h-full overflow-hidden"
      id="corkboard"
      role="main"
      aria-label="Interactive portfolio corkboard with case files"
      style={{
        filter: "url(#modal-grain)",
      }}
    >
      <svg className="hidden">
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency={EFFECTS.grain.baseFrequency}
            numOctaves={EFFECTS.grain.numOctaves}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend in="SourceGraphic" mode="multiply" />
        </filter>
      </svg>

      {/* ── CorkBoard slide-out wrapper: exits upward when modal opens ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ y: isModalOpen ? "-100%" : "0%" }}
        transition={SLIDE_SPRING}
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            filter: "url(#grain)",
            opacity: EFFECTS.grain.opacity,
            backgroundColor: EFFECTS.grain.color,
          }}
        />

        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: EFFECTS.vignette,
          }}
        />

        <div
          className="absolute pointer-events-none z-0 w-full h-full bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${Wall})` }}
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
              radial-gradient(circle at 50% 50%, rgba(255,255,255,0.02) 30%, transparent 60%),
              radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0.75) 100%)
            `,
              mixBlendMode: "multiply",
            }}
            aria-hidden="true"
          />
        </div>

        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-2 pointer-events-none z-0 w-2xl h-140 shadow-md shadow-black bg-cover bg-center opacity-80"
          style={{ backgroundImage: `url(${Paper})` }}
          aria-hidden="true"
        />

        <div
          className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-300 ${isLightOn ? "opacity-100" : "opacity-0"
            }`}
          style={{
            background: EFFECTS.lightPool as string,
          }}
          aria-hidden="true"
        />

        <div
          className={`absolute inset-0 z-35 pointer-events-none transition-opacity duration-300 ${isLightOn ? "opacity-0" : "opacity-100"
            }`}
          style={{ background: EFFECTS.darkOverlay as string }}
          aria-hidden="true"
        />

        <motion.div
          className="absolute top-8 left-[55%] -translate-x-1/2 z-30 pointer-events-none select-none"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: ANIMATION_TIMINGS.bannerDelay, duration: 0.5 }}
        >
          <div className="relative transform rotate-1">
            <div className="relative inline-block py-2 pr-10 pl-6 bg-[#D4C69E] shadow-[-7px_6px_12px_rgba(0,0,0,0.6)]">
              <div
                className="absolute -top-4 left-[15%] w-16 h-8 -rotate-2 opacity-70 bg-[#E6DCB8] shadow-[1px_1px_3px_rgba(0,0,0,0.3)]"
                style={{
                  clipPath: "polygon(5% 0, 95% 2%, 100% 100%, 0 98%)",
                }}
                aria-hidden="true"
              />
              <h1 className="whitespace-nowrap leading-none flex items-baseline font-['Special_Elite',cursive] text-[#222] text-[clamp(2.5rem,8vw,3.8rem)] opacity-85">
                {PORTFOLIO_META.title.split(" ")[0]}
                <span className="ml-2 inline-block font-['Architects_Daughter',cursive] text-[#A02B2B] text-[1.4rem] -rotate-25 opacity-80 font-bold">
                  {PORTFOLIO_META.year}
                </span>
              </h1>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-19 left-4 md:left-110 z-30 pointer-events-none select-none"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: ANIMATION_TIMINGS.caseFileDelay, duration: 0.5 }}
          style={{ transform: "rotate(-1deg)" }}
        >
          <div
            className="py-1 pr-7.5 pl-5 bg-[rgba(168,43,43,0.7)]"
            style={{
              clipPath: "polygon(0% 0%, 100% 2%, 99% 98%, 1% 100%)",
              padding: "6px 14px",
            }}
          >
            <p className="leading-[0.85] font-['Architects_Daughter',cursive] text-white text-[clamp(14px,3vw,20px)] opacity-90 tracking-widest">
              {PORTFOLIO_META.caseFileNumber}:
            </p>
            <p className=" leading-tight track-wide truncate max-w-30 md:max-w-none font-['Architects_Daughter',cursive] text-white text-[clamp(11px,2.2vw,14px)] opacity-85">
              {PORTFOLIO_META.tagline}
            </p>
          </div>
        </motion.div>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
          style={{ pointerEvents: "none" }}
          aria-hidden="true"
        >
          <g style={{ pointerEvents: "auto" }}>
            {connections.map((conn) => {
              const from = pinPositions[conn.fromId];
              const to = pinPositions[conn.toId];
              if (!from || !to) return null;
              return (
                <StringConnector
                  key={conn.id}
                  id={conn.id}
                  fromX={from.x}
                  fromY={from.y}
                  toX={to.x}
                  toY={to.y}
                />
              );
            })}
          </g>
        </svg>

        {caseFiles.map((card, i) => (
          <motion.div
            key={card.id}
            className="absolute"
            style={{
              left: `${card.x * 100}%`,
              top: `${card.y * 100}%`,
              zIndex: draggingId === card.id ? 100 : 10 + i,
            }}
            initial={{ opacity: 0, y: -80, scale: 0.8 }}
            animate={hasEntered ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              delay:
                ANIMATION_TIMINGS.cardEntryDelay +
                i * ANIMATION_TIMINGS.cardStaggerDelay,
              type: "spring",
              damping: 20,
              stiffness: 150,
            }}
          >
            <PinnedCard
              card={card}
              onPinMove={handlePinMove}
              onDragStateChange={handleDragStateChange}
              onClick={setSelectedCard}
            />
          </motion.div>
        ))}

        {/* ── Global Pin Layer (Above Strings) ── */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {caseFiles.map((card, i) => {
            const pos = pinPositions[card.id];
            if (!pos || card.type === "cork-text") return null;
            return (
              <motion.div
                key={`pin-${card.id}`}
                className="absolute pointer-events-none"
                style={{
                  left: pos.x,
                  top: pos.y,
                  zIndex: draggingId === card.id ? 100 : 30 + i,
                }}
              >
                <ThumbTack />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── CaseFileModal – slides in from below simultaneously ── */}
      <CaseFileModal
        card={selectedCard}
        onClose={handleModalClose}
        isLightOn={isLightOn}
        onToggleLight={handleToggleLight}
      />

      {/* ── Single shared Bulb — fixed above ALL layers including the modal ── */}
      {/* The full-screen fixed wrapper keeps z-index above modal (200) while    */}
      {/* Bulb's internal `absolute top-0 right-16` still positions it correctly */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 250 }}
      >
        <div className="pointer-events-auto">
          <Bulb isOn={isLightOn} onToggle={handleToggleLight} />
        </div>
      </div>
    </div>
  );
}
