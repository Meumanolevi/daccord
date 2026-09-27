"use client";

import { useEffect, useState } from "react";

const TEXT_SCALE_STORAGE_KEY = "daccord-text-scale";
const LEGACY_LARGE_TEXT_STORAGE_KEY = "daccord-large-text";
const MIN_TEXT_SCALE = 100;
const MAX_TEXT_SCALE = 120;
const TEXT_SCALE_STEP = 2.5;

export function useAccessibilityPreferences() {
  const [textScale, setTextScale] = useState(MIN_TEXT_SCALE);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    const savedTextScale = window.localStorage.getItem(TEXT_SCALE_STORAGE_KEY);
    const legacyLargeText = window.localStorage.getItem(LEGACY_LARGE_TEXT_STORAGE_KEY) === "true";
    const initialTextScale = savedTextScale === null
      ? legacyLargeText ? 112.5 : MIN_TEXT_SCALE
      : normalizeTextScale(Number(savedTextScale));
    const savedHighContrast = window.localStorage.getItem("daccord-high-contrast") === "true";

    const frame = window.requestAnimationFrame(() => {
      setTextScale(initialTextScale);
      setHighContrast(savedHighContrast);
      document.documentElement.style.fontSize = `${initialTextScale}%`;
      document.documentElement.classList.toggle("daccord-high-contrast", savedHighContrast);
    });

    if (savedTextScale === null || Number(savedTextScale) !== initialTextScale || window.localStorage.getItem(LEGACY_LARGE_TEXT_STORAGE_KEY) !== null) {
      window.localStorage.setItem(TEXT_SCALE_STORAGE_KEY, String(initialTextScale));
      window.localStorage.removeItem(LEGACY_LARGE_TEXT_STORAGE_KEY);
    }

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const changeTextScale = (value: number) => {
    const nextValue = normalizeTextScale(value);
    setTextScale(nextValue);
    document.documentElement.style.fontSize = `${nextValue}%`;
    window.localStorage.setItem(TEXT_SCALE_STORAGE_KEY, String(nextValue));
  };

  const toggleHighContrast = () => {
    const nextValue = !highContrast;
    setHighContrast(nextValue);
    document.documentElement.classList.toggle("daccord-high-contrast", nextValue);
    window.localStorage.setItem("daccord-high-contrast", String(nextValue));
  };

  return { textScale, highContrast, changeTextScale, toggleHighContrast };
}

export function AccessibilityControls({
  textScale,
  highContrast,
  onTextScale,
  onHighContrast,
}: {
  textScale: number;
  highContrast: boolean;
  onTextScale: (value: number) => void;
  onHighContrast: () => void;
}) {
  return (
    <div className="accessibility-controls">
      <label className="accessibility-controls__text-scale">
        <span>Tamanho do texto</span>
        <output>{textScale}%</output>
        <input
          type="range"
          min={MIN_TEXT_SCALE}
          max={MAX_TEXT_SCALE}
          step={TEXT_SCALE_STEP}
          value={textScale}
          aria-label="Tamanho do texto"
          aria-valuetext={`${textScale}%`}
          onChange={(event) => onTextScale(Number(event.currentTarget.value))}
        />
      </label>
      <button type="button" aria-pressed={highContrast} onClick={onHighContrast}>
        <span className="contrast-symbol" aria-hidden="true" />
        Alto contraste
      </button>
    </div>
  );
}

function normalizeTextScale(value: number) {
  if (!Number.isFinite(value)) return MIN_TEXT_SCALE;
  const clampedValue = Math.min(MAX_TEXT_SCALE, Math.max(MIN_TEXT_SCALE, value));
  return MIN_TEXT_SCALE + Math.round((clampedValue - MIN_TEXT_SCALE) / TEXT_SCALE_STEP) * TEXT_SCALE_STEP;
}
