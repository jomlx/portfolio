import { useRef, useCallback, useState } from 'react';
import { useSpring } from 'react-spring';

interface DragState {
  isDragging: boolean;
  velocity: { x: number; y: number };
  offset: { x: number; y: number };
}

/**
 * Encapsulates drag physics: position tracking, velocity tilt calculation,
 * and snap-back spring config for PinnedCard.
 */
export function useDragPhysics(initialRotation: number = 0) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    velocity: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
  });

  // Track if it was a genuine drag vs a click
  const hasDraggedRef = useRef(false);
  const dragDistRef = useRef(0);

  // Spring for rotation snap-back
  const [rotationSpring, rotationApi] = useSpring(() => ({
    rotate: initialRotation,
    scale: 1,
    config: { tension: 200, friction: 20 },
  }));

  const onDragStart = useCallback(() => {
    hasDraggedRef.current = false;
    dragDistRef.current = 0;
    setDragState(prev => ({ ...prev, isDragging: true }));
    rotationApi.start({ scale: 1.05 });
  }, [rotationApi]);

  const onDragMove = useCallback((
    offset: { x: number; y: number },
    velocity: { x: number; y: number },
  ) => {
    const dist = Math.sqrt(offset.x * offset.x + offset.y * offset.y);
    dragDistRef.current = dist;
    if (dist > 5) hasDraggedRef.current = true;

    // Tilt based on horizontal velocity (clamped)
    const tilt = Math.max(-15, Math.min(15, velocity.x * 2));

    setDragState({
      isDragging: true,
      velocity,
      offset,
    });

    rotationApi.start({
      rotate: initialRotation + tilt,
      immediate: true,
    });
  }, [initialRotation, rotationApi]);

  const onDragEnd = useCallback(() => {
    setDragState(prev => ({
      ...prev,
      isDragging: false,
      velocity: { x: 0, y: 0 },
    }));

    // Snap rotation back with a satisfying spring
    rotationApi.start({
      rotate: initialRotation,
      scale: 1,
      config: { tension: 300, friction: 15 },
    });
  }, [initialRotation, rotationApi]);

  return {
    dragState,
    rotationSpring,
    hasDragged: () => hasDraggedRef.current,
    onDragStart,
    onDragMove,
    onDragEnd,
  };
}
