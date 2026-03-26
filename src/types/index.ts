export type MediaType = "image" | "video";

export type CardType =
  | "silhouette"
  | "torn-paper-grey"
  | "torn-paper-brown"
  | "taped-polaroid"
  | "clue-circle"
  | "cork-text";

export interface CaseFileMedia {
  type: MediaType;
  url: string;
  caption?: string;
}

export interface PinOffset {
  x: number;
  y: number;
}

export interface CaseFile {
  id: string;
  title: string;
  subtitle: string;
  type: CardType;
  contentLabel?: string;
  content: string;
  detailsLabel?: string;
  details: string[];
  media?: CaseFileMedia[];
  x: number;
  y: number;
  rotation: number;
  pinOffset?: PinOffset;
  connections: string[];
  isDraggable?: boolean;
  width?: string;
}

export interface CardBodyProps {
  card: CaseFile;
  isDragging: boolean;
}

export interface DragState {
  isDragging: boolean;
  velocity: { x: number; y: number };
  offset: { x: number; y: number };
}

export interface PinPosition {
  x: number;
  y: number;
}

export interface CardConnection {
  id: string;
  fromId: string;
  toId: string;
}

export interface CaseFileModalProps {
  card: CaseFile | null;
  onClose: () => void;
  isLightOn: boolean;
  onToggleLight: () => void;
}

export interface ThumbTackProps {
  pinOffset?: PinOffset;
}

export interface BulbProps {
  isOn: boolean;
  onToggle: () => void;
}

export interface StringConnectorProps {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}
