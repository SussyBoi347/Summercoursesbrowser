from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable

from crawler.normalize import dedupe_records, normalize_record
from crawler.polite import PoliteHttpClient, PoliteSettings
from crawler.sources import get_sources

DEFAULT_OUTPUT = Path("data/courses.generated.json")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run course crawler adapters and emit canonical JSON.")
    parser.add_argument(
        "--sources",
        nargs="*",
        help="Optional list of source adapter names (e.g. stanford_edu yale_edu). Defaults to all.",
    )
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT, help="Output JSON file path.")
    parser.add_argument("--min-delay", type=float, default=1.0, help="Minimum per-request delay in seconds.")
    parser.add_argument("--max-delay", type=float, default=2.0, help="Maximum per-request delay in seconds.")
    parser.add_argument("--retries", type=int, default=3, help="Number of retries for network requests.")
    parser.add_argument("--backoff", type=float, default=1.0, help="Exponential backoff base seconds.")
    parser.add_argument(
        "--user-agent",
        default="SummerCoursesCrawler/1.0 (+https://example.org/crawler-info)",
        help="Crawler user-agent header.",
    )
    return parser.parse_args()


def select_sources(available: dict[str, object], selected: Iterable[str] | None) -> list[object]:
    if not selected:
        return list(available.values())

    missing = [name for name in selected if name not in available]
    if missing:
        raise ValueError(f"Unknown source adapter(s): {', '.join(missing)}")
    return [available[name] for name in selected]


def main() -> None:
    args = parse_args()

    settings = PoliteSettings(
        user_agent=args.user_agent,
        min_delay_seconds=args.min_delay,
        max_delay_seconds=args.max_delay,
        retries=args.retries,
        backoff_base_seconds=args.backoff,
    )
    polite_client = PoliteHttpClient(settings=settings)

    source_registry = get_sources()
    adapters = select_sources(source_registry, args.sources)

    raw_records: list[dict[str, object]] = []
    for adapter in adapters:
        robots_probe_url = f"https://{adapter.domain}/"
        if not polite_client.can_fetch(robots_probe_url):
            print(f"Skipping {adapter.name}: robots.txt disallows {robots_probe_url}")
            continue

        result = adapter.crawl()
        raw_records.extend(result.records)
        print(f"Collected {len(result.records)} records from {adapter.name}")

    unique_raw = dedupe_records(raw_records)
    normalized = [normalize_record(raw, str(index + 1)) for index, raw in enumerate(unique_raw)]

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(normalized, indent=2), encoding="utf-8")

    print(f"Wrote {len(normalized)} normalized records to {args.output}")


if __name__ == "__main__":
    main()
