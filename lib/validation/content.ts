import { z } from "zod";

export const contentSchema = z.object({
  title: z.string().trim().min(1, { error: "Add a title." }).max(200),
  genre: z.string().trim().min(1, { error: "Add a genre." }).max(80),
  saveAs: z.enum(["draft", "published"], {
    error: "Save the piece as a draft or published work.",
  }),
  writings: z
    .string()
    .trim()
    .min(1, { error: "Write something before saving." })
    .max(100_000),
});
