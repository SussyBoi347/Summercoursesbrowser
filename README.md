# Summer Courses Browser UI

This is a code bundle for Summer Courses Browser UI. The original project is available at https://www.figma.com/design/dzB27o99HelYjGapiJK4ke/Summer-Courses-Browser-UI.

## Running the app

- `npm i`
- `npm run dev`

## Crawling real course data

This repo now includes a crawler that pulls live course catalog records from Coursera's public API and converts them into this app's schema.

- Run crawler: `npm run crawl:courses`
- Output file: `src/app/data/courses.generated.json`
- Optional env vars:
  - `CRAWL_LIMIT` (default: `30`)
  - `CRAWL_OUTPUT` (default: `src/app/data/courses.generated.json`)

If the generated file is valid and non-empty, the app will use it automatically. Otherwise, it falls back to the local seed dataset.
