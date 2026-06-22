"use client";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function calculateTimeLeft(targetDate: string): TimeLeft | null {
  const diff = new Date(targetDate).getTime() - new Date().getTime();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function Countdown({ date }: { date: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(calculateTimeLeft(date));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(date));
    }, 1000);
    return () => clearInterval(timer);
  }, [date]);

  if (!timeLeft) return null;

  // Si plus de 30 jours, on n'affiche pas les secondes/minutes pour ne pas surcharger
  const isClose = timeLeft.days < 30;

  return (
    <div style={{
      padding: "20px 24px",
      background: "linear-gradient(135deg, rgba(232,24,109,0.1) 0%, rgba(255,179,0,0.05) 100%)",
      border: "1px solid #E8186D",
      borderRadius: "8px",
      marginBottom: "20px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
        <Clock size={16} style={{ color: "#FFB300" }} />
        <h4 style={{
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "#FFB300",
          letterSpacing: "0.1em",
        }}>
          PLUS QUE...
        </h4>
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <TimeBox value={timeLeft.days} label="JOURS" big />
        <TimeBox value={timeLeft.hours} label="HEURES" />
        {isClose && <TimeBox value={timeLeft.minutes} label="MINUTES" />}
        {isClose && timeLeft.days === 0 && <TimeBox value={timeLeft.seconds} label="SECONDES" pulse />}
      </div>

      {timeLeft.days === 0 && (
        <p style={{
          marginTop: "12px",
          fontFamily: "var(--font-pixel)",
          fontSize: "8px",
          color: "#E8186D",
          letterSpacing: "0.1em",
          textAlign: "center",
        }}>
          &gt;&gt; C'EST AUJOURD'HUI ! &lt;&lt;
        </p>
      )}
    </div>
  );
}

function TimeBox({ value, label, big = false, pulse = false }: { value: number; label: string; big?: boolean; pulse?: boolean }) {
  return (
    <div style={{
      flex: 1,
      minWidth: big ? "90px" : "70px",
      padding: big ? "12px 16px" : "10px 12px",
      background: "#0D0D0D",
      border: "1px solid #252525",
      borderRadius: "6px",
      textAlign: "center",
      animation: pulse ? "pulse 1s ease-in-out infinite" : undefined,
    }}>
      <div style={{
        fontFamily: "var(--font-bebas)",
        fontSize: big ? "42px" : "32px",
        color: "white",
        lineHeight: 1,
      }}>
        {String(value).padStart(2, "0")}
      </div>
      <div style={{
        fontFamily: "var(--font-pixel)",
        fontSize: "6px",
        color: "rgba(255,255,255,0.5)",
        letterSpacing: "0.1em",
        marginTop: "6px",
      }}>
        {label}
      </div>
    </div>
  );
}
