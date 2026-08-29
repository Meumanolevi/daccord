"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

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

export function MobileStepDeck() {
  const deckRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const reduceMotion = useReducedMotion();
  const inView = useInView(deckRef, { amount: 0.55 });

  const selectStep = useCallback((index: number) => {
    setActiveStep((index + steps.length) % steps.length);
    setAutoPlay(false);
  }, []);

  useEffect(() => {
    if (reduceMotion || !autoPlay || !inView) return;

    const timer = window.setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 5600);

    return () => window.clearInterval(timer);
  }, [autoPlay, inView, reduceMotion]);

  return (
    <div ref={deckRef} className="mobile-step-deck" aria-label="Etapas da curadoria D’Accord">
      <div className="mobile-step-deck__stage">
        {steps.map((step, index) => {
          let offset = index - activeStep;
          if (offset > 1) offset -= steps.length;
          if (offset < -1) offset += steps.length;
          const active = offset === 0;

          return (
            <motion.button
              key={step.number}
              type="button"
              className="mobile-step-card"
              aria-label={`Passo ${step.number}: ${step.title}`}
              aria-current={active ? "step" : undefined}
              animate={reduceMotion ? undefined : {
                x: `${offset * 10}%`,
                y: Math.abs(offset) * 14,
                rotate: offset * 4.5,
                scale: active ? 1 : 0.91,
                opacity: active ? 1 : 0.48,
              }}
              style={{ zIndex: active ? 10 : 5 - Math.abs(offset) }}
              transition={{ type: "spring", stiffness: 240, damping: 28, mass: 0.85 }}
              drag={active ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onClick={() => selectStep(index)}
              onDragEnd={(_, info) => {
                if (info.offset.x < -48) selectStep(activeStep + 1);
                if (info.offset.x > 48) selectStep(activeStep - 1);
              }}
            >
              <span className="mobile-step-card__media">
                <Image
                  src={step.src}
                  alt={step.alt}
                  fill
                  quality={90}
                  loading="lazy"
                  sizes="(max-width: 767px) 78vw, 1px"
                  className="object-cover"
                  draggable={false}
                />
              </span>
              <span className="mobile-step-card__content">
                <span className="mobile-step-card__number">PASSO {step.number}</span>
                <strong className="mobile-step-card__title font-display">{step.title}</strong>
                <span className="mobile-step-card__note">{step.note}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mobile-step-deck__navigation">
        <button type="button" onClick={() => selectStep(activeStep - 1)} aria-label="Ver passo anterior">
          ANTERIOR
        </button>
        <div className="mobile-step-deck__dots" aria-label={`Passo ${activeStep + 1} de ${steps.length}`}>
          {steps.map((step, index) => (
            <button
              key={step.number}
              type="button"
              className={index === activeStep ? "is-active" : ""}
              onClick={() => selectStep(index)}
              aria-label={`Ir para o passo ${step.number}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => selectStep(activeStep + 1)} aria-label="Ver próximo passo">
          PRÓXIMO
        </button>
      </div>

      <Link className="mobile-step-deck__cta" href="/analise">
        Ver minha curadoria
      </Link>
    </div>
  );
}
