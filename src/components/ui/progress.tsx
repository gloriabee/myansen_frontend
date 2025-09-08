import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";


type ProgressGameProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> & {
  value: number; // 0–100
  showPercent?: boolean;
  customMaker?: React.ReactNode;
  targetGoal: number;
};

const MARKER = 28; // px (bigger than bar height so it sticks out)
const HALF = MARKER / 2;
const EDGE_PAD = 4; // px

export const ProgressGame = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressGameProps
>(
  (
    {
      className,
      value,
      showPercent = false,
      customMaker,
      targetGoal,
      ...props
    },
    ref
  ) => {
    const pct = Math.max(0, Math.min(100, value ?? 0));
    const left = `clamp(${
       EDGE_PAD
    }px, calc(${pct}% ), calc(100% - ${HALF + EDGE_PAD}px))`;

    return (
      <div className={cn("relative w-full", className)}>
        {/* Track (keeps overflow-hidden to mask rounded corners) */}
        <ProgressPrimitive.Root
          ref={ref}
          className={cn(
            "relative h-4 w-full overflow-hidden rounded-full bg-primary/15 m-1"
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1 transition-transform duration-300 ease-out",
              "bg-[linear-gradient(45deg,rgba(20,184,166,.9),rgba(16,185,129,.9))]",
              "relative before:absolute before:inset-0 before:content-['']",
              "before:bg-[repeating-linear-gradient(60deg,rgba(255,255,255,.25)_0px,rgba(255,255,255,.25)_8px,transparent_8px,transparent_16px)]",
              "before:animate-[stripeMove_1.2s_linear_infinite]"
            )}
            style={{ transform: `translateX(-${100 - pct}%)` }}
          />
        </ProgressPrimitive.Root>

        {/* Marker (outside the track so it can stick out) */}
        <div
          className="pointer-events-none absolute select-none transition-[left] duration-300 ease-out"
          style={{
            left,
            width: MARKER,
            height: MARKER,
            top: 0, // align with track top
            transform: "translateY(-30%)", // lift above the border
            filter: "drop-shadow(0 2px 0 rgba(0,0,0,.15))",
          }}
          aria-hidden
        >
          {pct >= targetGoal && (
            <div className="absolute z-0 pointer-events-none select-none">
              <DotLottieReact
                src="https://lottie.host/0f68e0cc-0609-4c8a-b3ce-aad3aa6f5465/MnlNhvWjJX.lottie"
                style={{
                  left: "0%",
                  top: "0%",
                  transform: "translate(-50%,-50%)", // slightly above center
                  width: 80,
                  height: 80,
                }}
                loop
                autoplay
              />
            </div>
          )}
          <div className="grid h-full w-full place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/10">
            <div className="text-2xl leading-none">{customMaker ?? "🥸"}</div>
          </div>
        </div>

        {showPercent && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-xs font-medium text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,.6)]">
            {Math.round(pct)}%
          </div>
        )}
      </div>
    );
  }
);
ProgressGame.displayName = "ProgressGame";

/* keep keyframes:
@keyframes stripeMove { from{background-position:0 0} to{background-position:32px 0} }
@keyframes burst { 0%{transform:translate(-50%,-50%) scale(.5);opacity:.9} 100%{transform:translate(-50%,-50%) scale(1.8);opacity:0} }
*/
