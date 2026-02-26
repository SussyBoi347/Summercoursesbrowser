import { courseListSchema, type Course as SourceCourse } from "./course-schema";
import { courses as staticCourses } from "./courses.base";
import generatedCoursesRaw from "./courses.generated.json";

export interface Course {
  id: string;
  title: string;
  subject: string;
  description: string;
  instructor: string;
  duration: string;
  session: string;
  level: string;
  credits: number;
  seats: number;
  enrolled: number;
  image: string;
  prerequisites?: string;
  schedule: string;
  location: string;
  college: string;
  popular?: boolean;
  applyUrl?: string;
  sourceUrl?: string;
  provider?: string;
}

function toLegacyCourse(course: SourceCourse, index: number): Course {
  const level = course.credits >= 4 ? "Advanced" : course.credits <= 2 ? "Beginner" : "Intermediate";

  return {
    id: course.id,
    title: course.title,
    subject: course.subject,
    description: course.description,
    instructor: course.college,
    duration: course.duration,
    session: course.session,
    level,
    credits: course.credits,
    seats: 200,
    enrolled: 60 + index,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    prerequisites: course.prerequisites === "None" ? undefined : course.prerequisites,
    schedule: course.deliveryMode === "online" ? "Self-paced online" : "Check provider site",
    location: course.deliveryMode === "online" ? "Online" : course.location,
    college: course.college,
    popular: index < 4,
    applyUrl: course.applyUrl,
    sourceUrl: course.sourceUrl,
    provider: "External",
  };
}

const generatedValidation = courseListSchema.safeParse(generatedCoursesRaw);
const sourceCourses = generatedValidation.success && generatedValidation.data.length > 0
  ? generatedValidation.data
  : staticCourses;

export const courses: Course[] = sourceCourses.map(toLegacyCourse);
