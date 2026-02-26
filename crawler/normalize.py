from __future__ import annotations

import re
from typing import Any

CANONICAL_REQUIRED_FIELDS = [
    "id",
    "title",
    "subject",
    "description",
    "instructor",
    "duration",
    "session",
    "level",
    "credits",
    "seats",
    "enrolled",
    "image",
    "schedule",
    "location",
    "college",
]


def _pick(record: dict[str, Any], *keys: str, default: Any = "") -> Any:
    for key in keys:
        if key in record and record[key] not in (None, ""):
            return record[key]
    return default


def normalize_title(value: str) -> str:
    return re.sub(r"\s+", " ", value.strip().lower())


def normalize_record(raw: dict[str, Any], record_id: str) -> dict[str, Any]:
    title = str(_pick(raw, "title", "course_name", "headline"))
    duration = _pick(raw, "duration", "duration_text", default="")
    if not duration:
        weeks = _pick(raw, "length_weeks", default=0)
        duration = f"{weeks} weeks" if weeks else "TBD"

    normalized: dict[str, Any] = {
        "id": record_id,
        "title": title,
        "subject": str(_pick(raw, "subject", "subject_area", "discipline", default="General")),
        "description": str(_pick(raw, "description", "summary", "body", default="Description pending")),
        "instructor": str(_pick(raw, "instructor", "teacher", "faculty", default="Staff")),
        "duration": str(duration),
        "session": str(_pick(raw, "session", "session_label", "term", default="Session 1")),
        "level": str(_pick(raw, "level", "difficulty", "track_level", default="Beginner")),
        "credits": int(_pick(raw, "credits", "credit_hours", default=0)),
        "seats": int(_pick(raw, "seats", "seat_capacity", "capacity", default=0)),
        "enrolled": int(_pick(raw, "enrolled", "seats_taken", default=0)),
        "image": str(_pick(raw, "image", "image_url", "hero_image", default="https://images.unsplash.com/photo-1451187580459-43490279c0fa?fit=max&fm=jpg&q=80&w=1080")),
        "schedule": str(_pick(raw, "schedule", "meeting_pattern", "schedule_text", default="TBD")),
        "location": str(_pick(raw, "location", "venue", "room", default="TBD")),
        "college": str(_pick(raw, "college", "institution", "school", default="Unknown")),
    }

    prerequisites = _pick(raw, "prerequisites", "prereq", default="")
    if prerequisites:
        normalized["prerequisites"] = str(prerequisites)

    popular = _pick(raw, "popular", "is_popular", default=None)
    if popular is not None:
        normalized["popular"] = bool(popular)

    return normalized


def dedupe_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str, str]] = set()
    unique: list[dict[str, Any]] = []

    for record in records:
        source_url = str(_pick(record, "source_url", "sourceUrl", default=""))
        title = str(_pick(record, "title", "course_name", "headline", default=""))
        session = str(_pick(record, "session", "session_label", "term", default="Session 1"))
        dedupe_key = (source_url, normalize_title(title), session)

        if dedupe_key in seen:
            continue
        seen.add(dedupe_key)
        unique.append(record)

    return unique
