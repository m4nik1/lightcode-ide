export default function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      style={{
        transform: open ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 120ms ease",
        flexShrink: 0,
      }}
    >
      <path
        d="M6 4L10 8L6 12"
        stroke="#cccccc"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}