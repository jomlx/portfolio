import { useDrag } from "@use-gesture/react";
import React, { useRef, useState, useCallback, memo } from "react";
import { animated } from "react-spring";
import { useDragPhysics } from "../../hooks/useDragPhysics";
import type { CardBodyProps, CaseFile } from "../../interface/card";
import { SilhouetteCard } from "./card/silhouette-card";
import { CorkTextCard } from "./card/cork-text-card";
import { TapedPolaroidCard } from "./card/taped-polaroid-card";
import { TornPaperBrownCard } from "./card/torn-paper-brown-card";
import { TornPaperGreyCard } from "./card/torn-paper-grey-card";
import { ClueCircleCard } from "./card/clue-circle-card";

interface PinnedCardProps {
  card: CaseFile;
  onPinMove: (id: string, x: number, y: number) => void;
  onDragStateChange: (id: string, isDragging: boolean) => void;
  onClick: (card: CaseFile) => void;
}

const CARD_COMPONENTS: Record<string, React.ComponentType<CardBodyProps>> = {
  silhouette: SilhouetteCard,
  "taped-polaroid": TapedPolaroidCard,
  "torn-paper-grey": TornPaperGreyCard,
  "torn-paper-brown": TornPaperBrownCard,
  "clue-circle": ClueCircleCard,
  "cork-text": CorkTextCard,
};

function PinnedCard({
  card,
  onPinMove,
  onDragStateChange,
  onClick,
}: PinnedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isDraggable = card.isDraggable !== false;
  const isClickable = card.type !== "clue-circle" && card.type !== "cork-text";

  const {
    dragState,
    rotationSpring,
    hasDragged,
    onDragStart,
    onDragMove,
    onDragEnd,
  } = useDragPhysics(card.rotation);

  // ── Compute pin position from card DOM rect ──
  const updatePinPosition = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const pinX = rect.left + rect.width / 2 + (card.pinOffset?.x || 0);
    const pinY = rect.top + 7 + (card.pinOffset?.y || 0);
    onPinMove(card.id, pinX, pinY);
  };

  // ── Drag gesture binding ──
  const bind = useDrag(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ down, movement: [mx, my], velocity: [vx, vy], first, last }: any) => {
      if (!isDraggable) return;

      if (first) {
        onDragStart();
        onDragStateChange(card.id, true);
      }

      if (down) {
        setPosition({ x: mx, y: my });
        onDragMove({ x: mx, y: my }, { x: vx, y: vy });
        updatePinPosition();
      }

      if (last) {
        setPosition({ x: 0, y: 0 });
        onDragEnd();
        onDragStateChange(card.id, false);
        requestAnimationFrame(updatePinPosition);
      }
    },
    { filterTaps: true },
  );

  // ── Click handler — ignore drags and non-clickable types ──
  const handleClick = useCallback(() => {
    if (!hasDragged() && isClickable) onClick(card);
  }, [card, onClick, hasDragged, isClickable]);

  // ── Resolve which body component to render ──
  const CardBody = CARD_COMPONENTS[card.type];

  const CARD_WIDTH_CLASSES: Record<string, string> = {
    default: "w-[110px] md:w-[155px]",
    silhouette: "w-[160px] md:w-[220px]",
    "taped-polaroid": "w-[110px] md:w-[145px]",
    "torn-paper-brown": "w-[130px] md:w-[170px]", // 165
    "torn-paper-grey": "w-[125px] md:w-[215px]",
    "cork-text": "w-[160px] md:w-[210px]",
    "clue-circle": "w-[125px] md:w-[160px]",
  };

  const getWidthClass = (type: string) =>
    CARD_WIDTH_CLASSES[type] ?? CARD_WIDTH_CLASSES.default;

  return (
    <animated.div
      {...(isDraggable ? bind() : {})}
      ref={cardRef}
      id={`card-${card.id}`}
      onClick={handleClick}
      className={`absolute select-none touch-none aspect-auto flex justify-center ${getWidthClass(card.type)}`}
      style={{
        transform: `translate(-50%, -50%) translate(${position.x}px, ${position.y}px)`,
        zIndex: 1, // Controlled by parent motion.div now, but kept relative to it
        willChange: "transform",
        cursor: !isDraggable
          ? "default"
          : dragState.isDragging
            ? "grabbing"
            : "grab",
        rotate: rotationSpring.rotate.to((r: number) => `${r}deg`),
        scale: rotationSpring.scale,
      }}
    >
      <div className="w-full relative">
        {CardBody ? (
          <CardBody card={card} isDragging={dragState.isDragging} />
        ) : (
          // Fallback for unknown card types
          <div className="p-3 bg-white/80 text-xs text-gray-700">
            {card.title}
          </div>
        )}
      </div>
    </animated.div>
  );
}

export default memo(PinnedCard);
