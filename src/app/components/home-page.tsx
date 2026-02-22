import { BookOpen, Bot, Notebook, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <main className="sketch-app min-h-screen px-4 py-8 md:py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="sketch-card flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
          <div>
            <p className="sketch-heading text-3xl md:text-4xl">SummerCourse AI</p>
            <p className="mt-1 text-sm text-muted-foreground">Your AI browser for summer courses, programs, and internships.</p>
          </div>
          <Button className="sketch-btn sketch-btn-primary" onClick={onGetStarted}>
            Sign in to start
          </Button>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <article className="sketch-card p-6">
            <p className="sketch-title text-4xl leading-tight md:text-5xl">Plan smarter summer pathways.</p>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              Search high-school + college summer opportunities, filter by cost and eligibility, and ask AI to turn your goals into a 4-year roadmap.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="sketch-btn sketch-btn-primary" onClick={onGetStarted}>Explore programs</Button>
              <Button variant="outline" className="sketch-btn" onClick={onGetStarted}>Try AI planner</Button>
            </div>
          </article>

          <article className="sketch-card space-y-3 p-6">
            <p className="sketch-title text-2xl">What you can do</p>
            <div className="space-y-2 text-sm">
              <p className="inline-flex items-center gap-2"><Notebook className="h-4 w-4" /> Discover matched programs fast</p>
              <p className="inline-flex items-center gap-2"><BookOpen className="h-4 w-4" /> Save opportunities to your account</p>
              <p className="inline-flex items-center gap-2"><Bot className="h-4 w-4" /> Generate AI 4-year plans</p>
              <p className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> Keep everything in one notebook-style dashboard</p>
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["1", "Describe your goal", "Tell AI your major/career target and what type of summer experience you want."],
            ["2", "Find best-fit programs", "Use filters for grade level, subject, cost, location, and dates."],
            ["3", "Save + build your roadmap", "Store favorites and generate a personalized four-year summer plan."],
          ].map(([step, title, desc]) => (
            <article key={step} className="sketch-card p-4">
              <p className="sketch-title text-xl">Step {step}</p>
              <p className="mt-1 font-medium">{title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
