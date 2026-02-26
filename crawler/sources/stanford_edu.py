from __future__ import annotations

from crawler.sources.base import CrawlResult


class StanfordEduSource:
    name = "stanford_edu"
    domain = "summer.stanford.edu"

    def crawl(self) -> CrawlResult:
        # Adapter output is intentionally raw and source-specific.
        records = [
            {
                "source_url": "https://summer.stanford.edu/courses/cs101",
                "course_name": "Introduction to Computer Science",
                "subject_area": "Computer Science",
                "summary": "Learn the fundamentals of programming with Python.",
                "teacher": "Dr. Sarah Chen",
                "length_weeks": 6,
                "session_label": "Session 1",
                "difficulty": "Beginner",
                "credit_hours": 3,
                "seat_capacity": 25,
                "seats_taken": 18,
                "image_url": "https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                "meeting_pattern": "Mon, Wed, Fri 9:00 AM - 12:00 PM",
                "venue": "Building A, Room 201",
                "institution": "Stanford University",
                "is_popular": True,
            },
            {
                "source_url": "https://summer.stanford.edu/courses/web-bootcamp",
                "course_name": "Web Development Bootcamp",
                "subject_area": "Computer Science",
                "summary": "Build modern websites using HTML, CSS, JavaScript, and React.",
                "teacher": "Alex Johnson",
                "length_weeks": 6,
                "session_label": "Session 1",
                "difficulty": "Intermediate",
                "credit_hours": 4,
                "seat_capacity": 22,
                "seats_taken": 20,
                "image_url": "https://images.unsplash.com/photo-1563630482997-07d8d7fbc9df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                "prereq": "Introduction to Computer Science or basic programming knowledge",
                "meeting_pattern": "Tue, Thu 1:00 PM - 4:00 PM",
                "venue": "Building A, Room 203",
                "institution": "Carnegie Mellon University",
                "is_popular": True,
            },
        ]
        return CrawlResult(source=self.name, records=records)
