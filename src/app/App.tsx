import { useEffect, useMemo, useState } from "react";
import {
  Bot,
  FolderSearch,
  Search,
  SlidersHorizontal,
  Sparkles,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { courses } from "./data/courses";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

interface YearPlan {
  year: number;
  focus: string;
  summer: string;
  internship: string;
}

function buildAiPlan(goal: string): YearPlan[] {
  const lower = goal.toLowerCase();
  const track = lower.includes("business")
    ? "business"
    : lower.includes("medicine") || lower.includes("health")
      ? "health sciences"
      : lower.includes("engineer")
        ? "engineering"
        : "technology";

  return [
    {
      year: 1,
      focus: `Build core ${track} foundations and study habits.`,
      summer: `Complete one introductory college course in ${track} and one skills mini-project.`,
      internship: "Join a short local mentorship, shadowing, or volunteer role.",
    },
    {
      year: 2,
      focus: "Strengthen portfolio and join leadership/community activities.",
      summer: "Take an intermediate program and publish one portfolio artifact.",
      internship: "Apply for first structured internship or lab assistant role.",
    },
    {
      year: 3,
      focus: "Specialize and align choices with target colleges/majors.",
      summer: "Take an advanced course with transferable college credit.",
      internship: "Pursue competitive internship with measurable outcomes.",
    },
    {
      year: 4,
      focus: "Finalize transition into college with reduced first-year load.",
      summer: "Complete capstone summer program and finalize college application materials.",
      internship: "Select internship directly tied to intended major and long-term goal.",
    },
  ];
}

export default function App() {
  const [query, setQuery] = useState("");
  const [gradeLevel, setGradeLevel] = useState("all");
  const [subject, setSubject] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [eligibility, setEligibility] = useState("all");
  const [maxCost, setMaxCost] = useState(5000);
  const [saved, setSaved] = useState<string[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [goal, setGoal] = useState("");
  const [plan, setPlan] = useState<YearPlan[] | null>(null);
  const [planSaved, setPlanSaved] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [query, gradeLevel, subject, onlineOnly, eligibility, maxCost]);

  const programs = useMemo(() => {
    return courses
      .map((course) => {
        const computedCost = course.id.endsWith("3") || course.id.endsWith("7") ? null : course.credits * 550;
        const grade = course.level === "Beginner" ? "9-10" : course.level === "Intermediate" ? "10-11" : "11-12";
        return {
          ...course,
          grade,
          cost: computedCost,
        };
      })
      .filter((item) => {
        const matchesQuery =
          !query ||
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase()) ||
          item.college.toLowerCase().includes(query.toLowerCase());

        const matchesGrade = gradeLevel === "all" || item.grade === gradeLevel;
        const matchesSubject = subject === "all" || item.subject === subject;
        const matchesOnline = !onlineOnly || item.location.toLowerCase().includes("online");
        const matchesEligibility =
          eligibility === "all" ||
          (eligibility === "no-prereq" && !item.prerequisites) ||
          (eligibility === "prereq" && !!item.prerequisites);
        const matchesCost = item.cost === null || item.cost <= maxCost;

        return matchesQuery && matchesGrade && matchesSubject && matchesOnline && matchesEligibility && matchesCost;
      });
  }, [query, gradeLevel, subject, onlineOnly, eligibility, maxCost]);

  const subjects = Array.from(new Set(courses.map((course) => course.subject)));

  const toggleSave = (id: string) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const generatePlan = () => {
    if (!goal.trim()) return;
    setPlan(buildAiPlan(goal));
    setPlanSaved(false);
  };

  const savePlan = () => {
    if (!plan) return;
    localStorage.setItem("summer-ai-4year-plan", JSON.stringify({ goal, plan }));
    setPlanSaved(true);
  };

  const filterPanel = (
    <aside className="sketch-panel p-4 md:p-5 space-y-4">
      <h3 className="sketch-heading text-2xl">Filters</h3>

      <div>
        <label className="sketch-label">Grade level</label>
        <select className="sketch-input mt-2" value={gradeLevel} onChange={(event) => setGradeLevel(event.target.value)}>
          <option value="all">All grades</option>
          <option value="9-10">9-10</option>
          <option value="10-11">10-11</option>
          <option value="11-12">11-12</option>
        </select>
      </div>

      <div>
        <label className="sketch-label">Subject</label>
        <div className="mt-2 space-y-2">
          <label className="sketch-check"><input type="radio" checked={subject === "all"} onChange={() => setSubject("all")} />All</label>
          {subjects.map((item) => (
            <label key={item} className="sketch-check"><input type="radio" checked={subject === item} onChange={() => setSubject(item)} />{item}</label>
          ))}
        </div>
      </div>

      <div>
        <label className="sketch-label">Location / online</label>
        <label className="sketch-check mt-2"><input type="checkbox" checked={onlineOnly} onChange={(event) => setOnlineOnly(event.target.checked)} />Online only</label>
      </div>

      <div>
        <label className="sketch-label">Cost range (max: ${maxCost})</label>
        <input className="sketch-slider mt-2" type="range" min={500} max={5000} step={250} value={maxCost} onChange={(event) => setMaxCost(Number(event.target.value))} />
      </div>

      <div>
        <label className="sketch-label">Eligibility</label>
        <select className="sketch-input mt-2" value={eligibility} onChange={(event) => setEligibility(event.target.value)}>
          <option value="all">All</option>
          <option value="no-prereq">No prerequisites</option>
          <option value="prereq">Has prerequisites</option>
        </select>
      </div>
    </aside>
  );

  return (
    <div className="sketch-app min-h-screen">
      <header className="sketch-topbar">
        <h1 className="sketch-logo">SummerCourse AI</h1>
        <div className="relative flex-1 max-w-2xl">
          <Search className="sketch-search-icon h-5 w-5" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search summer courses, programs, internships..."
            className="sketch-input h-12 pl-11"
            aria-label="Search programs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button className="sketch-button" onClick={() => setShowMobileFilters((prev) => !prev)}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
          <Button className="sketch-button" variant="outline">
            <Bookmark className="h-4 w-4" />
            Saved ({saved.length})
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="sketch-button sketch-primary">
                <Sparkles className="h-4 w-4" />
                AI 4-Year Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="sketch-panel sm:max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="sketch-heading text-3xl">Plan my next 4 years</DialogTitle>
                <DialogDescription className="text-foreground">
                  Tell the AI your goal with summer programs and internships.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={goal}
                  onChange={(event) => setGoal(event.target.value)}
                  placeholder="Example: I want top CS internships by senior year and enough college credits to graduate faster."
                  className="sketch-input min-h-24"
                />
                <Button className="sketch-button sketch-primary w-full" onClick={generatePlan}>Generate plan</Button>

                {plan && (
                  <div className="space-y-3">
                    {plan.map((year) => (
                      <div key={year.year} className="sketch-card p-3">
                        <p className="sketch-heading text-xl">Year {year.year}</p>
                        <p className="text-sm mt-1"><strong>Focus:</strong> {year.focus}</p>
                        <p className="text-sm mt-1"><strong>Summer:</strong> {year.summer}</p>
                        <p className="text-sm mt-1"><strong>Internship:</strong> {year.internship}</p>
                      </div>
                    ))}

                    <div className="sketch-card p-4">
                      <p className="text-sm">Save this plan to your account?</p>
                      <Button className="sketch-button mt-3" onClick={savePlan}>Save to account</Button>
                      {planSaved && <p className="text-sm mt-2">✓ Plan saved.</p>}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        {showMobileFilters && <div className="md:hidden mb-4">{filterPanel}</div>}

        <div className="grid gap-6 md:grid-cols-[280px_1fr]">
          <div className="hidden md:block">{filterPanel}</div>

          <section className="space-y-4">
            {isLoading ? (
              <div className="sketch-panel p-8 text-center">
                <Bot className="mx-auto h-12 w-12 mb-2" />
                <p className="sketch-heading text-3xl">Sketching results…</p>
              </div>
            ) : programs.length === 0 ? (
              <div className="sketch-panel p-8 text-center">
                <FolderSearch className="mx-auto h-12 w-12 mb-2" />
                <p className="sketch-heading text-3xl">No programs found.</p>
                <p className="text-sm mt-1">Try different filters.</p>
              </div>
            ) : (
              programs.map((program) => (
                <article key={program.id} className="sketch-card p-4 md:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="sketch-heading text-3xl">{program.title}</h2>
                      <p className="text-sm mt-1">{program.college} · {program.subject}</p>
                    </div>
                    <span className="sketch-pill">Grade {program.grade}</span>
                  </div>

                  <div className="mt-3 grid gap-2 text-sm md:grid-cols-3">
                    <p><strong>Provider:</strong> {program.college}</p>
                    <p><strong>Dates:</strong> {program.session}</p>
                    <p><strong>Cost:</strong> {program.cost ? `$${program.cost}` : "Unknown"}</p>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed line-clamp-3">{program.description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="sketch-button sketch-primary">Open Apply Link</Button>
                    <Button className="sketch-button" variant="outline" onClick={() => toggleSave(program.id)}>
                      {saved.includes(program.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                      {saved.includes(program.id) ? "Saved" : "Save"}
                    </Button>
                  </div>
                </article>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
