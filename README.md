# Summer Courses Browser UI

This is a code bundle for Summer Courses Browser UI. The original project is available at https://www.figma.com/design/dzB27o99HelYjGapiJK4ke/Summer-Courses-Browser-UI.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Crawl post-processing (validation + enrichment)

Run `npm run postprocess:crawl` to validate, enrich, and deduplicate crawled course records.

By default this reads `data/crawl-results.json` and writes:

- `data/courses-enriched.json`
- `data/crawl-report.json`

The QA report includes aggregate counts (`fetched`, `accepted`, `rejected`, `deduped`) and per-source error rate details.
