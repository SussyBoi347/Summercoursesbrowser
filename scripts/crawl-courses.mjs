#!/usr/bin/env node
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const COURSE_LIMIT = Number(process.env.CRAWL_LIMIT ?? 30);
const OUTPUT_PATH = process.env.CRAWL_OUTPUT ?? "src/app/data/courses.generated.json";
const COURSES_ENDPOINT = `https://api.coursera.org/api/courses.v1?limit=${COURSE_LIMIT}&fields=description,partnerIds,workload,domainTypes,slug`;

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

async function run() {
  const coursesPayload = await fetchJson(COURSES_ENDPOINT);
  const sourceCourses = coursesPayload.elements ?? [];

  const partnerIds = [...new Set(sourceCourses.flatMap((course) => course.partnerIds ?? []))];
  const partnerMap = await fetchPartners(partnerIds);
  const now = new Date().toISOString();

  const courses = sourceCourses.map((course) => {
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
  });

  const outputAbsolute = path.resolve(OUTPUT_PATH);
  await mkdir(path.dirname(outputAbsolute), { recursive: true });
  await writeFile(outputAbsolute, `${JSON.stringify(courses, null, 2)}\n`, "utf8");

  console.log(`Generated ${courses.length} courses at ${OUTPUT_PATH}`);
}

run().catch((error) => {
  console.error("Crawler failed:", error);
  process.exitCode = 1;
});
