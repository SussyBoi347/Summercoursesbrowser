import { BookOpenText, Compass, Sparkles, WandSparkles } from "lucide-react";
import { Button } from "./ui/button";

interface HomePageProps {
  onGetStarted: () => void;
}

export function HomePage({ onGetStarted }: HomePageProps) {
  return (
    <main className="sketch-app min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="sketch-card p-6 md:p-8">
          <p className="sketch-heading text-4xl md:text-5xl">SummerCourse AI</p>
          <p className="mt-3 max-w-3xl text-base text-muted-foreground md:text-lg">
            Your hand-drawn planning companion for finding high school + college summer programs,
            internships, and building a smarter 4-year roadmap.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="sketch-btn sketch-btn-primary gap-2" onClick={onGetStarted}>
              <Compass className="h-4 w-4" />
              Start Exploring
            </Button>
            <Button variant="outline" className="sketch-btn gap-2">
              <WandSparkles className="h-4 w-4" />
              See AI Planner
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="sketch-card p-5">
            <BookOpenText className="mb-2 h-6 w-6" />
            <h2 className="sketch-title text-2xl">Discover Programs</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Search across subjects, grades, cost, schedule, and eligibility in one place.
            </p>
          </article>

          <article className="sketch-card p-5">
            <Sparkles className="mb-2 h-6 w-6" />
            <h2 className="sketch-title text-2xl">AI 4-Year Plan</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell the AI your goals and get a yearly summer + internship roadmap.
            </p>
          </article>

          <article className="sketch-card p-5">
            <Compass className="mb-2 h-6 w-6" />
            <h2 className="sketch-title text-2xl">Save Your Path</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Bookmark programs and save your generated plan to your account for later.
            </p>
          </article>
        </section>

        <section className="sketch-card p-6 md:p-8">
          <h3 className="sketch-title text-3xl">Built like a notebook. Designed for real planning.</h3>
          <p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
            Keep the playful hand-drawn style while still using focused filters, clean cards, and practical actions.
            Perfect for students planning ahead without the overwhelm.
          </p>
        </section>
      </div>
    </main>
  );
}
