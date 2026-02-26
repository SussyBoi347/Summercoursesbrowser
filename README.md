# Summer Courses Browser UI

This is a code bundle for Summer Courses Browser UI. The original project is available at https://www.figma.com/design/dzB27o99HelYjGapiJK4ke/Summer-Courses-Browser-UI.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Crawler service

A Python crawler service now lives under `crawler/` with:

- `crawler/sources/<domain>.py` source adapters (currently `stanford_edu.py` and `yale_edu.py`)
- `crawler/normalize.py` to map source-specific payloads into the canonical course schema used by the app
- `crawler/run.py` entrypoint to execute selected sources and write JSON output

### Run the crawler

```bash
python -m crawler.run
```

Optional source selection:

```bash
python -m crawler.run --sources stanford_edu
```

Generated output is written to:

- `data/courses.generated.json`
