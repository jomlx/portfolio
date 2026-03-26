import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";
import { useRef } from "react";
interface BulbProps {
  isOn: boolean;
  onToggle: () => void;
}
export default function Bulb({ isOn, onToggle }: BulbProps) {
  const [{ y }, api] = useSpring(() => ({
    y: 0,
    config: { tension: 350, friction: 25 },
  }));
  const toggledRef = useRef(false);
  const bind = useDrag(
    ({ movement: [, my], down, first }) => {
      if (first) {
        toggledRef.current = false;
      }
      const pullY = Math.max(0, my);
      const resistanceY = pullY * 0.4;
      if (down) {
        api.start({ y: resistanceY });
        if (pullY > 60 && !toggledRef.current) {
          toggledRef.current = true;
          onToggle();
        }
      } else {
        api.start({ y: 0 });
      }
    },
    { filterTaps: true },
  );
  const duration = "var(--transition-duration, 150ms)";
  const transition = `all ${duration} ease-in-out`;
  return (
    <div className="absolute top-0 right-16 md:right-65 flex flex-col items-center z-40 touch-none select-none">
      {/* Cord */}
      <animated.div
        className="w-1 bg-[#1a1a1a]"
        style={{
          height: "100px",
          boxShadow: "1px 0 2px rgba(0,0,0,0.5)",
          transformOrigin: "top center",
          scaleY: y.to((v) => (100 + v) / 100),
        }}
      />
      <animated.div
        {...bind()}
        className="flex flex-col items-center cursor-grab active:cursor-grabbing"
        style={{ y }}
      >
        {/* Screw base */}
        <div style={{ position: "relative", width: "50px", marginTop: "-2px" }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                height: "7px",
                background: `linear-gradient(180deg, #888 0%, #555 40%, #777 60%, #444 100%)`,
                borderRadius:
                  i === 0 ? "4px 4px 0 0" : i === 4 ? "0 0 4px 4px" : "0",
                marginBottom: "1px",
                boxShadow:
                  "inset 0 1px 2px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.4)",
                width: `${50 - i * 3}px`,
                marginLeft: `${i * 1.5}px`,
              }}
            />
          ))}
        </div>

        {/* Bulb glass */}
        <div
          className="relative flex items-center justify-center -mt-1"
          style={{
            width: "70px",
            height: "100px",
            borderRadius: "50% 50% 45% 45% / 60% 60% 40% 40%",
            background: isOn
              ? `radial-gradient(ellipse at 50% 40%, rgba(255,220,80,0.95) 0%, rgba(255,160,20,0.9) 50%, rgba(200,100,10,0.85) 100%)`
              : `radial-gradient(ellipse at 50% 40%, rgba(200,200,200,0.4) 0%, rgba(150,150,150,0.3) 60%, rgba(100,100,100,0.2) 100%)`,
            border: "none",
            boxShadow: isOn
              ? `inset -8px -8px 20px rgba(180,80,0,0.4), inset 4px 4px 15px rgba(255,255,200,0.6), 0 0 30px 15px rgba(255,180,40,0.4), 0 0 80px 40px rgba(255,140,0,0.15)`
              : `inset -8px -8px 20px rgba(0,0,0,0.2), inset 4px 4px 15px rgba(255,255,255,0.1)`,
            transition,
            zIndex: 5,
          }}
        >
          {/* Filament */}
          <svg
            width="30"
            height="45"
            viewBox="0 0 30 45"
            style={{
              position: "absolute",
              top: "28%",
              opacity: isOn ? 0.9 : 0.4,
              transition,
            }}
          >
            <path
              d="M 15 40 L 15 30 C 15 25, 8 22, 8 16 C 8 10, 22 10, 22 16 C 22 22, 15 25, 15 30"
              fill="none"
              stroke={isOn ? "rgba(255,230,100,0.95)" : "rgba(150,150,150,0.6)"}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <line
              x1="13"
              y1="40"
              x2="13"
              y2="33"
              stroke={isOn ? "rgba(255,220,80,0.8)" : "rgba(130,130,130,0.5)"}
              strokeWidth="1"
            />
            <line
              x1="17"
              y1="40"
              x2="17"
              y2="33"
              stroke={isOn ? "rgba(255,220,80,0.8)" : "rgba(130,130,130,0.5)"}
              strokeWidth="1"
            />
          </svg>

          {/* Glare highlight */}
          <div
            className="absolute"
            style={{
              width: "18px",
              height: "28px",
              top: "12%",
              left: "15%",
              background: isOn
                ? "radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)"
                : "radial-gradient(ellipse, rgba(255,255,255,0.2) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: "rotate(-20deg)",
              transition,
            }}
          />
        </div>
      </animated.div>
    </div>
  );
}
