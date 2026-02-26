from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Iterable, Protocol


@dataclass(slots=True)
class CrawlResult:
    """Raw course payload returned from a source adapter."""

    source: str
    records: list[dict[str, Any]]


class SourceAdapter(Protocol):
    """Contract each source adapter should satisfy."""

    name: str
    domain: str

    def crawl(self) -> CrawlResult:
        ...


def as_list(items: Iterable[dict[str, Any]]) -> list[dict[str, Any]]:
    return [item for item in items]
