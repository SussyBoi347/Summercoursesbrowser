import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, BookOpen, GraduationCap } from "lucide-react";
import type { Course } from "../data/courses";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card 
      className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
    >
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Open details for ${course.title}`}
      >
        <div className="aspect-video w-full overflow-hidden relative">
          <img
            src={course.image}
            alt={course.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 group-hover:text-primary transition-colors">{course.title}</h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">
              {course.subject}
            </Badge>
          </div>

          <div className="pt-2 border-t space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1 rounded">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-medium text-primary">{course.college}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1 rounded">
                <Clock className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-primary/10 p-1 rounded">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
              </div>
              <span>{course.credits} credits</span>
            </div>
          </div>
        </div>
      </button>
    </Card>
  );
}
