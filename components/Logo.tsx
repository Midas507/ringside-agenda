import Image from "next/image";

export function LogoMark({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Image
        src="/logo.png"
        alt="Ringside Agenda"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
      <div className="leading-none">
        <div
          style={{
            fontFamily: "var(--font-bebas)",
            letterSpacing: "0.06em",
            fontSize: size >= 40 ? "22px" : "16px",
          }}
          className="text-white"
        >
          RINGSIDE
        </div>
        <div
          style={{
            fontFamily: "var(--font-bebas)",
            letterSpacing: "0.06em",
            fontSize: size >= 40 ? "22px" : "16px",
          }}
          className="text-white"
        >
          AGENDA
        </div>
      </div>
    </div>
  );
}