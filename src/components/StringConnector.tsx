import { memo } from "react";
import { useStringPhysics } from "../hooks/useStringPhysics";
import { animated } from "react-spring";
import type { StringConnectorProps } from "../types";

function StringConnector({ fromX, fromY, toX, toY }: StringConnectorProps) {
  const { pathSpring, bindDraw } = useStringPhysics(fromX, fromY, toX, toY);

  return (
    <>
      <animated.path
        d={pathSpring.path}
        fill="none"
        stroke="transparent"
        strokeWidth="18"
        style={{ cursor: "pointer" }}
        {...bindDraw()}
      />
      <animated.path
        d={pathSpring.path}
        fill="none"
        stroke="#E8453C"
        strokeWidth="3.5"
        strokeDasharray="none"
        style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))" }}
        pointerEvents="none"
      />
    </>
  );
}

export default memo(StringConnector);
