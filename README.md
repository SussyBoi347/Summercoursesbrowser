# Summer Courses Browser UI

This is a code bundle for Summer Courses Browser UI. The original project is available at https://www.figma.com/design/dzB27o99HelYjGapiJK4ke/Summer-Courses-Browser-UI.

## Running the app

- `npm i`
- `npm run dev`

## Crawling real course data

This repo includes a college-focused crawler for high-school summer course discovery.
It uses local source adapters (currently Stanford + Yale sample adapters) via `crawler/run.py`,
then maps those records into the app schema.

- Run crawler: `npm run crawl:courses`
- Output file: `src/app/data/courses.generated.json`
- Optional env vars:
  - `CRAWL_LIMIT` (default: `30`)
  - `CRAWL_OUTPUT` (default: `src/app/data/courses.generated.json`)
  - `CRAWL_RAW_OUTPUT` (default: `.tmp/crawler-raw.json`)
  - `CRAWL_PYTHON_BIN` (default: `python3`)

The generated file is validated by the app schema at runtime; if invalid/empty,
the app falls back to the local seed dataset.
