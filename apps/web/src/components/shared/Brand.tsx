export default function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`mga-brand${compact ? " mga-brand--compact" : ""}`}>
      <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="m4 13 16-9 16 9-16 9L4 13Z" fill="currentColor" />
        <path
          d="m4 21 16 9 16-9M4 29l16 9 16-9"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="mga-brand__name">
        mga<span className="mga-brand__dot">.</span>
      </span>
      {!compact && (
        <span className="mga-brand__descriptor">
          tech
          <br />
          consulting
        </span>
      )}
    </span>
  );
}
