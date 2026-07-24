import { z } from "zod";

export const apiKeySchema = z.object({
  apiKey: z
    .string()
    .min(1, "API Key is required")
    .regex(/^gsk_[a-zA-Z0-9]+$/, {
      message: "Invalid key format. Groq API keys typically start with 'gsk_' followed by alphanumeric characters.",
    }),
});

export const generatorSchema = z.object({
  subject: z
    .string()
    .min(2, "Subject must be at least 2 characters")
    .max(100, "Subject must be under 100 characters"),
  topic: z
    .string()
    .min(3, "Topic must be at least 3 characters")
    .max(500, "Topic must be under 500 characters"),
  questionType: z.enum([
    "multiple-choice",
    "true-false",
    "short-answer",
    "fill-in-the-blank",
    "mixed"
  ]),
  difficulty: z.enum(["Easy", "Medium", "Hard", "Expert"]),
  bloomTaxonomy: z.enum([
    "Remembering",
    "Understanding",
    "Applying",
    "Analyzing",
    "Evaluating",
    "Creating",
    "Mixed"
  ]),
  language: z.enum([
    "English",
    "Spanish",
    "French",
    "German",
    "Hindi",
    "Arabic",
    "Portuguese",
    "Chinese"
  ]),
  questionCount: z.coerce.number().min(1).max(20).default(5),
  educationalLevel: z.enum([
    "Primary School",
    "Middle School",
    "High School",
    "University",
    "Professional/Adult Education"
  ]),
  additionalInstructions: z.string().max(1000, "Instructions must be under 1000 characters").optional(),
});

export type ApiKeyInput = z.infer<typeof apiKeySchema>;
export type GeneratorInput = z.infer<typeof generatorSchema>;
