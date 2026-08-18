import { Pause, Play } from "lucide-react";

export type TimerState = "idle" | "running" | "paused";

type TimerDisplayProps = {
  remainingSeconds: number;
  state: TimerState;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const stateLabels: Record<TimerState, string> = {
  idle: "READY",
  running: "RUNNING",
  paused: "PAUSED",
};

export function TimerDisplay({ remainingSeconds, state }: TimerDisplayProps) {
  const isRunning = state === "running";

  return (
    <section
      className="rounded-[1.75rem] border border-white/10 bg-[hsl(var(--timer-display))] p-3 shadow-[inset_0_2px_12px_rgba(0,0,0,0.65)] sm:p-4"
      aria-label="残り時間"
    >
      <div className="relative overflow-hidden rounded-[1.25rem] border border-amber-400/20 bg-[#080d16] px-3 py-7 shadow-[inset_0_0_30px_rgba(0,0,0,0.8),0_0_20px_rgba(245,158,11,0.06)] sm:px-6 sm:py-9">
        <div className="pointer-events-none absolute inset-0 opacity-30 timer-grid" />
        <div className="relative flex items-center justify-center">
          <span
            key={remainingSeconds}
            className="led-digits tabular-nums text-[clamp(3.75rem,18vw,7.5rem)] font-bold leading-none tracking-[-0.05em] text-[hsl(var(--timer-amber))]"
          >
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between px-2 text-[0.68rem] font-bold tracking-[0.2em] text-slate-400">
        <span>COUNTDOWN</span>
        <span className="flex items-center gap-2 text-slate-200" aria-live="polite">
          <span
            className={`h-2 w-2 rounded-full ${
              isRunning
                ? "animate-pulse bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]"
                : state === "paused"
                  ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.65)]"
                  : "bg-slate-500"
            }`}
          />
          {state === "paused" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          {stateLabels[state]}
        </span>
      </div>
    </section>
  );
}
