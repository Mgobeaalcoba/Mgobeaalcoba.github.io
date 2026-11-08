export default function SystemArtwork() {
  return (
    <div className="mga-art" aria-hidden="true">
      <svg viewBox="0 0 520 540" fill="none">
        <ellipse
          cx="260"
          cy="295"
          rx="237"
          ry="148"
          transform="rotate(-30 260 295)"
          className="mga-art__orbit"
        />
        <path d="M64 443 453 218M67 161l386 223" className="mga-art__guide" />
        <g className="mga-art__layer mga-art__layer--bottom">
          <path
            d="m87 332 173 99 173-99v21L260 453 87 353v-21Z"
            fill="color-mix(in srgb, var(--signal-lime) 65%, var(--signal-bg))"
          />
          <path d="m87 332 173-100 173 100-173 99-173-99Z" fill="var(--signal-lime)" />
          <path
            d="m123 332 137-79 137 79-137 78-137-78Z"
            stroke="#05070c"
            strokeOpacity=".2"
          />
          <path d="m237 332 23-13 23 13-23 13-23-13Z" fill="#05070c" />
        </g>
        <path d="M260 174v158" stroke="var(--signal-cyan)" strokeDasharray="3 7" />
        <g className="mga-art__layer mga-art__layer--middle">
          <path
            d="m87 245 173 99 173-99v21L260 366 87 266v-21Z"
            fill="color-mix(in srgb, var(--signal-cyan) 65%, var(--signal-bg))"
          />
          <path d="m87 245 173-100 173 100-173 99L87 245Z" fill="var(--signal-cyan)" />
          <path
            d="m123 245 137-79 137 79-137 78-137-78Z"
            stroke="#05070c"
            strokeOpacity=".2"
          />
          <ellipse
            cx="260"
            cy="245"
            rx="44"
            ry="25"
            stroke="#05070c"
            strokeWidth="2"
          />
          <path d="m239 245 21 12 21-12-21-12-21 12Z" fill="#05070c" />
        </g>
        <g className="mga-art__layer mga-art__layer--top">
          <path
            d="m87 158 173 99 173-99v21L260 279 87 179v-21Z"
            fill="color-mix(in srgb, var(--signal-blue) 60%, var(--signal-bg))"
          />
          <path d="m87 158 173-100 173 100-173 99L87 158Z" fill="var(--signal-blue)" />
          <path
            d="m123 158 137-79 137 79-137 78-137-78Z"
            stroke="white"
            strokeOpacity=".24"
          />
          <path
            d="m226 158 34-20 34 20-34 20-34-20Z"
            stroke="white"
            strokeWidth="2"
          />
          <path d="m243 148 34 20m-34 0 34-20" stroke="white" strokeWidth="2" />
        </g>
        <circle cx="451" cy="217" r="5" fill="var(--signal-lime)" />
        <circle cx="65" cy="443" r="3" className="mga-art__dot" />
        <path
          d="M433 159h38M433 246h38M433 333h38"
          className="mga-art__guide"
        />
        <text x="477" y="163" className="mga-art__label">
          01
        </text>
        <text x="477" y="250" className="mga-art__label">
          02
        </text>
        <text x="477" y="337" className="mga-art__label">
          03
        </text>
      </svg>
      <div className="mga-art__caption">
        <span>IA + AUTOMATION + SOFTWARE</span>
        <span>↗</span>
      </div>
    </div>
  );
}
