/** Globo de meridianos en líneas finas, desvanecido hacia la derecha. */
export function GloboPunteado({ className = "absolute -left-24 -top-6 w-[26rem] h-[26rem]" }) {
  const meridianos = Array.from({ length: 22 }, (_, i) => i);
  return (
    <svg
      viewBox="0 0 400 400"
      aria-hidden="true"
      className={className}
      style={{ WebkitMaskImage: 'linear-gradient(to right, #000 30%, transparent 85%)', maskImage: 'linear-gradient(to right, #000 30%, transparent 85%)' }}
    >
      {meridianos.map((i) => {
        const rx = 200 * Math.abs(Math.cos((i / meridianos.length) * Math.PI));
        return (
          <ellipse
            key={i}
            cx="200"
            cy="200"
            rx={Math.max(rx, 1)}
            ry="190"
            fill="none"
            stroke="#B9BCC1"
            strokeWidth="1"
            strokeDasharray="2 5"
          />
        );
      })}
    </svg>
  );
}
