const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

type Fill = "full" | "half" | "empty";

function Star({ fill, size }: { fill: Fill; size: number }) {
  const filledWidth = fill === "full" ? "100%" : fill === "half" ? "50%" : "0%";

  return (
    <span style={{ position: "relative", display: "inline-block", lineHeight: 0 }}>
      <svg width={size} height={size} viewBox="0 0 24 24" fill="rgba(255,255,255,0.2)">
        <path d={STAR_PATH} />
      </svg>
      <span
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: filledWidth,
          overflow: "hidden",
          display: "inline-block",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#FBBF24">
          <path d={STAR_PATH} />
        </svg>
      </span>
    </span>
  );
}

type Props = {
  rating: number;
  size?: number;
};

export default function StarRating({ rating, size = 16 }: Props) {
  const value = Number(rating);

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => {
        const pos = i + 1;
        const fill: Fill =
          value >= pos ? "full" : value >= pos - 0.5 ? "half" : "empty";
        return <Star key={i} fill={fill} size={size} />;
      })}
      <span
        style={{
          marginLeft: 6,
          fontSize: size - 2,
          color: "rgba(255,255,255,0.5)",
        }}
      >
        {value.toFixed(1)}
      </span>
    </span>
  );
}
