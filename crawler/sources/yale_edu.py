from __future__ import annotations

from crawler.sources.base import CrawlResult


class YaleEduSource:
    name = "yale_edu"
    domain = "summer.yale.edu"

    def crawl(self) -> CrawlResult:
        records = [
            {
                "source_url": "https://summer.yale.edu/programs/creative-writing-workshop",
                "headline": "Creative Writing Workshop",
                "discipline": "English",
                "body": "Develop your voice through fiction, poetry, and creative nonfiction.",
                "faculty": "Emma Thompson",
                "duration_text": "6 weeks",
                "term": "Session 1",
                "track_level": "Intermediate",
                "credits": 3,
                "capacity": 15,
                "enrolled": 12,
                "hero_image": "https://images.unsplash.com/photo-1535058489223-1331b20fa114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                "schedule_text": "Mon, Wed 2:00 PM - 4:00 PM",
                "room": "Humanities Hall, Room 102",
                "school": "Yale University",
                "popular": True,
            },
            {
                "source_url": "https://summer.yale.edu/programs/american-literature-contemporary-voices",
                "headline": "American Literature: Contemporary Voices",
                "discipline": "English",
                "body": "Explore contemporary American literature from diverse perspectives.",
                "faculty": "Prof. Marcus Brown",
                "duration_text": "4 weeks",
                "term": "Session 1",
                "track_level": "Intermediate",
                "credits": 3,
                "capacity": 20,
                "enrolled": 17,
                "hero_image": "https://images.unsplash.com/photo-1535058489223-1331b20fa114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
                "schedule_text": "Tue, Thu 10:00 AM - 12:30 PM",
                "room": "Humanities Hall, Room 105",
                "school": "Yale University",
            },
        ]
        return CrawlResult(source=self.name, records=records)
