import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { BookOpen, Calendar, Clock, GraduationCap, MapPin } from "lucide-react";
import type { Course } from "../data/courses";

interface CourseDetailDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isSaved: boolean;
  onSave: (id: string) => void;
}

export function CourseDetailDialog({
  course,
  open,
  onOpenChange,
  isSaved,
  onSave,
}: CourseDetailDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sketch-card max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sketch-title text-2xl">{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
          <p className="sketch-check flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {course.college}
          </p>
          <p className="sketch-check flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {course.duration}
          </p>
          <p className="sketch-check flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {course.credits} credits
          </p>
          <p className="sketch-check flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {course.schedule}
          </p>
          <p className="sketch-check flex items-center gap-2 md:col-span-2">
            <MapPin className="h-4 w-4" />
            {course.location}
          </p>
          {course.prerequisites && (
            <p className="sketch-check md:col-span-2">Prerequisites: {course.prerequisites}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button className="sketch-btn sketch-btn-primary">Open apply link</Button>
          <Button variant="outline" className="sketch-btn" onClick={() => onSave(course.id)}>
            {isSaved ? "Saved" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
