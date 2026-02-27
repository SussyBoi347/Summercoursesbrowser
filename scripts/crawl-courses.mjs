#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const OUTPUT_PATH = process.env.CRAWL_OUTPUT ?? "src/app/data/courses.generated.json";
const RAW_OUTPUT_PATH = process.env.CRAWL_RAW_OUTPUT ?? ".tmp/crawler-raw.json";
const COURSE_LIMIT = Number(process.env.CRAWL_LIMIT ?? 30);
const PYTHON_BIN = process.env.CRAWL_PYTHON_BIN ?? "python3";

const normalizeWhitespace = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const slugify = (value) =>
  normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

const inferDeliveryMode = (location) => {
  const text = normalizeWhitespace(location).toLowerCase();
  if (!text) return "in-person";
  if (text.includes("hybrid")) return "hybrid";
  if (text.includes("online") || text.includes("remote") || text.includes("virtual")) return "online";
  return "in-person";
};

const mapCourse = (record, index, lastVerifiedAt) => {
  const title = normalizeWhitespace(record.title) || `College Summer Course ${index + 1}`;
  const college = normalizeWhitespace(record.college) || "College Program";
  const sourceUrl = normalizeWhitespace(record.sourceUrl) || normalizeWhitespace(record.source_url);
  const location = normalizeWhitespace(record.location) || "On campus";

  return {
    id: `${slugify(college)}-${slugify(title) || index + 1}`,
    title,
    subject: normalizeWhitespace(record.subject) || "General",
    description: normalizeWhitespace(record.description) || "Official high-school summer course details available at provider link.",
    college,
    location,
    deliveryMode: inferDeliveryMode(location),
    session: normalizeWhitespace(record.session) || "Summer",
    duration: normalizeWhitespace(record.duration) || "TBD",
    credits: Math.max(0, Number(record.credits) || 0),
    tuition: 0,
    prerequisites: normalizeWhitespace(record.prerequisites) || "See provider details",
    applyUrl: sourceUrl || "https://www.summerschools.com/",
    sourceUrl: sourceUrl || "https://www.summerschools.com/",
    lastVerifiedAt,
  };
};

async function readJson(filePath) {
  const raw = await readFile(path.resolve(filePath), "utf8");
  return JSON.parse(raw);
}

async function run() {
  const rawOutputAbsolute = path.resolve(RAW_OUTPUT_PATH);
  await mkdir(path.dirname(rawOutputAbsolute), { recursive: true });

  execFileSync(PYTHON_BIN, ["-m", "crawler.run", "--output", rawOutputAbsolute], {
    cwd: process.cwd(),
    stdio: "inherit",
  });

  const rawPayload = await readJson(rawOutputAbsolute);
  const rawCourses = Array.isArray(rawPayload) ? rawPayload : [];
  const lastVerifiedAt = new Date().toISOString();

  const mapped = rawCourses.map((course, index) => mapCourse(course, index, lastVerifiedAt));

  const deduped = [];
  const seen = new Set();
  for (const course of mapped) {
    const key = `${course.title.toLowerCase()}::${course.college.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(course);
  }

  const limited = deduped.slice(0, Math.max(1, COURSE_LIMIT));

  const outputAbsolute = path.resolve(OUTPUT_PATH);
  await mkdir(path.dirname(outputAbsolute), { recursive: true });
  await writeFile(outputAbsolute, `${JSON.stringify(limited, null, 2)}\n`, "utf8");

  await rm(rawOutputAbsolute, { force: true });

  console.log(`Generated ${limited.length} college summer courses at ${OUTPUT_PATH}`);
}

run().catch((error) => {
  console.error("Crawler failed:", error);
  process.exitCode = 1;
});
