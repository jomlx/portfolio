import { useState } from "react";
import { useSpring } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { useSoundEffect } from "./useSoundEffect";
import { STRING_CONFIG } from "../constants/config";
export function useStringPhysics(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
) {
  const [pullState, setPullState] = useState({
    isPulled: false,
    pullX: 0,
    pullY: 0,
  });
  const { playTwang } = useSoundEffect();

  const [, pullApi] = useSpring(() => ({
    pullX: 0,
    pullY: 0,
    config: {
      tension: STRING_CONFIG.springTension.idle,
      friction: STRING_CONFIG.springFriction.idle,
      mass: STRING_CONFIG.springMass.idle,
    },
  }));

  const bindDraw = useDrag(
    ({ down, movement: [mx, my], velocity: [vx, vy], last }) => {
      if (down) {
        setPullState({ isPulled: true, pullX: mx, pullY: my });
        pullApi.start({ pullX: mx, pullY: my, immediate: true });
      }

      if (last) {
        setPullState({ isPulled: false, pullX: 0, pullY: 0 });
        if (
          Math.abs(mx) > STRING_CONFIG.dragSoundThreshold ||
          Math.abs(my) > STRING_CONFIG.dragSoundThreshold
        ) {
          playTwang();
        }

        pullApi.start({
          pullX: 0,
          pullY: 0,
          immediate: false,
          config: {
            tension: STRING_CONFIG.springTension.release,
            friction: STRING_CONFIG.springFriction.release,
            mass: STRING_CONFIG.springMass.release,
            velocity: [
              vx * STRING_CONFIG.pullVelocityFactor,
              vy * STRING_CONFIG.pullVelocityFactor,
            ],
          },
        });
      }
    },
  );

  const pathSpring = useSpring({
    path: `M ${startX} ${startY} Q ${(() => {
      const midX = (startX + endX) / 2;
      const midY = (startY + endY) / 2;

      const dx = endX - startX;
      const dy = endY - startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Calculate sag based on distance and the sag multiplier
      const sagY = distance * STRING_CONFIG.sagMultiplier;

      // Control point is offset downward and affected by pull state
      const controlX = midX + pullState.pullX;
      const controlY = midY + sagY + pullState.pullY;

      return `${controlX} ${controlY}`;
    })()} ${endX} ${endY}`,
    config: {
      tension: pullState.isPulled
        ? STRING_CONFIG.springTension.pulled
        : STRING_CONFIG.springTension.idle,
      friction: pullState.isPulled
        ? STRING_CONFIG.springFriction.pulled
        : STRING_CONFIG.springFriction.idle,
    },
  });

  return { pathSpring, bindDraw };
}
