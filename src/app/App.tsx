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
import { courses as mockCourses, type Course } from "./data/courses";
import { LoginPage } from "./components/login-page";
import { AiPlanAssistant } from "./components/ai-plan-assistant";
import { HomePage } from "./components/home-page";
import { FilterBar } from "./components/filter-bar";
import { CourseCard } from "./components/course-card";
import { CourseDetailDialog } from "./components/course-detail-dialog";

export default function App() {
  const [showHome, setShowHome] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilters, setSubjectFilters] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [eligibleOnly, setEligibleOnly] = useState(false);
  const [sessionFilters, setSessionFilters] = useState<string[]>([]);
  const [costRange, setCostRange] = useState([0, 3000]);
  const [savedPrograms, setSavedPrograms] = useState<string[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      setIsCoursesLoading(true);
      setCoursesError(null);

      const endpoints = ["/api/courses", "/data/courses.generated.json"];

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (!response.ok) continue;

          const payload = await response.json();
          if (!Array.isArray(payload)) continue;

          if (isMounted) {
            setCourses(payload as Course[]);
            setIsCoursesLoading(false);
          }
          return;
        } catch {
          // Try next endpoint.
        }
      }

      if (import.meta.env.DEV) {
        if (isMounted) {
          setCourses(mockCourses);
          setIsCoursesLoading(false);
        }
        return;
      }

      if (isMounted) {
        setCourses([]);
        setCoursesError("Unable to load courses right now. Please try again soon.");
        setIsCoursesLoading(false);
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const key = `saved-programs:${userName || "student"}`;
    const raw = localStorage.getItem(key);
    if (raw) setSavedPrograms(JSON.parse(raw));
  }, [userName]);

  useEffect(() => {
    const timer = setTimeout(() => setIsFiltering(false), 350);
    setIsFiltering(true);
    return () => clearTimeout(timer);
  }, [searchQuery, subjectFilters, onlineOnly, eligibleOnly, sessionFilters, costRange]);

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

      const isOnline = course.deliveryMode === "online" || course.deliveryMode === "hybrid";
      const matchesLocation = !onlineOnly || isOnline;
      const matchesEligibility = !eligibleOnly || course.prerequisites === "None"
      const matchesSession = sessionFilters.length === 0 || sessionFilters.includes(course.session);

      const estimatedCost = course.tuition;
      const matchesCost = estimatedCost >= costRange[0] && estimatedCost <= costRange[1];

      return matchesSearch && matchesSubject && matchesLocation && matchesEligibility && matchesSession && matchesCost;
    });
  }, [searchQuery, subjectFilters, onlineOnly, eligibleOnly, sessionFilters, costRange]);

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
    setOnlineOnly(false);
    setEligibleOnly(false);
    setSessionFilters([]);
    setCostRange([0, 3000]);
  };

  const FilterPanel = (
    <div className="sketch-card space-y-5 p-4">
      <div>
        <p className="sketch-title text-xl">Filters</p>
        <p className="text-sm text-muted-foreground">Narrow by delivery mode, cost, and prerequisites.</p>
      </div>


      <div className="space-y-2">
        <p className="text-sm font-semibold">Subject</p>
        {allSubjects.map((subject) => (
          <label key={subject} className="sketch-check flex items-center gap-2 text-sm">
            <Checkbox
              checked={subjectFilters.includes(subject)}
              onCheckedChange={() => toggleSelection(subject, subjectFilters, setSubjectFilters)}
            />
            {subject}
          </label>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold">Cost range</p>
        <Slider
          value={costRange}
          min={0}
          max={3000}
          step={100}
          onValueChange={(value) => setCostRange(value as number[])}
          className="sketch-slider"
        />
        <p className="text-xs text-muted-foreground">${costRange[0]} - ${costRange[1]}</p>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Dates</p>
        {["Session 1", "Session 2"].map((session) => (
          <label key={session} className="sketch-check flex items-center gap-2 text-sm">
            <Checkbox
              checked={sessionFilters.includes(session)}
              onCheckedChange={() => toggleSelection(session, sessionFilters, setSessionFilters)}
            />
            {session}
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-semibold">Location & eligibility</p>
        <label className="sketch-check flex items-center gap-2 text-sm">
          <Checkbox checked={onlineOnly} onCheckedChange={() => setOnlineOnly(!onlineOnly)} />
          Online only
        </label>
        <label className="sketch-check flex items-center gap-2 text-sm">
          <Checkbox checked={eligibleOnly} onCheckedChange={() => setEligibleOnly(!eligibleOnly)} />
          No prerequisites
        </label>
      </div>

      <Button variant="outline" className="w-full sketch-btn" onClick={clearFilters}>
        Reset filters
      </Button>
    </div>
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
          {isCoursesLoading ? (
            <div className="sketch-card flex min-h-56 flex-col items-center justify-center text-center">
              <Bot className="mb-3 h-10 w-10" />
              <p className="sketch-title text-2xl">Loading courses…</p>
            </div>
          ) : coursesError ? (
            <div className="sketch-card flex min-h-56 flex-col items-center justify-center gap-2 text-center">
              <FolderSearch className="mb-1 h-10 w-10" />
              <p className="sketch-title text-2xl">Couldn’t load courses.</p>
              <p className="text-sm text-muted-foreground">{coursesError}</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="sketch-card flex min-h-56 flex-col items-center justify-center text-center">
              <FolderSearch className="mb-3 h-10 w-10" />
              <p className="sketch-title text-2xl">No courses are available yet.</p>
            </div>
          ) : isFiltering ? (
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
              <article key={program.id} className="sketch-card sketch-tilt p-4" style={{ ["--tilt" as string]: `${(index % 3 - 1) * 0.18}deg` }}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="sketch-title text-2xl">{program.title}</h2>
                    <p className="text-sm text-muted-foreground">{program.college}</p>
                  </div>
                  <span className="sketch-pill">{program.subject}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span>Delivery: {program.deliveryMode}</span>
                  <span>Cost: ${program.tuition}</span>
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {program.location}</span>
                </div>

                <p className="mt-3 line-clamp-3 text-sm">{program.description}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button asChild className="sketch-btn sketch-btn-primary"><a href={program.applyUrl} target="_blank" rel="noreferrer">Open Apply Link</a></Button>
                  <Button variant="outline" className="sketch-btn" onClick={() => handleSaveProgram(program.id)}>
                    {savedPrograms.includes(program.id) ? "Saved" : "Save"}
                  </Button>
                </div>
              </article>
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
