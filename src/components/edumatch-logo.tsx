export function EduMatchLogo({ size = 48 }: { size?: number }) {
  const capSize = size * 0.58;
  const flagW = size * 0.28;
  const flagH = flagW * 0.6;

  return (
    <div
      className="relative mx-auto flex items-center justify-center rounded-xl bg-[#8A1538]"
      style={{ width: size, height: size }}
    >
      {/* Graduation cap icon (inline SVG so we can layer the flag on top) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={capSize}
        height={capSize}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
        <path d="M22 10v6" />
        <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
      </svg>

      {/* Qatar flag badge */}
      <svg
        className="absolute"
        style={{ top: size * 0.08, right: size * 0.06 }}
        width={flagW}
        height={flagH}
        viewBox="0 0 28 16"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="28" height="16" rx="2" fill="#8A1538" />
        {/* White zigzag section on the left */}
        <polygon
          points="0,0 10,0 14,1.6 10,3.2 14,4.8 10,6.4 14,8 10,9.6 14,11.2 10,12.8 14,14.4 10,16 0,16"
          fill="white"
        />
      </svg>
    </div>
  );
}
