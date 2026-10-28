/**
 * A refugee child seen from behind, hands clasped at the back: an homage to the pose of
 * Naji al-Ali's Handala, drawn freshly for this piece rather than copied. The back of the
 * head is solid, so it reads as turned away.
 */
export function ChildFromBehind({
  className = "",
  stroke = "currentColor",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 300"
      className={className}
      aria-hidden
      fill="none"
      stroke={stroke}
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* the back of the head, its hair standing up like the thorns of the handal plant he is named after */}
      <path
        fill={stroke}
        d="M71 84 L64 66 L74 68 L66 48 L80 56 L76 34 L90 48 L92 26 L101 44 L108 24 L112 44 L124 28 L122 50 L136 40 L130 60 L140 58 L131 74 L136 84
           C 136 104, 120 114, 100 114 C 80 114, 66 104, 71 84 Z"
      />
      {/* ears */}
      <path fill={stroke} d="M68 84 C 60 82, 60 96, 70 97 Z M132 84 C 140 82, 140 96, 130 97 Z" />
      {/* neck and tunic */}
      <path d="M93 113 L93 121 M107 113 L107 121" />
      <path d="M93 121 C 84 122, 76 125, 74 133 L68 204 L132 204 L126 133 C 124 125, 116 122, 107 121" />
      {/* a patch, stitched on */}
      <path d="M106 150 h16 v14 h-16 z" />
      <path d="M109 150 v-3 M114 150 v-3 M119 150 v-3 M109 164 v3 M114 164 v3 M119 164 v3" strokeWidth={1.4} />
      {/* arms folded behind the back, hands held */}
      <path d="M78 129 C 72 151, 80 171, 95 177" />
      <path d="M122 129 C 128 151, 120 171, 105 177" />
      <circle cx="96.5" cy="178" r="5.5" fill={stroke} />
      <circle cx="103.5" cy="178" r="5.5" fill={stroke} />
      {/* legs and bare feet */}
      <path d="M88 204 L87 258 M112 204 L113 258" />
      <path fill={stroke} d="M78 262 C 78 257, 92 257, 93 262 C 92 266, 79 266, 78 262 Z M107 262 C 108 257, 122 257, 122 262 C 121 266, 108 266, 107 262 Z" />
    </svg>
  );
}
