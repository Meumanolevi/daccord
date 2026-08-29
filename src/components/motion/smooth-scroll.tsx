"use client";

import Lenis from "lenis";
import { useEffect, type ReactNode } from "react";

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      duration: 1.28,
      smoothWheel: false,
      touchMultiplier: 1.08,
      overscroll: false,
    });

    let snapLocked = false;
    let wheelAccumulator = 0;
    let accumulatorTimer: number | undefined;
    let unlockTimer: number | undefined;

    const getSnapSections = () =>
      Array.from(document.querySelectorAll<HTMLElement>("[data-snap-section]"))
        .map((section) => ({
          section,
          position: section.classList.contains("hero-panel") ? 0 : section.offsetTop,
        }))
        .sort((a, b) => a.position - b.position);

    const triggerScrollStage = (section: HTMLElement, active: boolean) => {
      section.dataset.stageActive = String(active);
      window.dispatchEvent(new CustomEvent("daccord:scroll-stage", {
        detail: { active, id: section.dataset.scrollStage },
      }));

      snapLocked = true;
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => {
        snapLocked = false;
      }, 920);
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !window.matchMedia("(pointer: fine)").matches) return;
      if (event.target instanceof Element && event.target.closest("[data-lenis-prevent]")) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (snapLocked) return;

      wheelAccumulator += event.deltaY;
      window.clearTimeout(accumulatorTimer);
      accumulatorTimer = window.setTimeout(() => {
        wheelAccumulator = 0;
      }, 140);

      if (Math.abs(wheelAccumulator) < 18) return;

      const direction = Math.sign(wheelAccumulator);
      const snapSections = getSnapSections();
      const positions = snapSections.map(({ position }) => position);
      const currentY = window.scrollY;
      const tolerance = 8;
      const currentSnap = snapSections.length > 0
        ? snapSections.reduce((closest, candidate) =>
          Math.abs(candidate.position - currentY) < Math.abs(closest.position - currentY)
            ? candidate
            : closest)
        : undefined;

      if (
        currentSnap &&
        Math.abs(currentSnap.position - currentY) <= tolerance &&
        currentSnap.section.dataset.scrollStage
      ) {
        const stageActive = currentSnap.section.dataset.stageActive === "true";

        if (direction > 0 && !stageActive) {
          wheelAccumulator = 0;
          triggerScrollStage(currentSnap.section, true);
          return;
        }

        if (direction < 0 && stageActive) {
          wheelAccumulator = 0;
          triggerScrollStage(currentSnap.section, false);
          return;
        }
      }

      const targetIndex =
        direction > 0
          ? positions.findIndex((position) => position > currentY + tolerance)
          : positions.findLastIndex((position) => position < currentY - tolerance);

      wheelAccumulator = 0;
      if (targetIndex < 0) return;

      snapLocked = true;
      lenis.scrollTo(positions[targetIndex], {
        duration: 1.38,
        easing: (time) =>
          time < 0.5
            ? 4 * time * time * time
            : 1 - Math.pow(-2 * time + 2, 3) / 2,
        force: true,
        lock: true,
        onComplete: () => {
          unlockTimer = window.setTimeout(() => {
            snapLocked = false;
          }, 220);
        },
      });
    };

    window.addEventListener("wheel", handleWheel, { capture: true, passive: false });

    return () => {
      window.clearTimeout(accumulatorTimer);
      window.clearTimeout(unlockTimer);
      window.removeEventListener("wheel", handleWheel, true);
      lenis.destroy();
    };
  }, []);

  return children;
}
