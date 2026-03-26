import { memo, useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CaseFileModalProps, CaseFileMedia, PinPosition } from "../types";
import { ANIMATION_TIMINGS } from "../constants/config";
import { COLORS, FONTS, EFFECTS } from "../constants/styles";
import { getRandomRotation } from "../utils/cardStyles";
import StringConnector from "./StringConnector";
import { getModalConnections } from "../data/modalConnections";
import Wall from "../assets/wall.webp";
import Paper from "../assets/paper.webp";

/* ─── Spring config — must match CorkBoard's SLIDE_SPRING ─── */
const SLIDE_SPRING = { type: "spring", damping: 28, stiffness: 280 } as const;

/* ─── Deterministic seeded value: consistent across renders ─── */
function seeded(seed: number, min: number, max: number) {
  const t = Math.abs(Math.sin(seed * 9301 + 4967) * 43758.5453) % 1;
  return min + t * (max - min);
}

/*
 ┌─ Paper (w-2xl ≈ 672px, h-140 ≈ 560px) ─────────────────────────┐
 │  Header  (left 3%, right 3%, top ~2.5%)                         │
 │  ┌────────────────────────────────────────────────────────────┐ │
 │  │  CASE FILE │ Title │ Subtitle                              │ │
 │  └────────────────────────────────────────────────────────────┘ │
 │  ┌── Newspaper col (left 3%, w 40%) ──┐  [📸card] [📸card]      │
 │  │  description text                  │  [📸card] [📸card]      │
 │  │  ─────────────────────────         │                         │
 │  │  ▸ Evidence Log                    │                         │
 │  │    • detail 1                      │                         │
 │  │    • detail 2                      │                         │
 │  └────────────────────────────────────┘                         │
 └─────────────────────────────────────────────────────────────────┘

 Media cards scattered to the RIGHT of the newspaper column.
 Clicking any card opens a full-screen preview lightbox (z-400).
*/

/* ─── Media card scatter slots [top%, left%, rotDeg] inside the paper ─── */
const MEDIA_SLOTS = [
  [20, 43, -3],
  [20, 68, 4],
  [54, 43, 5],
  [54, 68, -2],
  [37, 55, -2], // 5th (centre-right column)
  [20, 55, 3], // 6th
] as const;

/* ─── MiniPin ─── */
const MiniPin = memo(function MiniPin({ size = 14 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 30% 30%, #F1948A 0%, #C0392B 40%, #7B241C 100%)",
        borderRadius: "50%",
        boxShadow:
          "1px 2px 4px rgba(0,0,0,0.7), inset -1px -1px 3px rgba(0,0,0,0.5)",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 1,
          left: 2,
          width: size * 0.22,
          height: size * 0.22,
          background: "rgba(255,255,255,0.5)",
          borderRadius: "50%",
        }}
      />
    </div>
  );
});

/* ─── Media Preview Lightbox ─── */
const MediaPreview = memo(function MediaPreview({
  item,
  onClose,
}: {
  item: CaseFileMedia;
  onClose: () => void;
}) {
  return (
    <motion.div
      key="media-preview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 400,
        background: "rgba(10,6,3,0.88)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "zoom-out",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Preview: ${item.caption ?? "media"}`}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", damping: 22, stiffness: 260 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          /* Polaroid frame — auto-sizes around the actual media */
          background: "linear-gradient(180deg, #FAF6F0 0%, #F0E8D5 100%)",
          padding: "10px 10px 42px",
          boxShadow: "0 28px 90px rgba(0,0,0,0.9)",
          position: "relative",
          transform: `rotate(${seeded(42, -0.8, 0.8)}deg)`,
          /* width/height is driven by the media inside */
          maxWidth: "min(90vw, 1080px)",
          lineHeight: 0 /* collapse whitespace below inline media */,
        }}
      >
        {/* Tape strip */}
        <div
          style={{
            position: "absolute",
            top: -7,
            left: "50%",
            transform: "translateX(-50%) rotate(2deg)",
            width: 80,
            height: 17,
            background: "rgba(230,220,184,0.65)",
            clipPath: "polygon(5% 0, 95% 2%, 100% 100%, 0 98%)",
            zIndex: 5,
          }}
          aria-hidden="true"
        />

        {/* Media — natural aspect ratio, constrained only by viewport */}
        {item.type === "image" ? (
          <img
            src={item.url}
            alt={item.caption ?? "exhibit"}
            style={{
              display: "block",
              width: "auto",
              height: "auto",
              maxWidth: "min(88vw, 1060px)",
              maxHeight: "min(78vh, 720px)",
              objectFit: "contain",
            }}
          />
        ) : (
          <video
            src={item.url}
            controls
            autoPlay
            style={{
              display: "block",
              width: "auto",
              height: "auto",
              maxWidth: "min(88vw, 1060px)",
              maxHeight: "min(78vh, 720px)",
            }}
            aria-label={item.caption ?? "exhibit video"}
          />
        )}

        {/* Caption */}
        {item.caption && (
          <p
            style={{
              position: "absolute",
              bottom: 10,
              left: 0,
              width: "100%",
              textAlign: "center",
              fontFamily: FONTS.special,
              fontSize: "clamp(0.55rem, 1vw, 0.72rem)",
              color: "#2c1810",
              opacity: 0.72,
              lineHeight: 1.2,
            }}
          >
            {item.caption}
          </p>
        )}

        {/* Close — top-right of polaroid */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 5,
            right: 7,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: FONTS.marker,
            fontSize: "1rem",
            color: "#C0392B",
            lineHeight: 1,
            zIndex: 10,
            opacity: 0.75,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.75";
          }}
          aria-label="Close preview"
        >
          ✕
        </button>
      </motion.div>
    </motion.div>
  );
});

/* ═══════════════════════════════════════════════════════════════════════════
   CaseFileModal
   ─ Full-page detective board, slides in from below (z-200)
   ─ Bulb lives in CorkBoard at z-250; this component just reads isLightOn
   ─ Newspaper-style column for text; scattered polaroid cards for media
   ═══════════════════════════════════════════════════════════════════════════ */
function CaseFileModal({ card, onClose, isLightOn }: CaseFileModalProps) {
  const exhibitsRef = useRef<HTMLDivElement>(null);
  const [exhibitPins, setExhibitPins] = useState<Record<number, PinPosition>>(
    {},
  );
  const [previewItem, setPreviewItem] = useState<CaseFileMedia | null>(null);

  const handlePreviewClose = useCallback(() => setPreviewItem(null), []);

  const stringPairs = card ? getModalConnections(card.id) : [];

  /* ─── Pin positions for StringConnector ─── */
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const updateExhibitPins = useCallback(() => {
    if (!exhibitsRef.current || !card?.media) return;
    const sectionRect = exhibitsRef.current.getBoundingClientRect();
    const pins: Record<number, PinPosition> = {};
    card.media.forEach((_, idx) => {
      const pinEl = document.querySelector(
        `[data-exhibit-pin="${idx}"]`,
      ) as HTMLElement | null;
      if (!pinEl) return;
      const pr = pinEl.getBoundingClientRect();
      pins[idx] = {
        x: pr.left + pr.width / 2 - sectionRect.left,
        y: pr.top + pr.height / 2 - sectionRect.top,
      };
    });
    setExhibitPins(pins);
  }, [card?.media]);

  useEffect(() => {
    if (!card) return;
    const timers = [100, 400, 800, 1600].map((ms) =>
      setTimeout(updateExhibitPins, ms),
    );
    window.addEventListener("resize", updateExhibitPins);
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener("resize", updateExhibitPins);
    };
  }, [card, updateExhibitPins]);

  // Close preview on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewItem(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!card) return null;
  const mediaItems = card.media ?? [];

  // Keep the newspaper column present if it naturally has text
  const hasText = !!(card.content || (card.details && card.details.length > 0));

  return (
    <>
      <AnimatePresence>
        {card && (
          <motion.div
            key="case-file-page"
            className="fixed inset-0"
            style={{ zIndex: 200, overflow: "hidden" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SLIDE_SPRING}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${card.id}`}
            id={`modal-${card.id}`}
          >
            {/* ── Base dark background ── */}
            <div
              className="absolute inset-0"
              style={{ background: "#1a120a" }}
              aria-hidden="true"
            />

            {/* ── Wall texture ── */}
            <div
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url(${Wall})` }}
              aria-hidden="true"
            >
              <div
                className="absolute inset-0"
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

            {/* ── Grain ── */}
            <svg className="hidden">
              <filter id="modal-page-grain">
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
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                filter: "url(#modal-page-grain)",
                opacity: EFFECTS.grain.opacity,
                backgroundColor: EFFECTS.grain.color,
              }}
              aria-hidden="true"
            />

            {/* ── Vignette ── */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: EFFECTS.vignette }}
              aria-hidden="true"
            />

            {/* ── Light pool ── */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isLightOn ? "opacity-100" : "opacity-0"}`}
              style={{ background: EFFECTS.lightPool as string, zIndex: 2 }}
              aria-hidden="true"
            />

            {/* ── Dark overlay — z:35 covers all content (z-10→z-21) but not Back btn (z-50) ── */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isLightOn ? "opacity-0" : "opacity-100"}`}
              style={{ background: EFFECTS.darkOverlay as string, zIndex: 35 }}
              aria-hidden="true"
            />

            {/* ── CLASSIFIED watermark ── */}
            <div
              className="absolute top-1/2 left-1/2 pointer-events-none select-none"
              style={{
                fontFamily: FONTS.marker,
                fontSize: "clamp(3rem, 8vw, 7rem)",
                color: "rgba(192,57,43,0.035)",
                transform: "translate(-50%, -50%) rotate(-15deg)",
                whiteSpace: "nowrap",
                letterSpacing: "0.15em",
                zIndex: 4,
              }}
              aria-hidden="true"
            >
              CLASSIFIED
            </div>

            {/* ════════════════════════════════════════════════
                CORK PAPER — same as CorkBoard's paper element
                w-2xl h-140 rotate-2 opacity-80 shadow-md
                ════════════════════════════════════════════════ */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-2 pointer-events-none w-2xl h-140 shadow-md shadow-black bg-cover bg-center opacity-80"
              style={{ backgroundImage: `url(${Paper})`, zIndex: 5 }}
              aria-hidden="true"
            />

            {/* ════════════════════════════════════════════════
                CONTENT LAYER — same footprint as the paper
                ════════════════════════════════════════════════ */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-2 w-2xl h-140"
              style={{ zIndex: 10 }}
            >
              {/* ── HEADER ── full-width strip pinned at the top ── */}
              <motion.header
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.38 }}
                style={{
                  position: "absolute",
                  top: "2.8%",
                  left: "3%",
                  right: "3%",
                  background:
                    "linear-gradient(180deg, #faf8f0 0%, #f0ead6 100%)",
                  padding:
                    "clamp(8px,1.6vh,16px) clamp(10px,2vw,20px) clamp(6px,1.1vh,12px)",
                  boxShadow: "3px 4px 12px rgba(0,0,0,0.45)",
                  transform: `rotate(${getRandomRotation(0.8)}deg)`,
                  zIndex: 12,
                }}
              >
                {/* Top-centre pin */}
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 5,
                  }}
                >
                  <MiniPin size={17} />
                </div>

                {/* Paper-clip decoration */}
                <div
                  style={{
                    position: "absolute",
                    top: -6,
                    right: 32,
                    width: 18,
                    height: 44,
                    borderRadius: "9px 9px 0 0",
                    border: "2px solid #aaa",
                    borderBottom: "none",
                    transform: "rotate(5deg)",
                    opacity: 0.38,
                  }}
                  aria-hidden="true"
                />

                {/* CASE FILE stamp tag */}
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 0,
                    background: "rgba(168,43,43,0.78)",
                    padding: "2px 12px",
                    clipPath: "polygon(0% 0%, 100% 2%, 99% 98%, 1% 100%)",
                    transform: "rotate(-1.2deg)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: FONTS.architectsDaughter,
                      fontSize: "clamp(7px, 1.1vw, 10px)",
                      color: "#fff",
                      letterSpacing: "0.12em",
                      opacity: 0.95,
                    }}
                  >
                    CASE FILE
                  </p>
                </div>

                <h2
                  id={`modal-title-${card.id}`}
                  style={{
                    fontFamily: FONTS.special,
                    color: "#2c1810",
                    fontSize: "clamp(1.25rem, 3.6vw, 2.2rem)",
                    lineHeight: 1.08,
                    marginBottom: "2px",
                    paddingTop: "2px",
                    opacity: 0.85,
                  }}
                >
                  {card.title}
                </h2>

                {card.subtitle && (
                  <p
                    style={{
                      fontFamily: FONTS.architectsDaughter,
                      fontSize: "clamp(0.5rem, 0.88vw, 0.63rem)",
                      textTransform: "uppercase",
                      letterSpacing: "0.22em",
                      opacity: 0.48,
                      color: "#2c1810",
                    }}
                  >
                    {card.subtitle}
                  </p>
                )}

                {/* Bottom rule */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: "4%",
                    width: "92%",
                    borderBottom: "2px dashed rgba(0,0,0,0.13)",
                  }}
                  aria-hidden="true"
                />
              </motion.header>

              {/* ════════════════════════════════════════════════
                  NEWSPAPER COLUMN — directly below header,
                  narrower than header, left-aligned.
                  Text sits here; media cards overlap on right.
                  ════════════════════════════════════════════════ */}
              {hasText && (
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.4 }}
                  style={{
                    position: "absolute",
                    /* sits flush below header, which ends ~17% from top */
                    top: "19%",
                    left: "3%",
                    /* narrower than the header (header spans left:3%→right:3% = 94% of paper) */
                    width: mediaItems.length > 0 ? "39%" : "60%",
                    /* stretch most of the remaining vertical space */
                    bottom: "4%",
                    overflow: "hidden",

                    /* newspaper-feel background */
                    background:
                      "linear-gradient(175deg, #faf7ef 0%, #f5edda 60%, #ecddc0 100%)",
                    boxShadow: "3px 5px 14px rgba(0,0,0,0.38)",
                    transform: `rotate(${getRandomRotation(-0.7)}deg)`,
                    zIndex: 11,

                    /* inner padding */
                    padding: "clamp(10px,1.8vh,18px) clamp(10px,1.8vw,18px)",
                  }}
                >
                  {/* Pin at top-right corner of the column */}
                  <div
                    style={{
                      position: "absolute",
                      top: -6,
                      right: 14,
                      zIndex: 5,
                    }}
                  >
                    <MiniPin size={13} />
                  </div>

                  {/* Thin top rule like a newspaper column header */}
                  <div
                    style={{
                      borderTop: "2px solid rgba(0,0,0,0.18)",
                      marginBottom: "8px",
                      paddingTop: "6px",
                    }}
                  />

                  {/* Column header label */}
                  <p
                    style={{
                      fontFamily: FONTS.special,
                      fontSize: "clamp(0.6rem, 1vw, 0.85rem)",
                      color: COLORS.text.red,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      marginBottom: "6px",
                      opacity: 0.75,
                    }}
                  >
                    ▸ {card.contentLabel || "Case Summary"}
                  </p>

                  {/* Description */}
                  {card.content && (
                    <p
                      style={{
                        color: "#2c1810",
                        fontFamily: FONTS.architectsDaughter,
                        fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)",
                        lineHeight: 1.55,
                        marginBottom: "10px",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {card.content}
                    </p>
                  )}

                  {/* Divider rule */}
                  {card.content && card.details && card.details.length > 0 && (
                    <div
                      style={{
                        borderTop: "1px dashed rgba(0,0,0,0.16)",
                        margin: "8px 0",
                      }}
                    />
                  )}

                  {/* Evidence log */}
                  {card.details && card.details.length > 0 && (
                    <>
                      <h3
                        style={{
                          fontFamily: FONTS.special,
                          color: COLORS.text.red,
                          fontSize: "clamp(0.6rem, 1vw, 0.85rem)",
                          textTransform: "uppercase",
                          letterSpacing: "0.12em",
                          marginBottom: "6px",
                        }}
                      >
                        ▸ {card.detailsLabel || "Evidence Log"}
                      </h3>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {card.details.map((detail, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay:
                                ANIMATION_TIMINGS.modalEnter +
                                i * ANIMATION_TIMINGS.cardStaggerDelay,
                            }}
                            style={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "4px",
                              color: "#3d2b1f",
                              fontFamily: FONTS.architectsDaughter,
                              fontSize: "clamp(0.55rem, 0.9vw, 0.75rem)",
                              marginBottom: "3px",
                              lineHeight: 1.45,
                            }}
                          >
                            <span
                              style={{
                                color: "#C0392B",
                                flexShrink: 0,
                                marginTop: "1px",
                              }}
                            >
                              •
                            </span>
                            <span>{detail}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Coffee-ring decoration inside column */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 10,
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background:
                        "radial-gradient(circle, rgba(74,44,23,0.07) 0%, transparent 50%)",
                      border: "2px solid rgba(74,44,23,0.05)",
                    }}
                    aria-hidden="true"
                  />
                </motion.div>
              )}

              {/* ════════════════════════════════════════════════
                  MEDIA CARDS — scattered in the right region,
                  visually balanced, clickable for preview.
                  ════════════════════════════════════════════════ */}
              {mediaItems.length > 0 && (
                <div
                  ref={exhibitsRef}
                  className="absolute inset-0"
                  style={{ zIndex: 15 }}
                >
                  {/* "EXHIBITS" stamp label */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      position: "absolute",
                      top: "19%",
                      right: "2%",
                      fontFamily: FONTS.architectsDaughter,
                      color: "rgba(192,57,43,0.45)",
                      fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      transform: "rotate(1.5deg)",
                    }}
                    aria-hidden="true"
                  >
                    ▸ Exhibits
                  </motion.p>

                  {mediaItems.map((item, idx) => {
                    const slot = MEDIA_SLOTS[idx % MEDIA_SLOTS.length];
                    /* nudge each slot with a tiny seeded offset for scatter */
                    const topPct = slot[0] + seeded(idx * 11 + 1, -1.5, 1.5);
                    const leftPct = slot[1] + seeded(idx * 11 + 2, -1.5, 1.5);
                    const rot = slot[2] + seeded(idx * 11 + 3, -1, 1);

                    return (
                      <motion.figure
                        key={idx}
                        initial={{ opacity: 0, scale: 0.86, rotate: rot * 2.2 }}
                        animate={{ opacity: 1, scale: 1, rotate: rot }}
                        transition={{
                          delay:
                            0.28 + idx * ANIMATION_TIMINGS.cardStaggerDelay,
                          type: "spring",
                          damping: 18,
                          stiffness: 140,
                        }}
                        style={{
                          position: "absolute",
                          top: `${topPct}%`,
                          left: `${leftPct}%`,
                          width: "clamp(100px, 24%, 166px)",
                          zIndex: idx + 16,
                          cursor: "zoom-in",
                        }}
                        onClick={() => setPreviewItem(item)}
                        title={item.caption ?? `Exhibit ${idx + 1}`}
                        role="button"
                        aria-label={`View ${item.caption ?? `exhibit ${idx + 1}`} in full size`}
                      >
                        {/* Polaroid frame */}
                        <div
                          style={{
                            background:
                              "linear-gradient(180deg, #FAF6F0 0%, #F0E8D5 100%)",
                            padding: "6px 6px 24px",
                            boxShadow: "4px 6px 16px rgba(0,0,0,0.55)",
                            position: "relative",
                            height: "clamp(88px, 29%, 148px)",
                            display: "flex",
                            flexDirection: "column",
                            transition:
                              "box-shadow 0.18s ease, transform 0.18s ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.boxShadow =
                              "6px 10px 24px rgba(0,0,0,0.72)";
                            el.style.transform = "scale(1.04)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget as HTMLDivElement;
                            el.style.boxShadow =
                              "4px 6px 16px rgba(0,0,0,0.55)";
                            el.style.transform = "scale(1)";
                          }}
                        >
                          {/* Pin anchor for string connector */}
                          <div
                            data-exhibit-pin={idx}
                            style={{
                              position: "absolute",
                              top: -5,
                              left: "50%",
                              transform: "translateX(-50%)",
                              zIndex: 5,
                              width: 14,
                              height: 14,
                            }}
                          />

                          {/* Tape strip */}
                          <div
                            style={{
                              position: "absolute",
                              top: -4,
                              left: "50%",
                              transform: "translateX(-50%) rotate(2deg)",
                              width: 42,
                              height: 11,
                              background: "rgba(230,220,184,0.65)",
                              clipPath:
                                "polygon(5% 0, 95% 2%, 100% 100%, 0 98%)",
                              zIndex: 4,
                            }}
                            aria-hidden="true"
                          />

                          {/* Media thumbnail */}
                          <div
                            style={{
                              background: "#1A1A1A",
                              flex: 1,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                              minHeight: 0,
                            }}
                          >
                            {item.type === "image" ? (
                              <img
                                src={item.url}
                                alt={
                                  item.caption ??
                                  `Exhibit ${(idx + 1).toString().padStart(2, "0")}`
                                }
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                loading="lazy"
                                draggable={false}
                              />
                            ) : (
                              /* Video — thumbnail only, clicking opens preview */
                              <video
                                src={item.url}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  pointerEvents: "none",
                                }}
                                preload="metadata"
                                muted
                                aria-label={
                                  item.caption ??
                                  `Exhibit ${(idx + 1).toString().padStart(2, "0")} video`
                                }
                              />
                            )}
                          </div>

                          {/* Caption on polaroid */}
                          {item.caption && (
                            <figcaption
                              style={{
                                position: "absolute",
                                bottom: 4,
                                left: 0,
                                width: "100%",
                                textAlign: "center",
                                fontSize: "clamp(0.38rem, 0.7vw, 0.52rem)",
                                fontFamily: FONTS.special,
                                color: "#1A1208",
                                opacity: 0.68,
                              }}
                            >
                              Exhibit {(idx + 1).toString().padStart(2, "0")} –{" "}
                              {item.caption}
                            </figcaption>
                          )}
                        </div>

                        {/* Pin overlay */}
                        <div
                          style={{
                            position: "absolute",
                            top: -8,
                            left: "50%",
                            transform: "translateX(-50%)",
                            zIndex: 20,
                          }}
                        >
                          <MiniPin size={13} />
                        </div>
                      </motion.figure>
                    );
                  })}

                  {/* ─── Red String Layer ─── */}
                  <svg
                    className="absolute inset-0 w-full h-full"
                    style={{ zIndex: 25, pointerEvents: "none" }}
                    aria-hidden="true"
                  >
                    <g style={{ pointerEvents: "auto" }}>
                      {stringPairs.map((pair, idx) => {
                        const from = exhibitPins[pair.from];
                        const to = exhibitPins[pair.to];
                        if (!from || !to) return null;
                        return (
                          <StringConnector
                            key={`modal-string-${idx}`}
                            id={`modal-string-${idx}`}
                            fromX={from.x}
                            fromY={from.y}
                            toX={to.x}
                            toY={to.y}
                          />
                        );
                      })}
                    </g>
                  </svg>
                </div>
              )}
              {/* ── BACK button — bottom-right of paper, z:50 (above dark overlay z:35) ── */}
              <button
                onClick={onClose}
                id={`modal-close-${card.id}`}
                aria-label="Go back to corkboard"
                type="button"
                style={{
                  position: "absolute",
                  bottom: "3.5%",
                  right: "3.5%",
                  zIndex: 50,
                  background: "rgba(168,43,43,0.82)",
                  border: "none",
                  cursor: "pointer",
                  padding: "5px 16px 4px",
                  clipPath: "polygon(0% 0%, 100% 2%, 99% 98%, 1% 100%)",
                  transform: "rotate(-1.5deg)",
                  boxShadow: "2px 3px 8px rgba(0,0,0,0.5)",
                  transition: "opacity 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.78";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                <span
                  style={{
                    fontFamily: FONTS.architectsDaughter,
                    fontSize: "clamp(9px, 1.4vw, 13px)",
                    color: "#fff",
                    letterSpacing: "0.14em",
                    opacity: 0.95,
                    display: "inline-block",
                    transform: "rotate(0.5deg)",
                  }}
                >
                  ← BACK
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Media Preview Lightbox (above everything) ── */}
      <AnimatePresence>
        {previewItem && (
          <MediaPreview
            item={previewItem}
            onClose={handlePreviewClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(CaseFileModal);
