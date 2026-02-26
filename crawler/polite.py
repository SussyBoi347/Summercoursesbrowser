from __future__ import annotations

import json
import random
import time
from dataclasses import dataclass
from typing import Any
from urllib import robotparser
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

DEFAULT_USER_AGENT = "SummerCoursesCrawler/1.0 (+https://example.org/crawler-info)"


@dataclass(slots=True)
class PoliteSettings:
    user_agent: str = DEFAULT_USER_AGENT
    min_delay_seconds: float = 1.0
    max_delay_seconds: float = 2.0
    retries: int = 3
    backoff_base_seconds: float = 1.0
    timeout_seconds: int = 20


class PoliteHttpClient:
    """Small HTTP client with robots checks, rate limit, and retry/backoff."""

    def __init__(self, settings: PoliteSettings | None = None) -> None:
        self.settings = settings or PoliteSettings()
        self._robots_cache: dict[str, robotparser.RobotFileParser] = {}

    def _robots_parser_for(self, url: str) -> robotparser.RobotFileParser:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            raise ValueError(f"Invalid URL for robots lookup: {url}")

        base = f"{parsed.scheme}://{parsed.netloc}"
        if base not in self._robots_cache:
            robots_url = f"{base}/robots.txt"
            parser = robotparser.RobotFileParser()
            parser.set_url(robots_url)
            try:
                parser.read()
            except Exception:
                # Fail-open so temporary robots fetch errors do not block everything.
                parser = robotparser.RobotFileParser()
                parser.parse(["User-agent: *", "Allow: /"])
            self._robots_cache[base] = parser
        return self._robots_cache[base]

    def can_fetch(self, url: str) -> bool:
        parser = self._robots_parser_for(url)
        return parser.can_fetch(self.settings.user_agent, url)

    def _wait_rate_limit(self) -> None:
        delay = random.uniform(self.settings.min_delay_seconds, self.settings.max_delay_seconds)
        time.sleep(delay)

    def get_text(self, url: str) -> str:
        return self._request(url=url, parser="text")

    def get_json(self, url: str) -> Any:
        raw = self._request(url=url, parser="text")
        return json.loads(raw)

    def _request(self, *, url: str, parser: str) -> Any:
        if not self.can_fetch(url):
            raise PermissionError(f"Blocked by robots.txt: {url}")

        last_error: Exception | None = None
        for attempt in range(1, self.settings.retries + 1):
            try:
                self._wait_rate_limit()
                request = Request(url, headers={"User-Agent": self.settings.user_agent})
                with urlopen(request, timeout=self.settings.timeout_seconds) as response:
                    payload = response.read()
                if parser == "text":
                    return payload.decode("utf-8", errors="replace")
                return payload
            except (HTTPError, URLError, TimeoutError, ConnectionError, OSError) as err:
                last_error = err
                backoff = self.settings.backoff_base_seconds * (2 ** (attempt - 1))
                time.sleep(backoff)

        assert last_error is not None
        raise RuntimeError(f"Failed to fetch {url} after {self.settings.retries} attempts") from last_error
