# Summer Courses Browser UI

This is a code bundle for Summer Courses Browser UI. The original project is available at https://www.figma.com/design/dzB27o99HelYjGapiJK4ke/Summer-Courses-Browser-UI.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Dependency audit checklist (monthly / before release)

Use this checklist to keep dependency creep under control:

- [ ] Trace imports from `src/` and config files to identify packages that are no longer referenced.
  - Suggested command: `rg -n "from ['\"][^./]" src vite.config.ts`
- [ ] Compare traced imports against `dependencies` in `package.json`.
- [ ] Remove unused packages in small batches: `npm uninstall <pkg...>`.
- [ ] After **each** removal batch, validate the app still builds: `npm run build`.
- [ ] Commit `package.json` and lockfile updates together.
- [ ] Run `npm audit` and triage findings before release.
