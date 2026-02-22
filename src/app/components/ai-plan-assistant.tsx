import { useMemo, useState } from "react";
import { WandSparkles, Save, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";

interface AiPlanAssistantProps {
  userName: string;
}

interface PlanYear {
  year: number;
  focus: string;
  summer: string;
  internship: string;
}

function buildPlan(goal: string): PlanYear[] {
  const lowerGoal = goal.toLowerCase();
  const isHealth = /medicine|doctor|nursing|health|biomedical/.test(lowerGoal);
  const isBusiness = /finance|business|entrepreneur|marketing|economics/.test(lowerGoal);
  const isEngineering = /engineer|robot|mechanical|civil|electrical/.test(lowerGoal);

  const track = isHealth
    ? "Healthcare"
    : isBusiness
      ? "Business"
      : isEngineering
        ? "Engineering"
        : "STEM";

  return [
    {
      year: 1,
      focus: `Build a strong ${track} foundation and academic habits.`,
      summer: `Take one college-level intro class aligned to ${track} and complete a small portfolio project.`,
      internship: "Shadow a professional or join a short volunteer/research experience.",
    },
    {
      year: 2,
      focus: "Advance into intermediate coursework and leadership.",
      summer: "Take 2 transferable classes and complete a capstone-style project with mentorship.",
      internship: "Apply for a structured internship or research assistant position.",
    },
    {
      year: 3,
      focus: "Specialize based on your strongest interests and college goals.",
      summer: "Take advanced courses and prep application materials (essays/resume/recommendations).",
      internship: "Pursue a competitive internship with measurable deliverables.",
    },
    {
      year: 4,
      focus: "Finalize college-ready profile and transition plan.",
      summer: "Take final credit-bearing courses to reduce first-year college workload.",
      internship: "Choose an internship that directly matches your intended major/career path.",
    },
  ];
}

export function AiPlanAssistant({ userName }: AiPlanAssistantProps) {
  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<PlanYear[] | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");

  const storageKey = useMemo(() => `summer-plan:${userName || "student"}`,[userName]);

  const handleGeneratePlan = () => {
    if (!goal.trim()) {
      setError("Tell the AI your goal first so it can generate your plan.");
      return;
    }

    setError("");
    setPlan(buildPlan(goal));
    setIsSaved(false);
  };

  const handleSavePlan = () => {
    if (!plan) return;

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        goal,
        plan,
        savedAt: new Date().toISOString(),
      }),
    );

    setIsSaved(true);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <WandSparkles className="h-4 w-4" />
          AI 4-Year Planner
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-primary">AI Summer Program Planner</DialogTitle>
          <DialogDescription>
            Share your goal and the AI will draft a 4-year roadmap with summer course and internship milestones.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label htmlFor="goal" className="mb-2 block text-sm font-medium">
              What is your long-term goal?
            </label>
            <Textarea
              id="goal"
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              placeholder="Example: I want to study computer science, build AI projects, and get internships by junior year."
              className="min-h-24"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button onClick={handleGeneratePlan} className="w-full">
            Generate my 4-year plan
          </Button>

          {plan && (
            <div className="space-y-3 rounded-xl border bg-muted/20 p-4">
              <h3 className="text-lg text-primary">Your AI plan</h3>
              {plan.map((year) => (
                <div key={year.year} className="rounded-lg border bg-card p-3">
                  <p className="font-semibold">Year {year.year}</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Focus:</strong> {year.focus}</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Summer:</strong> {year.summer}</p>
                  <p className="text-sm text-muted-foreground mt-1"><strong>Internship:</strong> {year.internship}</p>
                </div>
              ))}

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
                <p className="text-sm">Do you want to save this plan to your account?</p>
                <Button onClick={handleSavePlan} variant="outline" className="mt-3 gap-2">
                  <Save className="h-4 w-4" />
                  Save plan
                </Button>
                {isSaved && (
                  <p className="mt-3 inline-flex items-center gap-2 text-sm text-primary">
                    <CheckCircle2 className="h-4 w-4" />
                    Plan saved to your account.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
