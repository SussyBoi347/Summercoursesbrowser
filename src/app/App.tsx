import { useState, useMemo } from "react";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Search, GraduationCap, Flame, Sparkles } from "lucide-react";
import { courses } from "./data/courses";
import { CourseCard } from "./components/course-card";
import { CourseDetailDialog } from "./components/course-detail-dialog";
import { FilterBar } from "./components/filter-bar";
import { LoginPage } from "./components/login-page";
import { AiPlanAssistant } from "./components/ai-plan-assistant";
import type { Course } from "./data/courses";

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.college.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject = selectedSubject === "all" || course.subject === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [searchQuery, selectedSubject]);

  const popularCourses = useMemo(() => {
    return filteredCourses.filter(course => course.popular);
  }, [filteredCourses]);

  const tailoredCourses = useMemo(() => {
    // Computer Science and Mathematics courses
    return filteredCourses.filter(course => 
      course.subject === "Computer Science" || course.subject === "Mathematics"
    );
  }, [filteredCourses]);

  const otherCourses = useMemo(() => {
    return filteredCourses.filter(course => 
      !course.popular && 
      course.subject !== "Computer Science" && 
      course.subject !== "Mathematics"
    );
  }, [filteredCourses]);

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const handleClearFilters = () => {
    setSelectedSubject("all");
  };

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedSubject("all");
  };

  const hasFilters = searchQuery || selectedSubject !== "all";
  if (!isAuthenticated) {
    return <LoginPage onLogin={(user) => {
      setUserName(user.name);
      setIsAuthenticated(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10 shadow-sm backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4 py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-xl">
                <GraduationCap className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl text-primary">
                  Summer College Courses 2026
                </h1>
                <p className="text-muted-foreground mt-1">High school students — accelerate your college journey</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <AiPlanAssistant userName={userName || "Student"} />
              <span className="text-sm text-muted-foreground">Hi, <span className="font-medium text-primary">{userName || "Student"}</span></span>
              <Button variant="outline" size="sm" onClick={() => {
                setIsAuthenticated(false);
                setUserName("");
              }}>
                Log out
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" />
            <Input
              type="text"
              placeholder="Search courses, instructors, colleges, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search courses"
              className="pl-12 h-12 text-base border-2 focus:border-primary shadow-sm"
            />
          </div>

          {/* Filters */}
          <FilterBar
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            onClearFilters={handleClearFilters}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-muted/50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-muted-foreground" />
            </div>
            <p className="text-foreground text-xl font-medium">No courses found matching your criteria.</p>
            <p className="text-muted-foreground mt-2">Try adjusting your filters or search query.</p>
            <Button onClick={handleClearAll} variant="outline" className="mt-6">
              Clear search and filters
            </Button>
          </div>
        ) : hasFilters ? (
          <>
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg">
                <span className="text-primary font-semibold">{filteredCourses.length}</span>{" "}
                <span className="text-muted-foreground">
                  {filteredCourses.length === 1 ? "course" : "courses"} found
                </span>
              </p>

              <Button onClick={handleClearAll} variant="outline" size="sm">
                Clear all
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => handleCourseClick(course)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-12">
            {/* Popular Courses Section */}
            {popularCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-primary">Popular Courses</h2>
                    <p className="text-sm text-muted-foreground">Trending courses this summer</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {popularCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Tailored to You Section */}
            {tailoredCourses.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl text-primary">Tailored to You</h2>
                    <p className="text-sm text-muted-foreground">Based on your interests in STEM</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {tailoredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* More Courses Section */}
            {otherCourses.length > 0 && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl text-primary">More Courses</h2>
                  <p className="text-sm text-muted-foreground">Explore additional offerings</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {otherCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onClick={() => handleCourseClick(course)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {/* Course Detail Dialog */}
      <CourseDetailDialog
        course={selectedCourse}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
