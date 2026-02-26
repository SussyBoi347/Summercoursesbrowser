import { z } from "zod";

export const courseSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().min(1),
    subject: z.string().min(1),
    description: z.string().min(1),
    college: z.string().min(1),
    location: z.string().min(1),
    deliveryMode: z.enum(["online", "in-person", "hybrid"]),
    session: z.string().min(1),
    duration: z.string().min(1),
    credits: z.number().nonnegative(),
    tuition: z.number().nonnegative(),
    prerequisites: z.string(),
    applyUrl: z.string().url(),
    sourceUrl: z.string().url(),
    lastVerifiedAt: z.string().datetime(),
  })
  .strict();

export const courseListSchema = z.array(courseSchema);

export type Course = z.infer<typeof courseSchema>;
