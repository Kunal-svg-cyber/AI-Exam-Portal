import { GeneratorInput } from "@/lib/schemas";

export class PromptBuilder {
  /**
   * Generates the system prompt instructing Grok on persona, format constraints, and pedagogy.
   */
  static buildSystemPrompt(language: string, bloomTaxonomy: string): string {
    return [
      this.getPersonaInstructions(),
      this.getJsonFormatSchema(language),
      this.getBloomTaxonomyGuidelines(bloomTaxonomy),
      this.getPedagogicalRules()
    ].join("\n\n");
  }

  /**
   * Generates the user prompt detailing the specific assessment requests.
   */
  static buildUserPrompt(params: GeneratorInput): string {
    const { subject, topic, difficulty, bloomTaxonomy, language, educationalLevel, questionType, questionCount, additionalInstructions } = params;
    
    const promptSections = [
      `Generate a high-quality educational assessment with the following specifications:`,
      `- Subject Domain: ${subject}`,
      `- Topic Focus: ${topic}`,
      `- Difficulty Grading: ${difficulty}`,
      `- Cognitive Depth (Bloom Level): ${bloomTaxonomy}`,
      `- Assessment Language: ${language}`,
      `- Target Educational Level: ${educationalLevel}`,
      `- Question count requested: ${questionCount}`,
      this.getQuestionTypeFormattingInstructions(questionType)
    ];

    if (additionalInstructions && additionalInstructions.trim().length > 0) {
      promptSections.push(`- Additional Special Instructions: "${additionalInstructions.trim()}"`);
    }

    return promptSections.join("\n");
  }

  /**
   * Base AI Persona and mission alignment guidelines.
   */
  private static getPersonaInstructions(): string {
    return `You are an elite educational AI assessment designer. Your goal is to support SDG 4 (Quality Education) by generating accurate, high-quality, pedagogically sound assessments.
You must respond with a single, valid JSON object containing the assessment. DO NOT wrap the response in markdown code blocks (like \`\`\`json ... \`\`\`). Do not include any plain text explanation, preface, or suffix. Return JSON only. If you cannot comply, you must regenerate the response internally until the output matches the required schema.`;
  }

  /**
   * Strictly enforces the structural JSON schema expected by the parser.
   */
  private static getJsonFormatSchema(language: string): string {
    return `All text content (title, subject, topic, difficulty, language, question, options, explanation, bloomLevel, estimatedTime) MUST be written in the requested language: ${language}.

Expected JSON Schema:
{
  "title": "A relevant, professional title for the assessment",
  "subject": "The general subject of the assessment",
  "topic": "The specific topic focus",
  "difficulty": "The difficulty level",
  "language": "The output language",
  "questions": [
    {
      "id": 1,
      "type": "mcq",
      "question": "string (the actual question prompt. For fill-in-the-blank, use a blank placeholder '____' somewhere inside the sentence)",
      "options": ["string (options list. For 'true-false', options MUST be exactly ['True', 'False'])"],
      "correctAnswer": 0,
      "explanation": "string (detailed pedagogical explanation of why this answer is correct and why other choices are incorrect, assisting student learning)",
      "bloomLevel": "The bloom cognitive taxonomy level for this question",
      "estimatedTime": "Estimated time to solve (e.g., '1.5 minutes', '2 minutes')"
    }
  ]
}`;
  }

  /**
   * Dynamically appends instructions tailored to specific question formats.
   */
  private static getQuestionTypeFormattingInstructions(questionType: string): string {
    switch (questionType) {
      case "multiple-choice":
        return `- Format constraints: Generate ONLY Multiple Choice Questions. Each question's type field must be "mcq". Each question must contain exactly 4 options. The correctAnswer field MUST be the 0-indexed number of the correct option (e.g. 0 for A, 1 for B, 2 for C, 3 for D).`;
      case "true-false":
        return `- Format constraints: Generate ONLY True/False Questions. Each question's type field must be "true-false". The options must be exactly ["True", "False"]. The correctAnswer field MUST be the 0-indexed number (0 for True, 1 for False).`;
      case "short-answer":
        return `- Format constraints: Generate ONLY Short Answer Questions. Each question's type field must be "short-answer". Set the options field to an empty array []. The correctAnswer field MUST be a string representing a concise model response containing key keywords.`;
      case "fill-in-the-blank":
        return `- Format constraints: Generate ONLY Fill-in-the-Blank Questions. Each question's type field must be "fill-in-the-blank". Set the options field to an empty array []. The question field MUST contain a single blank space placeholder '____'. The correctAnswer field MUST be a string representing the exact word that fits the blank.`;
      case "mixed":
      default:
        return `- Format constraints: Generate a balanced mix of "mcq", "true-false", "short-answer", and "fill-in-the-blank" formats. Apply the corresponding schemas and rules (index numbers vs strings in correctAnswer, and options list constraints) for each type.`;
    }
  }

  /**
   * Educational Bloom's Taxonomy cognitive rules.
   */
  private static getBloomTaxonomyGuidelines(bloomTaxonomy: string): string {
    const defaultGuidelines = `Align the assessment questions with Bloom's Taxonomy cognitive tier: ${bloomTaxonomy}.`;
    
    switch (bloomTaxonomy.toLowerCase()) {
      case "remembering":
        return `${defaultGuidelines} Focus on retrieving, recognizing, and recalling relevant knowledge from long-term memory (e.g., key dates, terms, basic formulas).`;
      case "understanding":
        return `${defaultGuidelines} Focus on constructing meaning from oral, written, and graphic messages through interpreting, exemplifying, classifying, summarizing, and explaining.`;
      case "applying":
        return `${defaultGuidelines} Focus on carrying out or using a procedure in a given situation (e.g., executing a calculation, applying a rule or programming syntax).`;
      case "analyzing":
        return `${defaultGuidelines} Focus on breaking material into constituent parts, determining how the parts relate to one another and to an overall structure or purpose (e.g., parsing arguments, finding logic bugs).`;
      case "evaluating":
        return `${defaultGuidelines} Focus on making judgments based on criteria and standards through checking and critiquing (e.g., reviewing system performance, identifying ethical concerns).`;
      case "creating":
        return `${defaultGuidelines} Focus on putting elements together to form a coherent or functional whole; reorganizing elements into a new pattern or structure (e.g., designing a model, writing a program code from scratch).`;
      case "mixed":
      default:
        return `Generate questions spanning across various Bloom's Taxonomy tiers (Remembering up to Creating) to provide a comprehensive evaluation of cognitive depth.`;
    }
  }

  /**
   * Pedagogical rules aligned with SDG 4 (Quality Education).
   */
  private static getPedagogicalRules(): string {
    return `Educational Rules & Pedagogy:
- Distractor items (incorrect MCQ options) must be highly plausible, representing common conceptual misunderstandings.
- The 'explanation' must explain WHY the correct answer is correct and WHY other options are incorrect, supporting learning.
- Avoid duplicate questions or redundant prompts.
- Ensure correct and precise spelling, grammatical parameters, and factual validation.`;
  }
}
