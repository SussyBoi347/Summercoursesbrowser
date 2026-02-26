import fs from "node:fs/promises";
import path from "node:path";

const RAW_PATH = process.argv[2] ?? "data/crawl-results.json";
const OUTPUT_PATH = process.argv[3] ?? "data/courses-enriched.json";
const REPORT_PATH = process.argv[4] ?? "data/crawl-report.json";

const ONLINE_KEYWORDS = ["online", "virtual", "remote", "zoom", "distance learning"];

const requiredFields = ["title", "college", "applyUrl"];

const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
};

const normalizeWhitespace = (value) => value?.toString().trim().replace(/\s+/g, " ") ?? "";

const normalizeForSimilarity = (value) =>
  normalizeWhitespace(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) => new Set(normalizeForSimilarity(value).split(" ").filter(Boolean));

const jaccardSimilarity = (a, b) => {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);
  if (!aTokens.size && !bTokens.size) return 1;

  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) intersection += 1;
  }
  const union = new Set([...aTokens, ...bTokens]).size;
  return union === 0 ? 0 : intersection / union;
};

const levenshteinDistance = (a, b) => {
  const aStr = normalizeForSimilarity(a);
  const bStr = normalizeForSimilarity(b);
  if (aStr === bStr) return 0;

  const matrix = Array.from({ length: bStr.length + 1 }, (_, row) =>
    Array.from({ length: aStr.length + 1 }, (_, col) => (row === 0 ? col : col === 0 ? row : 0)),
  );

  for (let row = 1; row <= bStr.length; row += 1) {
    for (let col = 1; col <= aStr.length; col += 1) {
      const substitutionCost = aStr[col - 1] === bStr[row - 1] ? 0 : 1;
      matrix[row][col] = Math.min(
        matrix[row - 1][col] + 1,
        matrix[row][col - 1] + 1,
        matrix[row - 1][col - 1] + substitutionCost,
      );
    }
  }

  return matrix[bStr.length][aStr.length];
};

const normalizedEditSimilarity = (a, b) => {
  const left = normalizeForSimilarity(a);
  const right = normalizeForSimilarity(b);
  const maxLength = Math.max(left.length, right.length);
  if (maxLength === 0) return 1;
  return 1 - levenshteinDistance(left, right) / maxLength;
};

const parseTuitionCost = (record) => {
  const tuitionSource = record.tuition ?? record.cost ?? record.price ?? null;

  if (typeof tuitionSource === "number" && Number.isFinite(tuitionSource)) {
    return tuitionSource;
  }

  if (typeof tuitionSource !== "string") {
    return null;
  }

  const amountMatch = tuitionSource.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  if (!amountMatch) return null;

  const parsed = Number.parseFloat(amountMatch[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const inferDeliveryMode = (record) => {
  if (normalizeWhitespace(record.deliveryMode)) {
    return record.deliveryMode;
  }

  const location = normalizeForSimilarity(record.location);
  if (!location) return null;
  if (location.includes("hybrid")) {
    return "Hybrid";
  }
  if (ONLINE_KEYWORDS.some((keyword) => location.includes(keyword))) {
    return "Online";
  }
  if (location.includes("on campus") || location.includes("campus") || location.includes("room") || location.includes("building")) {
    return "In Person";
  }

  return null;
};

const hasScheduleMetadata = (record) => {
  return Boolean(
    normalizeWhitespace(record.schedule) ||
      normalizeWhitespace(record.session) ||
      normalizeWhitespace(record.startDate) ||
      normalizeWhitespace(record.endDate),
  );
};

const validateRecord = (record) => {
  const missing = requiredFields.filter((field) => !normalizeWhitespace(record[field]));
  if (!hasScheduleMetadata(record)) {
    missing.push("schedule/session metadata");
  }
  return missing;
};

const isLikelyDuplicate = (left, right) => {
  const titleTokenSimilarity = jaccardSimilarity(left.title, right.title);
  const titleEditSimilarity = normalizedEditSimilarity(left.title, right.title);
  const collegeSimilarity = normalizedEditSimilarity(left.college, right.college);

  return (titleTokenSimilarity >= 0.6 || titleEditSimilarity >= 0.88) && collegeSimilarity >= 0.88;
};

const ensureDir = async (filePath) => {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
};

const run = async () => {
  const payload = await readJson(RAW_PATH);
  const fetchedRecords = Array.isArray(payload.records) ? payload.records : [];
  const crawlErrors = Array.isArray(payload.errors) ? payload.errors : [];

  const sourceStats = new Map();
  const rejected = [];
  const accepted = [];
  let dedupedCount = 0;

  const ensureSource = (sourceName) => {
    const source = sourceName || "unknown";
    if (!sourceStats.has(source)) {
      sourceStats.set(source, { fetched: 0, rejected: 0, errors: 0, deduped: 0, accepted: 0 });
    }
    return source;
  };

  for (const error of crawlErrors) {
    const source = ensureSource(error.source);
    sourceStats.get(source).errors += 1;
  }

  for (const record of fetchedRecords) {
    const source = ensureSource(record.source);
    sourceStats.get(source).fetched += 1;

    const missingFields = validateRecord(record);
    if (missingFields.length > 0) {
      sourceStats.get(source).rejected += 1;
      rejected.push({
        source,
        title: record.title ?? null,
        reason: `Missing required field(s): ${missingFields.join(", ")}`,
      });
      continue;
    }

    const enriched = {
      ...record,
      tuitionAmount: parseTuitionCost(record),
      deliveryMode: inferDeliveryMode(record),
    };

    const duplicateIndex = accepted.findIndex((existing) => isLikelyDuplicate(existing, enriched));
    if (duplicateIndex >= 0) {
      dedupedCount += 1;
      sourceStats.get(source).deduped += 1;
      continue;
    }

    sourceStats.get(source).accepted += 1;
    accepted.push(enriched);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    counts: {
      fetched: fetchedRecords.length,
      accepted: accepted.length,
      rejected: rejected.length,
      deduped: dedupedCount,
    },
    sourceErrorRates: Object.fromEntries(
      [...sourceStats.entries()].map(([source, stats]) => {
        const denominator = stats.fetched + stats.errors;
        const errorRate = denominator === 0 ? 0 : (stats.rejected + stats.errors) / denominator;
        return [
          source,
          {
            fetched: stats.fetched,
            accepted: stats.accepted,
            rejected: stats.rejected,
            deduped: stats.deduped,
            errors: stats.errors,
            errorRate,
          },
        ];
      }),
    ),
    rejectionSamples: rejected.slice(0, 25),
  };

  await ensureDir(OUTPUT_PATH);
  await ensureDir(REPORT_PATH);
  await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(accepted, null, 2)}\n`, "utf8");
  await fs.writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`Processed ${fetchedRecords.length} records.`);
  console.log(`Accepted: ${accepted.length}, Rejected: ${rejected.length}, Deduped: ${dedupedCount}`);
  console.log(`Report written to ${REPORT_PATH}`);
};

run().catch((error) => {
  console.error("Failed to post-process crawl output", error);
  process.exitCode = 1;
});
