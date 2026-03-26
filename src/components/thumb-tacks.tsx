export function ThumbTack() {
  return (
    <div
      className="relative flex justify-center items-center pointer-events-none w-4 h-4"
      style={{ transform: "translate(-50%, -50%)" }}
    >
      <div
        className="relative"
        style={{
          width: "16px",
          height: "16px",
          background:
            "radial-gradient(circle at 30% 30%, #F1948A 0%, #C0392B 40%, #7B241C 100%)",
          borderRadius: "50%",
          boxShadow:
            "1px 3px 6px rgba(0,0,0,0.8), inset -2px -2px 4px rgba(0,0,0,0.6)",
        }}
      >
        <div className="absolute top-0.5 left-0.75 w-1.5 h-1.5 bg-white/50 rounded-full blur-[0.5px]" />
      </div>
    </div>
  );
}
