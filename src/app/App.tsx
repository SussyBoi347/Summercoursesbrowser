import { useEffect, useMemo, useState } from "react";
import { BookMarked, Bot, FolderSearch, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./components/ui/sheet";
import { courses, type Course } from "./data/courses";
import { LoginPage } from "./components/login-page";
import { AiPlanAssistant } from "./components/ai-plan-assistant";
import { HomePage } from "./components/home-page";
import { FilterBar } from "./components/filter-bar";
import { CourseCard } from "./components/course-card";
import { CourseDetailDialog } from "./components/course-detail-dialog";

type GradeFilter = "9-10" | "10-11" | "11-12";

export default function App() {
  const [showHome, setShowHome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilters, setSubjectFilters] = useState<string[]>([]);
  const [gradeFilters, setGradeFilters] = useState<GradeFilter[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sessionFilters, setSessionFilters] = useState<string[]>([]);
  const [costRange, setCostRange] = useState([0, 3000]);
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const key = `saved-programs:${userName || "student"}`;
    const raw = localStorage.getItem(key);
    if (raw) setSavedPrograms(JSON.parse(raw));
  }, [userName]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 350);
    setIsLoading(true);
    return () => clearTimeout(timer);
  }, [searchQuery, subjectFilters, gradeFilters, onlineOnly, eligibleOnly, sessionFilters, costRange]);

  const allSubjects = useMemo(() => [...new Set(courses.map((course) => course.subject))], []);

  const filteredPrograms = useMemo(() => {
    return courses.filter((course) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !search ||
        course.title.toLowerCase().includes(search) ||
        course.description.toLowerCase().includes(search) ||
        course.college.toLowerCase().includes(search);

      const matchesSubject = subjectFilters.length === 0 || subjectFilters.includes(course.subject);

      const gradeRange: GradeFilter =
        course.level === "Beginner" ? "9-10" : course.level === "Intermediate" ? "10-11" : "11-12";
      const matchesGrade = gradeFilters.length === 0 || gradeFilters.includes(gradeRange);

      const isOnline = course.location.toLowerCase().includes("online");
      const matchesLocation = !onlineOnly || isOnline;
      const matchesEligibility = !eligibleOnly || !course.prerequisites;
      const matchesSession = sessionFilters.length === 0 || sessionFilters.includes(course.session);

      const estimatedCost = course.credits * 600;
      const matchesCost = estimatedCost >= costRange[0] && estimatedCost <= costRange[1];

      return (
        matchesSearch &&
        matchesSubject &&
        matchesGrade &&
        matchesLocation &&
        matchesEligibility &&
        matchesSession &&
        matchesCost
      );
    });
  }, [searchQuery, subjectFilters, gradeFilters, onlineOnly, eligibleOnly, sessionFilters, costRange]);

  const savedProgramData = useMemo(
    () => courses.filter((course) => savedPrograms.includes(course.id)),
    [savedPrograms],
  );

  const toggleSelection = <T extends string>(value: T, current: T[], setter: (value: T[]) => void) => {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  };

  const handleSaveProgram = (id: string) => {
    const key = `saved-programs:${userName || "student"}`;
    const next = savedPrograms.includes(id)
      ? savedPrograms.filter((item) => item !== id)
      : [...savedPrograms, id];
    setSavedPrograms(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const clearFilters = () => {
    setSubjectFilters([]);
    setGradeFilters([]);
    setOnlineOnly(false);
    setEligibleOnly(false);
    setSessionFilters([]);
    setCostRange([0, 3000]);
  };

  const filterPanel = (
    <FilterBar
      allSubjects={allSubjects}
      gradeFilters={gradeFilters}
      subjectFilters={subjectFilters}
      sessionFilters={sessionFilters}
      onlineOnly={onlineOnly}
      eligibleOnly={eligibleOnly}
      costRange={costRange}
      onGradeToggle={(grade) => toggleSelection(grade, gradeFilters, setGradeFilters)}
      onSubjectToggle={(subject) => toggleSelection(subject, subjectFilters, setSubjectFilters)}
      onSessionToggle={(session) => toggleSelection(session, sessionFilters, setSessionFilters)}
      onOnlineOnlyChange={setOnlineOnly}
      onEligibleOnlyChange={setEligibleOnly}
      onCostRangeChange={setCostRange}
      onClearFilters={clearFilters}
    />
  );

  if (showHome) {
    return <HomePage onGetStarted={() => setShowHome(false)} />;
  }

  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(user) => {
          setUserName(user.name);
          setIsAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className="sketch-app min-h-screen">
      <header className="sketch-topbar sticky top-0 z-20 border-b">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 lg:gap-6">
          <div className="min-w-fit">
            <p className="sketch-heading text-2xl">SummerCourse AI</p>
          </div>

          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search summer programs, colleges, providers..."
              className="sketch-input h-11 pl-9"
            />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <AiPlanAssistant userName={userName || "Student"} />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="sketch-btn gap-2">
                  <BookMarked className="h-4 w-4" />
                  Saved Programs ({savedPrograms.length})
                </Button>
              </DialogTrigger>
              <DialogContent className="sketch-card sm:max-w-xl">
                <DialogHeader>
                  <DialogTitle className="sketch-title text-2xl">Saved Programs</DialogTitle>
                  <DialogDescription>Programs you want to revisit are listed here.</DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  {savedProgramData.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No saved programs yet.</p>
                  ) : (
                    savedProgramData.map((program) => (
                      <div key={program.id} className="sketch-card p-3">
                        <p className="sketch-title">{program.title}</p>
                        <p className="text-sm text-muted-foreground">{program.college}</p>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              className="sketch-btn"
              onClick={() => {
                setIsAuthenticated(false);
                setShowHome(true);
              }}
            >
              Log out
            </Button>
          </div>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="sketch-btn">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="sketch-app overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="sketch-title">Filters</SheetTitle>
                  <SheetDescription>Adjust filters for better matches.</SheetDescription>
                </SheetHeader>
                <div className="px-4 pb-6">{filterPanel}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-5 px-4 py-6 lg:grid-cols-[300px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <section className="space-y-4">
          {isLoading ? (
            <div className="sketch-card flex min-h-56 flex-col items-center justify-center text-center">
              <Bot className="mb-3 h-10 w-10" />
              <p className="sketch-title text-2xl">Sketching results…</p>
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="sketch-card flex min-h-56 flex-col items-center justify-center text-center">
              <FolderSearch className="mb-3 h-10 w-10" />
              <p className="sketch-title text-2xl">No programs found.</p>
              <p className="text-sm text-muted-foreground">Try different filters.</p>
            </div>
          ) : (
            filteredPrograms.map((program, index) => (
              <CourseCard
                key={program.id}
                course={program}
                index={index}
                isSaved={savedPrograms.includes(program.id)}
                onSave={handleSaveProgram}
                onViewDetails={setSelectedCourse}
              />
            ))
          )}
        </section>
      </main>

      <CourseDetailDialog
        course={selectedCourse}
        open={Boolean(selectedCourse)}
        onOpenChange={(open) => {
          if (!open) setSelectedCourse(null);
        }}
        isSaved={selectedCourse ? savedPrograms.includes(selectedCourse.id) : false}
        onSave={handleSaveProgram}
      />
    </div>
  );
}
