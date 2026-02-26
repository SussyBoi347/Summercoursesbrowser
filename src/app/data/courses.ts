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
  tuition?: number;
  deliveryMode?: "Online" | "In Person" | "Hybrid" | string;
  gradeBands?: string[];
}

// Local fallback dataset for development mode when API/static JSON is unavailable.
export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    subject: "Computer Science",
    description: "Learn the fundamentals of programming with Python. This course covers data structures, algorithms, and problem-solving techniques essential for any aspiring computer scientist.",
    instructor: "Dr. Sarah Chen",
    duration: "6 weeks",
    session: "Session 1",
    level: "Beginner",
    credits: 3,
    seats: 25,
    enrolled: 18,
    image: "https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kaW5nfGVufDF8fHx8MTc3MTQ4NzI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Mon, Wed, Fri 9:00 AM - 12:00 PM",
    location: "Building A, Room 201",
    college: "Stanford University",
    popular: true
  },
  {
    id: "2",
    title: "Advanced Biology: Genetics & Evolution",
    subject: "Science",
    description: "Dive deep into the mechanisms of heredity and evolution. Study DNA, genetic variation, natural selection, and modern genetic technologies through hands-on lab work.",
    instructor: "Prof. Michael Rodriguez",
    duration: "4 weeks",
    session: "Session 2",
    level: "Advanced",
    credits: 4,
    seats: 20,
    enrolled: 15,
    image: "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMHN0dWRlbnRzfGVufDF8fHx8MTc3MTUxMDczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prerequisites: "Biology I or equivalent",
    schedule: "Tue, Thu 1:00 PM - 4:30 PM",
    location: "Science Building, Lab 305",
    college: "MIT"
  },
  {
    id: "3",
    title: "Creative Writing Workshop",
    subject: "English",
    description: "Develop your voice as a writer through fiction, poetry, and creative nonfiction. Participate in peer workshops and receive personalized feedback from published authors.",
    instructor: "Emma Thompson",
    duration: "6 weeks",
    session: "Session 1",
    level: "Intermediate",
    credits: 3,
    seats: 15,
    enrolled: 12,
    image: "https://images.unsplash.com/photo-1535058489223-1331b20fa114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbGl0ZXJhdHVyZSUyMGJvb2tzfGVufDF8fHx8MTc3MTQyNTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Mon, Wed 2:00 PM - 4:00 PM",
    location: "Humanities Hall, Room 102",
    college: "Yale University",
    popular: true
  },
  {
    id: "4",
    title: "Calculus I",
    subject: "Mathematics",
    description: "Master the foundations of differential and integral calculus. Topics include limits, derivatives, integrals, and their applications to real-world problems.",
    instructor: "Dr. James Liu",
    duration: "6 weeks",
    session: "Session 1",
    level: "Intermediate",
    credits: 4,
    seats: 30,
    enrolled: 28,
    image: "https://images.unsplash.com/photo-1754304342329-3c5aff22a39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MTUyNTEzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prerequisites: "Pre-Calculus or equivalent",
    schedule: "Mon, Tue, Wed, Thu 10:00 AM - 12:00 PM",
    location: "Math Building, Room 401",
    college: "Harvard University",
    popular: true
  },
  {
    id: "5",
    title: "Studio Art: Painting Fundamentals",
    subject: "Arts",
    description: "Explore color theory, composition, and various painting techniques using acrylics and oils. Build a portfolio of original artwork while studying art history.",
    instructor: "Isabella Martinez",
    duration: "4 weeks",
    session: "Session 2",
    level: "Beginner",
    credits: 3,
    seats: 18,
    enrolled: 14,
    image: "https://images.unsplash.com/photo-1598389118600-9a83ceb4ebe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjbGFzc3Jvb20lMjBwYWludGluZ3xlbnwxfHx8fDE3NzE1MjUxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Mon, Wed, Fri 1:00 PM - 4:00 PM",
    location: "Arts Center, Studio 3",
    college: "Columbia University"
  },
  {
    id: "6",
    title: "Introduction to Business & Entrepreneurship",
    subject: "Business",
    description: "Learn the basics of business management, marketing, finance, and entrepreneurship. Develop a business plan and pitch your startup idea to local entrepreneurs.",
    instructor: "Prof. David Kim",
    duration: "6 weeks",
    session: "Session 1",
    level: "Beginner",
    credits: 3,
    seats: 25,
    enrolled: 22,
    image: "https://images.unsplash.com/photo-1758691737182-d42aefd6dee8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByZXNlbnRhdGlvbiUyMHN0dWRlbnRzfGVufDF8fHx8MTc3MTUyNTEzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Tue, Thu 9:00 AM - 11:30 AM",
    location: "Business School, Room 150",
    college: "University of Pennsylvania",
    popular: true
  },
  {
    id: "7",
    title: "Music Theory & Composition",
    subject: "Music",
    description: "Study the fundamentals of music theory including harmony, rhythm, and melody. Compose your own pieces and learn to read and write musical notation.",
    instructor: "Dr. Alexandra Williams",
    duration: "4 weeks",
    session: "Session 2",
    level: "Intermediate",
    credits: 3,
    seats: 20,
    enrolled: 16,
    image: "https://images.unsplash.com/photo-1645397970890-77b59dc61dc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGluc3RydW1lbnRzJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcxNTI1MTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Mon, Wed, Fri 10:00 AM - 12:00 PM",
    location: "Music Hall, Room 205",
    college: "Juilliard School"
  },
  {
    id: "8",
    title: "Web Development Bootcamp",
    subject: "Computer Science",
    description: "Build modern websites using HTML, CSS, JavaScript, and React. Create a portfolio of web projects including responsive designs and interactive applications.",
    instructor: "Alex Johnson",
    duration: "6 weeks",
    session: "Session 1",
    level: "Intermediate",
    credits: 4,
    seats: 22,
    enrolled: 20,
    image: "https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHByb2dyYW1taW5nJTIwY29kaW5nfGVufDF8fHx8MTc3MTQ4NzI0OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prerequisites: "Introduction to Computer Science or basic programming knowledge",
    schedule: "Tue, Thu 1:00 PM - 4:00 PM",
    location: "Building A, Room 203",
    college: "Carnegie Mellon University",
    popular: true
  },
  {
    id: "9",
    title: "Chemistry: Organic Chemistry Basics",
    subject: "Science",
    description: "Introduction to organic chemistry including structure, nomenclature, and reactions of organic compounds. Extensive lab work with synthesis and analysis.",
    instructor: "Dr. Rachel Green",
    duration: "6 weeks",
    session: "Session 2",
    level: "Advanced",
    credits: 4,
    seats: 18,
    enrolled: 16,
    image: "https://images.unsplash.com/photo-1605781645799-c9c7d820b4ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwbGFib3JhdG9yeSUyMHN0dWRlbnRzfGVufDF8fHx8MTc3MTUxMDczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prerequisites: "General Chemistry I & II",
    schedule: "Mon, Wed, Fri 9:00 AM - 12:30 PM",
    location: "Science Building, Lab 310",
    college: "UC Berkeley"
  },
  {
    id: "10",
    title: "American Literature: Contemporary Voices",
    subject: "English",
    description: "Explore contemporary American literature from diverse perspectives. Read and analyze works by modern authors addressing current social and cultural issues.",
    instructor: "Prof. Marcus Brown",
    duration: "4 weeks",
    session: "Session 1",
    level: "Intermediate",
    credits: 3,
    seats: 20,
    enrolled: 17,
    image: "https://images.unsplash.com/photo-1535058489223-1331b20fa114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3cml0aW5nJTIwbGl0ZXJhdHVyZSUyMGJvb2tzfGVufDF8fHx8MTc3MTQyNTg5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Tue, Thu 10:00 AM - 12:30 PM",
    location: "Humanities Hall, Room 105",
    college: "Princeton University"
  },
  {
    id: "11",
    title: "Statistics for Data Science",
    subject: "Mathematics",
    description: "Learn statistical methods used in data analysis including probability, hypothesis testing, regression, and data visualization. Apply concepts using R and Python.",
    instructor: "Dr. Nina Patel",
    duration: "6 weeks",
    session: "Session 2",
    level: "Intermediate",
    credits: 3,
    seats: 28,
    enrolled: 24,
    image: "https://images.unsplash.com/photo-1754304342329-3c5aff22a39c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRoZW1hdGljcyUyMGNsYXNzcm9vbSUyMGxlYXJuaW5nfGVufDF8fHx8MTc3MTUyNTEzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    prerequisites: "Algebra II or equivalent",
    schedule: "Mon, Wed, Fri 2:00 PM - 4:00 PM",
    location: "Math Building, Room 305",
    college: "Duke University"
  },
  {
    id: "12",
    title: "Digital Photography & Visual Storytelling",
    subject: "Arts",
    description: "Master digital photography techniques, composition, lighting, and photo editing. Create a professional portfolio while learning about visual narrative and documentary photography.",
    instructor: "Carlos Mendez",
    duration: "4 weeks",
    session: "Session 1",
    level: "Beginner",
    credits: 3,
    seats: 16,
    enrolled: 14,
    image: "https://images.unsplash.com/photo-1598389118600-9a83ceb4ebe6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBjbGFzc3Jvb20lMjBwYWludGluZ3xlbnwxfHx8fDE3NzE1MjUxMzd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    schedule: "Tue, Thu 1:00 PM - 4:00 PM",
    location: "Arts Center, Studio 1",
    college: "NYU"
  }
];
