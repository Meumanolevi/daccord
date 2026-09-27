"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getCarouselStops, getClosestStop } from "@/lib/carousel";

const steps = [
  {
    number: "01",
    src: "/images/texture.png",
    alt: "Textura cremosa e cápsula de skincare em tons rosados",
    title: "Texturas que sua pele tolera",
    note: "Hidratação sem peso.",
  },
  {
    number: "02",
    src: "/images/application.png",
    alt: "Pessoa aplicando suavemente um produto de skincare no rosto",
    title: "Como você usa",
    note: "Sensação, frequência e preferências.",
  },
  {
    number: "03",
    src: "/images/ritual.png",
    alt: "Ritual de skincare com sérum e potes sobre composição editorial rosa",
    title: "Produtos que conversam entre si",
    note: "Um ritual menor, mais coerente.",
  },
] as const;

export function StepCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stopsRef = useRef([0]);
  const activeRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const [stops, setStops] = useState([0]);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const trackId = useId();
  const instructionsId = useId();

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let frame = 0;
    let settleTimer: number | undefined;

    const syncPosition = () => {
      const index = getClosestStop(stopsRef.current, track.scrollLeft);
      activeRef.current = index;
      setActive(index);
    };

    const measure = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const origin = cards[0]?.offsetLeft ?? 0;
      const nextStops = getCarouselStops(cards.map((card) => card.offsetLeft - origin), track.scrollWidth - track.clientWidth);
      const nextActive = Math.min(activeRef.current, nextStops.length - 1);
      stopsRef.current = nextStops;
      activeRef.current = nextActive;
      targetRef.current = null;
      setStops(nextStops);
      setActive(nextActive);
      track.scrollTo({ left: nextStops[nextActive], behavior: "instant" });
    };

    const scheduleMeasure = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(measure);
    };

    const onScroll = () => {
      if (targetRef.current === null) syncPosition();
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => {
        targetRef.current = null;
        syncPosition();
      }, 150);
    };

    const onManualScroll = () => { targetRef.current = null; };
    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(track);
    for (const card of track.children) observer.observe(card);
    track.addEventListener("scroll", onScroll, { passive: true });
    track.addEventListener("pointerdown", onManualScroll, { passive: true });
    track.addEventListener("wheel", onManualScroll, { passive: true });
    scheduleMeasure();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(settleTimer);
      track.removeEventListener("scroll", onScroll);
      track.removeEventListener("pointerdown", onManualScroll);
      track.removeEventListener("wheel", onManualScroll);
    };
  }, []);

  const selectPosition = (index: number) => {
    const next = Math.max(0, Math.min(index, stopsRef.current.length - 1));
    activeRef.current = next;
    targetRef.current = next;
    setActive(next);
    trackRef.current?.scrollTo({ left: stopsRef.current[next], behavior: reduceMotion ? "instant" : "smooth" });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const destinations: Record<string, number> = {
      ArrowLeft: activeRef.current - 1,
      ArrowRight: activeRef.current + 1,
      Home: 0,
      End: stopsRef.current.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    selectPosition(destinations[event.key]);
  };

  return (
    <div className="step-carousel" role="region" aria-roledescription="carrossel" aria-label="Etapas da curadoria D’Accord">
      <p id={instructionsId} className="sr-only">Deslize para conhecer os três passos. Use também as setas do teclado ou os controles de navegação.</p>
      <div
        ref={trackRef}
        id={trackId}
        className="step-carousel__track"
        data-lenis-prevent
        tabIndex={0}
        role="group"
        aria-label="Cards dos passos"
        aria-describedby={instructionsId}
        onKeyDown={handleKeyDown}
      >
        {steps.map((step, index) => (
          <article key={step.number} className="step-card" role="group" aria-roledescription="slide" aria-label={`Passo ${index + 1} de ${steps.length}: ${step.title}`}>
            <div className="step-card__media">
              <Image src={step.src} alt={step.alt} fill quality={90} loading="lazy" sizes="(min-width: 1440px) 560px, (min-width: 1024px) 46vw, (min-width: 700px) 60vw, 84vw" className="object-cover" draggable={false} />
            </div>
            <div className="step-card__content">
              <p className="step-card__number">PASSO {step.number}</p>
              <h3 className="step-card__title font-display">{step.title}</h3>
              <p className="step-card__note">{step.note}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="step-carousel__navigation">
        <span className="step-carousel__hint">Explore cada passo</span>
        <div className="step-carousel__positions" aria-label="Posições do carrossel">
          {stops.map((_, index) => (
            <button key={index} type="button" className="step-carousel__dot" aria-label={`Ir para a posição ${index + 1}`} aria-current={active === index ? "true" : undefined} aria-controls={trackId} onClick={() => selectPosition(index)}>
              <span aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="step-carousel__arrows">
          <button type="button" className="step-carousel__arrow" aria-label="Ver passos anteriores" aria-controls={trackId} disabled={active === 0} onClick={() => selectPosition(activeRef.current - 1)}>
            <Chevron direction="left" />
          </button>
          <button type="button" className="step-carousel__arrow" aria-label="Ver próximos passos" aria-controls={trackId} disabled={active === stops.length - 1} onClick={() => selectPosition(activeRef.current + 1)}>
            <Chevron direction="right" />
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">Posição {active + 1} de {stops.length}. Três passos da curadoria.</p>
      </div>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={direction === "left" ? "M14 5l-7 7 7 7" : "M10 5l7 7-7 7"} /></svg>;
}
