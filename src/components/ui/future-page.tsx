import Link from "next/link";
import { AnimatedButton } from "@/components/ui/animated-button";

type FuturePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  nextStep?: string;
  cta?: { label: string; href: string; external?: boolean };
};

export function FuturePage({ eyebrow, title, description, nextStep, cta }: FuturePageProps) {
  return (
    <main className="min-h-screen bg-canvas px-6 py-6 text-plum sm:px-10 md:px-12">
      <header className="mx-auto flex max-w-[1440px] items-center justify-between border-b-[6px] border-brand bg-white px-5 py-6 sm:px-8">
        <Link href="/" className="text-3xl font-bold tracking-[-0.055em] sm:text-5xl" aria-label="Voltar para a página inicial">
          D’ACCORD
        </Link>
        <p className="hidden font-elegant text-sm sm:block">skincare inteligente para a sua pele.</p>
      </header>

      <section className="mx-auto grid max-w-[1440px] bg-white lg:min-h-[720px] lg:grid-cols-[0.8fr_1.2fr]">
        <div className="bg-brand px-7 py-14 text-white sm:px-12 sm:py-20">
          <p className="text-xs font-bold tracking-[0.08em]">{eyebrow}</p>
          <h1 className="mt-10 font-display text-[clamp(4rem,9vw,7rem)] leading-[0.88] text-balance">{title}</h1>
        </div>
        <div className="flex flex-col justify-between px-7 py-14 sm:px-12 sm:py-20 lg:px-16">
          <div>
            <p className="max-w-2xl text-[clamp(1.6rem,4vw,3.5rem)] leading-[1.06] font-medium tracking-[0.025em] text-balance">{description}</p>
            {nextStep ? <p className="mt-10 max-w-xl text-base leading-7 text-ink-muted">{nextStep}</p> : null}
          </div>
          <div className="mt-14 flex flex-wrap gap-4">
            {cta ? (
              <AnimatedButton href={cta.href} external={cta.external} className="min-w-[220px]">
                {cta.label}
              </AnimatedButton>
            ) : null}
            <AnimatedButton href="/" variant="secondary">Voltar à landing</AnimatedButton>
          </div>
        </div>
      </section>
    </main>
  );
}
