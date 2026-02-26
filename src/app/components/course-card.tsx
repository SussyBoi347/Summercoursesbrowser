import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Clock, BookOpen, GraduationCap, MapPin } from "lucide-react";
import type { Course } from "../data/course-schema";

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export function CourseCard({ course, onClick }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover:shadow-xl hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
      <button
        type="button"
        onClick={onClick}
        className="w-full p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`Open details for ${course.title}`}
      >
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 flex-1 group-hover:text-primary transition-colors">{course.title}</h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5">{course.subject}</Badge>
            <Badge variant="secondary">{course.deliveryMode}</Badge>
          </div>

          <div className="pt-2 border-t space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-primary">{course.college}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span>{course.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-primary" />
              <span>{course.credits} credits</span>
            </div>
          </div>
        </div>
      </button>
    </Card>
  );
}
