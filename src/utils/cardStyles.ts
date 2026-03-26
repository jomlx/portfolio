import { CARD_SHADOWS, CARD_WIDTHS } from "../constants/styles";
import type { CardType } from "../types";

export function getCardShadow(isDragging: boolean): string {
  return isDragging ? CARD_SHADOWS.dragging : CARD_SHADOWS.default;
}

export function getCardWidthClass(cardType: CardType): string {
  return CARD_WIDTHS[cardType] ?? CARD_WIDTHS.default;
}

export function getTornEdgeClipPath(): string {
  return "polygon(0% 2%, 95% 0%, 100% 90%, 95% 94%, 90% 88%, 85% 96%, 80% 90%, 75% 95%, 70% 88%, 65% 96%, 60% 89%, 55% 97%, 50% 90%, 45% 95%, 40% 89%, 35% 96%, 30% 88%, 25% 95%, 20% 89%, 15% 96%, 10% 88%, 5% 94%, 0% 88%)";
}

export function getRandomRotation(maxRotation: number = 2): number {
  return (Math.random() - 0.5) * 2 * maxRotation;
}

export function getCardTypeLabel(cardType: CardType): string {
  const labels: Record<CardType, string> = {
    silhouette: "Profile Card",
    "torn-paper-grey": "Graphic Design Card",
    "torn-paper-brown": "Project Card",
    "taped-polaroid": "Videography Card",
    "clue-circle": "Interactive Clue",
    "cork-text": "Quote Card",
  };
  return labels[cardType] ?? "Card";
}

export function isCardClickable(cardType: CardType): boolean {
  const nonClickableTypes: CardType[] = ["clue-circle", "cork-text"];
  return !nonClickableTypes.includes(cardType);
}

export function isCardDraggableByDefault(cardType: CardType): boolean {
  const noDragTypes: CardType[] = ["clue-circle", "cork-text"];
  return !noDragTypes.includes(cardType);
}
