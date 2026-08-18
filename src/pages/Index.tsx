import { useEffect, useMemo, useRef, useState } from "react";
import { Bell, BellOff, Clock3, Info, Tag } from "lucide-react";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay, type TimerState } from "@/components/TimerDisplay";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type NotificationState = "unsupported" | NotificationPermission;

const DEFAULT_SECONDS = 3 * 60;

const clamp = (value: number, max: number) =>
  Math.min(max, Math.max(0, Number.isFinite(value) ? value : 0));

const getNotificationState = (): NotificationState => {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
};

const notificationLabels: Record<NotificationState, string> = {
  unsupported: "通知非対応",
  default: "通知の許可が必要",
  granted: "通知許可済み",
  denied: "通知が拒否されています",
};

const Index = () => {
  const [timerName, setTimerName] = useState("");
  const [minutes, setMinutes] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [configuredSeconds, setConfiguredSeconds] = useState(DEFAULT_SECONDS);
  const [remainingSeconds, setRemainingSeconds] = useState(DEFAULT_SECONDS);
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [notificationState, setNotificationState] = useState<NotificationState>(getNotificationState);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "success" | null>(null);
  const endTimeRef = useRef<number | null>(null);

  const inputsLocked = timerState !== "idle";
  const notificationReady = notificationState === "granted";

  const statusTone = useMemo(() => {
    if (notificationState === "granted") return "text-emerald-300 border-emerald-400/25 bg-emerald-400/10";
    if (notificationState === "denied" || notificationState === "unsupported") {
      return "text-rose-300 border-rose-400/25 bg-rose-400/10";
    }
    return "text-amber-200 border-amber-400/25 bg-amber-400/10";
  }, [notificationState]);

  useEffect(() => {
    if (timerState !== "running" || endTimeRef.current === null) return;

    const updateRemaining = () => {
      if (endTimeRef.current === null) return;
      const nextRemaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));

      if (nextRemaining > 0) {
        setRemainingSeconds(nextRemaining);
        return;
      }

      endTimeRef.current = null;
      setTimerState("idle");
      setRemainingSeconds(configuredSeconds);
      setMessage("Time up!");
      setMessageKind("success");

      new Notification(timerName.trim() || "タイマー終了", {
        body: "設定した時間になりました",
      });
    };

    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 250);
    return () => window.clearInterval(intervalId);
  }, [configuredSeconds, timerName, timerState]);

  const updateTimeInput = (field: "minutes" | "seconds", rawValue: string) => {
    const parsedValue = Number.parseInt(rawValue, 10);
    const nextMinutes = field === "minutes" ? clamp(parsedValue, 99) : minutes;
    const nextSeconds = field === "seconds" ? clamp(parsedValue, 59) : seconds;
    const total = nextMinutes * 60 + nextSeconds;

    setMinutes(nextMinutes);
    setSeconds(nextSeconds);
    setConfiguredSeconds(total);
    setRemainingSeconds(total);
    if (messageKind === "error") {
      setMessage("");
      setMessageKind(null);
    }
  };

  const beginCountdown = () => {
    const total = minutes * 60 + seconds;
    setConfiguredSeconds(total);
    setRemainingSeconds(total);
    endTimeRef.current = Date.now() + total * 1000;
    setMessage("");
    setMessageKind(null);
    setTimerState("running");
  };

  const handleStart = async () => {
    const total = minutes * 60 + seconds;
    setMessage("");
    setMessageKind(null);

    if (total === 0) {
      setMessage("1秒以上を設定してください");
      setMessageKind("error");
      return;
    }

    if (!("Notification" in window)) {
      setNotificationState("unsupported");
      setMessage("このブラウザでは通知を利用できません");
      setMessageKind("error");
      return;
    }

    if (Notification.permission === "denied") {
      setNotificationState("denied");
      setMessage("通知が拒否されています。ブラウザの設定から通知を許可してください");
      setMessageKind("error");
      return;
    }

    if (Notification.permission === "granted") {
      setNotificationState("granted");
      beginCountdown();
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationState(permission);
      if (permission === "granted") {
        beginCountdown();
      } else {
        setMessage("通知が許可されなかったため、タイマーを開始できません");
        setMessageKind("error");
      }
    } catch {
      setMessage("通知の許可を確認できませんでした。ブラウザの設定をご確認ください");
      setMessageKind("error");
    }
  };

  const handlePause = () => {
    if (endTimeRef.current === null) return;
    const pausedRemaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
    endTimeRef.current = null;
    setRemainingSeconds(pausedRemaining);
    setTimerState("paused");
  };

  const handleResume = () => {
    endTimeRef.current = Date.now() + remainingSeconds * 1000;
    setTimerState("running");
  };

  const handleReset = () => {
    endTimeRef.current = null;
    setTimerState("idle");
    setRemainingSeconds(configuredSeconds);
    setMessage("");
    setMessageKind(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[hsl(var(--timer-page))] px-4 py-6 text-slate-100 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0 timer-page-pattern" />
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="w-full">
          <header className="mb-5 flex flex-col gap-3 px-1 sm:mb-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.24em] text-amber-300">
                <Clock3 className="h-4 w-4" />
                DESKTOP TIMER
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                RETRO LED TIMER
              </h1>
            </div>
            <div className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-xs font-bold ${statusTone}`}>
              {notificationReady ? <Bell className="h-3.5 w-3.5" /> : <BellOff className="h-3.5 w-3.5" />}
              {notificationLabels[notificationState]}
            </div>
          </header>

          <section className="rounded-[2.25rem] border border-slate-600/35 bg-[hsl(var(--timer-case))] p-4 shadow-[0_24px_70px_rgba(1,5,18,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-7">
            <div className="mb-5 flex items-center justify-between px-1 text-[0.65rem] font-extrabold tracking-[0.26em] text-slate-500">
              <span>SINGLE CHANNEL</span>
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2 w-2 rounded-full bg-rose-400/70" />
                <span className="h-2 w-2 rounded-full bg-amber-400/70" />
                <span className="h-2 w-2 rounded-full bg-emerald-400/70" />
              </div>
            </div>

            <div className="mb-5 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="timer-name" className="flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-slate-300">
                  <Tag className="h-3.5 w-3.5 text-amber-300" />
                  TIMER NAME
                </Label>
                <Input
                  id="timer-name"
                  value={timerName}
                  onChange={(event) => setTimerName(event.target.value)}
                  disabled={inputsLocked}
                  maxLength={50}
                  placeholder="例：休憩"
                  className="h-12 rounded-xl border-slate-600/50 bg-slate-950/35 px-4 text-base text-white placeholder:text-slate-600 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/25 disabled:cursor-not-allowed disabled:opacity-55"
                />
              </div>

              <fieldset className="space-y-2" disabled={inputsLocked}>
                <legend className="mb-2 text-xs font-bold tracking-[0.16em] text-slate-300">SET TIME</legend>
                <div className="flex items-center gap-2">
                  <label className="relative">
                    <span className="sr-only">分</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={99}
                      value={String(minutes).padStart(2, "0")}
                      onChange={(event) => updateTimeInput("minutes", event.target.value)}
                      className="h-16 w-[5.5rem] rounded-xl border-slate-600/50 bg-slate-950/50 px-2 text-center font-mono text-3xl font-bold text-amber-300 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/25 disabled:cursor-not-allowed disabled:opacity-55"
                    />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.58rem] font-bold tracking-widest text-slate-500">MIN</span>
                  </label>
                  <span className="pb-1 font-mono text-3xl font-black text-amber-400">:</span>
                  <label className="relative">
                    <span className="sr-only">秒</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={59}
                      value={String(seconds).padStart(2, "0")}
                      onChange={(event) => updateTimeInput("seconds", event.target.value)}
                      className="h-16 w-[5.5rem] rounded-xl border-slate-600/50 bg-slate-950/50 px-2 text-center font-mono text-3xl font-bold text-amber-300 focus-visible:border-amber-400/70 focus-visible:ring-amber-400/25 disabled:cursor-not-allowed disabled:opacity-55"
                    />
                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[0.58rem] font-bold tracking-widest text-slate-500">SEC</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <TimerDisplay remainingSeconds={remainingSeconds} state={timerState} />

            <div className="mt-5 min-h-11" aria-live="polite">
              {message ? (
                <div className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-center text-sm font-bold ${
                  messageKind === "success"
                    ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                    : "border-rose-400/25 bg-rose-400/10 text-rose-200"
                }`}>
                  <Info className="h-4 w-4 shrink-0" />
                  {message}
                </div>
              ) : (
                <p className="px-2 py-3 text-center text-xs leading-relaxed text-slate-500">
                  Startを押すと通知権限を確認します
                </p>
              )}
            </div>

            <div className="mt-3 flex">
              <TimerControls
                state={timerState}
                onStart={handleStart}
                onPause={handlePause}
                onResume={handleResume}
                onReset={handleReset}
              />
            </div>
          </section>

          <p className="mt-5 px-4 text-center text-[0.7rem] leading-relaxed text-slate-500">
            OSの通知設定や集中モードにより、通知が表示されない場合があります。
          </p>
        </div>
      </div>
    </main>
  );
};

export default Index;
