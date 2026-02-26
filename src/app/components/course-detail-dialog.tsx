import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, BookOpen, MapPin, AlertCircle, GraduationCap, Link as LinkIcon } from "lucide-react";
import type { Course } from "../data/course-schema";

interface CourseDetailDialogProps {
  course: Course | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseDetailDialog({ course, open, onOpenChange }: CourseDetailDialogProps) {
  if (!course) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-primary">{course.title}</DialogTitle>
          <DialogDescription className="text-base text-foreground/80 leading-relaxed">{course.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1.5 border-primary/30 text-primary bg-primary/5">{course.subject}</Badge>
            <Badge variant="secondary" className="text-sm px-3 py-1.5">{course.deliveryMode}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <GraduationCap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">College</p>
                  <p className="font-medium">{course.college}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Duration / Session</p>
                  <p className="font-medium">{course.duration} · {course.session}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Credits / Tuition</p>
                  <p className="font-medium">{course.credits} credits · ${course.tuition}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Location</p>
                  <p className="font-medium">{course.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <LinkIcon className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Verified</p>
                  <p className="font-medium">{new Date(course.lastVerifiedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {course.prerequisites !== "None" && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-5 h-5 text-amber-700" />
                  <div>
                    <p className="text-xs text-amber-700 uppercase tracking-wide mb-0.5">Prerequisites</p>
                    <p className="font-medium text-amber-900">{course.prerequisites}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <Button asChild className="flex-1 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              <a href={course.applyUrl} target="_blank" rel="noreferrer">Apply Now</a>
            </Button>
            <Button asChild variant="outline" className="flex-1 h-12 text-base border-2 hover:bg-primary/5 hover:border-primary">
              <a href={course.sourceUrl} target="_blank" rel="noreferrer">View Source</a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
