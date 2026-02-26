import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import type { Course } from "../data/courses";

interface CourseCardProps {
  course: Course;
  index?: number;
  isSaved: boolean;
  onSave: (id: string) => void;
  onViewDetails: (course: Course) => void;
}

const getAgeRange = (level: string) =>
  level === "Beginner" ? "14-16" : level === "Intermediate" ? "15-17" : "16-18";

export function CourseCard({ course, index = 0, isSaved, onSave, onViewDetails }: CourseCardProps) {
  return (
    <article
      className="sketch-card sketch-tilt p-4"
      style={{ ["--tilt" as string]: `${(index % 3 - 1) * 0.18}deg` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="sketch-title text-2xl">{course.title}</h2>
          <p className="text-sm text-muted-foreground">{course.college}</p>
        </div>
        <span className="sketch-pill">{course.subject}</span>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>Age/Grade: {getAgeRange(course.level)}</span>
        <span>Cost: ${course.credits * 600}</span>
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {course.location}
        </span>
      </div>

      <p className="mt-3 line-clamp-3 text-sm">{course.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button className="sketch-btn sketch-btn-primary" onClick={() => onViewDetails(course)}>
          View details
        </Button>
        <Button variant="outline" className="sketch-btn" onClick={() => onSave(course.id)}>
          {isSaved ? "Saved" : "Save"}
        </Button>
      </div>
    </article>
  );
}
