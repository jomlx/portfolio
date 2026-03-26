/**
 * @file Modal exhibit string connections
 * Defines which exhibit items (by media index) are connected
 * by red strings inside each card's modal.
 *
 * Format: cardId → array of [fromIndex, toIndex] pairs
 * Indices correspond to the card's `media` array order.
 *
 * Example: [0, 2] draws a string from media[0]'s pin to media[2]'s pin.
 */

export interface ModalConnection {
  from: number;
  to: number;
}

const modalConnections: Record<string, ModalConnection[]> = {
  // Graphic Design – 5 exhibits (indices 0–4)
  design: [
    { from: 0, to: 1 },
    { from: 1, to: 2 },
    { from: 3, to: 4 },
  ],

  // Videography – 4 exhibits (indices 0–3)
  video: [
    { from: 0, to: 1 },
    { from: 2, to: 3 },
    { from: 0, to: 3 },
  ],
};

/**
 * Get the string connections for a given card's modal.
 * Returns an empty array if no connections are defined.
 */
export function getModalConnections(cardId: string): ModalConnection[] {
  return modalConnections[cardId] ?? [];
}

export default modalConnections;
