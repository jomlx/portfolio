import type {
  PinPosition,
  PinOffset,
  CaseFile,
  CardConnection,
} from "../types";

export function calculatePinPositionFromCard(
  cardElement: HTMLElement,
  boardRect: DOMRect,
  pinOffset?: PinOffset,
): PinPosition {
  const cardRect = cardElement.getBoundingClientRect();
  return {
    x:
      cardRect.left + cardRect.width / 2 + (pinOffset?.x || 0) - boardRect.left,
    y: cardRect.top + 7 + (pinOffset?.y || 0) - boardRect.top,
  };
}

export function calculateRelativePinPosition(
  absX: number,
  absY: number,
  boardRect: DOMRect,
): PinPosition {
  return {
    x: absX - boardRect.left,
    y: absY - boardRect.top,
  };
}

export function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function isDragThresholdExceeded(
  offset: { x: number; y: number },
  threshold: number,
): boolean {
  return calculateDistance(0, 0, offset.x, offset.y) > threshold;
}

export function calculateStringPath(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  sagMultiplier: number = 0.3,
  pullX: number = 0,
  pullY: number = 0,
): string {
  const midX = (fromX + toX) / 2;
  const midY = (fromY + toY) / 2;

  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const sagY = distance * sagMultiplier;
  const controlX = midX + pullX;
  const controlY = midY + sagY + pullY;

  return `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function buildConnectionMap(cards: CaseFile[]): CardConnection[] {
  const connections: CardConnection[] = [];
  const seen = new Set<string>();

  cards.forEach((card) => {
    card.connections.forEach((targetId) => {
      const key = [card.id, targetId].sort().join("-");
      if (!seen.has(key)) {
        seen.add(key);
        connections.push({
          id: key,
          fromId: card.id,
          toId: targetId,
        });
      }
    });
  });

  return connections;
}

export function calculateVelocity(
  currentPos: number,
  previousPos: number,
  deltaTime: number,
): number {
  if (deltaTime === 0) return 0;
  return (currentPos - previousPos) / deltaTime;
}

export function isPointInRect(x: number, y: number, rect: DOMRect): boolean {
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
}

export function calculateCenterPoint(
  pos1: PinPosition,
  pos2: PinPosition,
): PinPosition {
  return {
    x: (pos1.x + pos2.x) / 2,
    y: (pos1.y + pos2.y) / 2,
  };
}

export function normalizeCoordinate(value: number, max: number): number {
  return clamp(value / max, 0, 1);
}

export function denormalizeCoordinate(value: number, max: number): number {
  return value * max;
}
