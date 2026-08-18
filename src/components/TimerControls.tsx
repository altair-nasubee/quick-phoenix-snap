import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TimerState } from "@/components/TimerDisplay";

type TimerControlsProps = {
  state: TimerState;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
};

const primaryButtonClass =
  "h-14 flex-1 rounded-2xl border border-amber-300/30 bg-[hsl(var(--timer-amber))] px-6 text-base font-extrabold tracking-[0.08em] text-[#1b1408] shadow-[0_5px_0_#9a5c08,0_10px_24px_rgba(245,158,11,0.2)] transition-all duration-150 hover:bg-[hsl(var(--timer-amber-bright))] hover:translate-y-[-1px] active:translate-y-1 active:shadow-[0_2px_0_#9a5c08]";

const secondaryButtonClass =
  "h-14 flex-1 rounded-2xl border border-slate-500/40 bg-slate-700/70 px-5 text-base font-bold tracking-[0.06em] text-slate-100 shadow-[0_5px_0_#111827] transition-all duration-150 hover:bg-slate-600 active:translate-y-1 active:shadow-[0_2px_0_#111827]";

export function TimerControls({
  state,
  onStart,
  onPause,
  onResume,
  onReset,
}: TimerControlsProps) {
  if (state === "idle") {
    return (
      <Button type="button" className={primaryButtonClass} onClick={onStart}>
        <Play className="mr-2 h-5 w-5 fill-current" />
        START
      </Button>
    );
  }

  return (
    <div className="flex w-full gap-3">
      <Button
        type="button"
        className={primaryButtonClass}
        onClick={state === "running" ? onPause : onResume}
      >
        {state === "running" ? (
          <>
            <Pause className="mr-2 h-5 w-5 fill-current" />
            PAUSE
          </>
        ) : (
          <>
            <Play className="mr-2 h-5 w-5 fill-current" />
            RESUME
          </>
        )}
      </Button>
      <Button type="button" className={secondaryButtonClass} onClick={onReset}>
        <RotateCcw className="mr-2 h-5 w-5" />
        RESET
      </Button>
    </div>
  );
}
