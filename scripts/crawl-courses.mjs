#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const COURSE_LIMIT = Number(process.env.CRAWL_LIMIT ?? 30);
const PAGE_SIZE = Number(process.env.CRAWL_PAGE_SIZE ?? 100);
const OUTPUT_PATH = process.env.CRAWL_OUTPUT ?? "src/app/data/courses.generated.json";
const STATE_PATH = process.env.CRAWL_STATE ?? ".crawler-state.json";

function toSubject(domainTypes) {
  if (!Array.isArray(domainTypes) || domainTypes.length === 0) return "General";
  const domain = domainTypes[0]?.domainId ?? "";
  const map = {
    "computer-science": "Computer Science",
    "data-science": "Mathematics",
    "information-technology": "Computer Science",
    business: "Business",
    "arts-and-humanities": "Arts",
    health: "Science",
    "physical-science-and-engineering": "Science",
    social: "English",
  };

  return map[domain] ?? "General";
}

function toDuration(workload) {
  if (!workload || typeof workload !== "string") return "4 weeks";
  const hourMatch = workload.match(/(\d+)\s*hour/i);
  if (!hourMatch) return "4 weeks";
  const hours = Number(hourMatch[1]);
  const weeks = Math.max(1, Math.round(hours / 3));
  return `${weeks} weeks`;
}

function toCredits(workload) {
  const text = String(workload ?? "").toLowerCase();
  if (text.includes("minute")) return 2;
  const hourMatch = text.match(/(\d+)\s*hour/i);
  if (!hourMatch) return 3;
  const hours = Number(hourMatch[1]);
  if (hours >= 12) return 4;
  if (hours <= 2) return 2;
  return 3;
}

function buildApplyUrl(slug) {
  if (!slug) return "https://www.coursera.org/";
  return `https://www.coursera.org/learn/${slug}`;
}

function buildCoursesUrl(start) {
  return `https://api.coursera.org/api/courses.v1?start=${start}&limit=${PAGE_SIZE}&fields=description,partnerIds,workload,domainTypes,slug`;
}

function readPagingNextStart(payload, fallbackStart) {
  const nextRaw = payload?.paging?.next;
  const next = Number(nextRaw);
  return Number.isFinite(next) ? next : fallbackStart + PAGE_SIZE;
}

async function readJsonIfExists(filePath, fallbackValue) {
  try {
    const raw = await readFile(path.resolve(filePath), "utf8");
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

async function fetchJson(url) {
  const raw = execFileSync("curl", ["-sS", "--fail", "--connect-timeout", "20", url], {
    encoding: "utf8",
  });

  return JSON.parse(raw);
}

async function fetchPartners(ids) {
  if (ids.length === 0) return new Map();

  const chunks = [];
  const chunkSize = 50;
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  const partnerMap = new Map();

  for (const chunk of chunks) {
    const url = `https://api.coursera.org/api/partners.v1?ids=${chunk.join(",")}`;
    const data = await fetchJson(url);

    for (const partner of data.elements ?? []) {
      partnerMap.set(partner.id, partner.name ?? "Coursera Partner");
    }
  }

  return partnerMap;
}

function toCourse(course, partnerMap, now) {
  const partnerName = partnerMap.get(course.partnerIds?.[0]) ?? "Coursera Partner";
  const applyUrl = buildApplyUrl(course.slug);

  return {
    id: `coursera-${course.id}`,
    title: course.name,
    subject: toSubject(course.domainTypes),
    description: course.description ?? "Course description unavailable.",
    college: partnerName,
    location: "Online",
    deliveryMode: "online",
    session: "Rolling",
    duration: toDuration(course.workload),
    credits: toCredits(course.workload),
    tuition: 0,
    prerequisites: "None",
    applyUrl,
    sourceUrl: applyUrl,
    lastVerifiedAt: now,
  };
}

async function run() {
  const existingCourses = await readJsonIfExists(OUTPUT_PATH, []);
  const previousIds = new Set(Array.isArray(existingCourses) ? existingCourses.map((course) => course.id) : []);
  const state = await readJsonIfExists(STATE_PATH, { nextStart: 0 });

  let start = Number.isFinite(Number(state.nextStart)) ? Number(state.nextStart) : 0;
  let hasWrapped = false;
  let pageFetches = 0;
  const maxPageFetches = 25;
  const freshSourceCourses = [];
  const seenRunIds = new Set();

  while (freshSourceCourses.length < COURSE_LIMIT && pageFetches < maxPageFetches) {
    const payload = await fetchJson(buildCoursesUrl(start));
    const sourceCourses = payload.elements ?? [];
    pageFetches += 1;

    for (const course of sourceCourses) {
      const normalizedId = `coursera-${course.id}`;
      if (!previousIds.has(normalizedId) && !seenRunIds.has(normalizedId)) {
        freshSourceCourses.push(course);
        seenRunIds.add(normalizedId);
      }

      if (freshSourceCourses.length >= COURSE_LIMIT) break;
    }

    const nextStart = readPagingNextStart(payload, start);
    const pageExhausted = sourceCourses.length === 0;

    if (pageExhausted || nextStart <= start) {
      if (hasWrapped) break;
      hasWrapped = true;
      start = 0;
      continue;
    }

    start = nextStart;

    if (hasWrapped && start >= Number(state.nextStart ?? 0)) {
      break;
    }
  }

  const selectedSourceCourses = freshSourceCourses.length > 0
    ? freshSourceCourses.slice(0, COURSE_LIMIT)
    : (await fetchJson(buildCoursesUrl(0))).elements?.slice(0, COURSE_LIMIT) ?? [];

  const partnerIds = [...new Set(selectedSourceCourses.flatMap((course) => course.partnerIds ?? []))];
  const partnerMap = await fetchPartners(partnerIds);
  const now = new Date().toISOString();
  const courses = selectedSourceCourses.map((course) => toCourse(course, partnerMap, now));

  const outputAbsolute = path.resolve(OUTPUT_PATH);
  await mkdir(path.dirname(outputAbsolute), { recursive: true });
  await writeFile(outputAbsolute, `${JSON.stringify(courses, null, 2)}\n`, "utf8");

  const stateAbsolute = path.resolve(STATE_PATH);
  await writeFile(
    stateAbsolute,
    `${JSON.stringify({ nextStart: start, lastRunAt: now }, null, 2)}\n`,
    "utf8",
  );

  const freshnessLabel = freshSourceCourses.length > 0 ? "new-to-last-run" : "fallback";
  console.log(`Generated ${courses.length} ${freshnessLabel} courses at ${OUTPUT_PATH}`);
}

run().catch((error) => {
  console.error("Crawler failed:", error);
  process.exitCode = 1;
});
