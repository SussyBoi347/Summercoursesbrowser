import { ArrowRight, Bot, CalendarCheck2, Compass, GraduationCap, Notebook, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HomePageProps {
  onGetStarted: () => void;
}

const highlights = [
  {
    title: "AI-guided recommendations",
    description: "Get personalized suggestions based on your goals, interests, and grade level.",
    icon: Bot,
  },
  {
    title: "Smart filtering",
    description: "Narrow results instantly by subject, dates, location, price, and prerequisites.",
    icon: Compass,
  },
  {
    title: "Roadmap planning",
    description: "Build a 4-year summer strategy so each year moves you toward your target major.",
    icon: CalendarCheck2,
  },
];

const steps = [
  {
    title: "Tell us your goal",
    description: "Share your dream major, career direction, and available summer dates.",
  },
  {
    title: "Compare opportunities",
    description: "Browse and shortlist high-fit courses, internships, and enrichment programs.",
  },
  {
    title: "Save and execute",
    description: "Track favorites and follow your personalized summer plan each year.",
  },
];

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <main className="sketch-app min-h-screen px-4 py-8 md:px-6 md:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="sketch-card flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
          <div>
            <p className="sketch-heading text-3xl md:text-4xl">SummerCourse AI</p>
            <p className="mt-1 text-sm text-muted-foreground">Find the right summer opportunity. Build your long-term edge.</p>
          </div>
          <Button className="sketch-btn sketch-btn-primary gap-2" onClick={onGetStarted}>
            Get started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <article className="sketch-card p-6 md:p-8">
            <p className="sketch-title text-4xl leading-tight md:text-5xl">A home base for discovering your best summer path.</p>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              SummerCourse AI helps students discover real, high-impact programs and organize them into a plan that strengthens college applications year after year.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button className="sketch-btn sketch-btn-primary" onClick={onGetStarted}>
                Sign in and explore
              </Button>
              <Button variant="outline" className="sketch-btn gap-2" onClick={onGetStarted}>
                <Sparkles className="h-4 w-4" />
                Try AI planner
              </Button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="sketch-title text-2xl">500+</p>
                <p className="text-xs text-muted-foreground">Programs indexed</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="sketch-title text-2xl">3 mins</p>
                <p className="text-xs text-muted-foreground">To shortlist programs</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/70 p-3">
                <p className="sketch-title text-2xl">4 years</p>
                <p className="text-xs text-muted-foreground">Of guided summer planning</p>
              </div>
            </div>
          </article>

          <article className="sketch-card space-y-4 p-6">
            <p className="sketch-title text-2xl">Why students use it</p>
            <div className="space-y-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <div key={title} className="rounded-xl border border-border/60 bg-background/70 p-3">
                  <p className="inline-flex items-center gap-2 font-medium">
                    <Icon className="h-4 w-4" />
                    {title}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article key={step.title} className="sketch-card p-4">
              <p className="sketch-title text-xl">Step {index + 1}</p>
              <p className="mt-1 inline-flex items-center gap-2 font-medium">
                {index === 0 ? <Notebook className="h-4 w-4" /> : index === 1 ? <Compass className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                {step.title}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
