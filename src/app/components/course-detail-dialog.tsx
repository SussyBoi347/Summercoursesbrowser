import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Clock, BookOpen, MapPin, Calendar, AlertCircle, GraduationCap } from "lucide-react";
import type { Course } from "../data/courses";

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
          <div className="aspect-video w-full overflow-hidden rounded-xl mb-4 border-2 border-primary/20">
            <img
              src={course.image}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          </div>
          <DialogTitle className="text-3xl text-primary">
            {course.title}
          </DialogTitle>
          <DialogDescription className="text-base text-foreground/80 leading-relaxed">
            {course.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1.5 border-primary/30 text-primary bg-primary/5">
              {course.subject}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">College</p>
                  <p className="font-medium">{course.college}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Duration</p>
                  <p className="font-medium">{course.duration}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Credits</p>
                  <p className="font-medium">{course.credits} college credits</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Schedule</p>
                  <p className="font-medium">{course.schedule}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-0.5">Location</p>
                  <p className="font-medium">{course.location}</p>
                </div>
              </div>

              {course.prerequisites && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="bg-amber-100 p-2 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 uppercase tracking-wide mb-0.5">Prerequisites</p>
                    <p className="font-medium text-amber-900">{course.prerequisites}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t">
            <Button className="flex-1 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30">
              Enroll Now
            </Button>
            <Button variant="outline" className="flex-1 h-12 text-base border-2 hover:bg-primary/5 hover:border-primary">
              Add to Wishlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
