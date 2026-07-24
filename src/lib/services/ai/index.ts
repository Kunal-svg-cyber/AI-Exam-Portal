import { GeneratorInput } from "@/lib/schemas";
import { Assessment } from "@/lib/types";
import { PromptBuilder } from "./prompt-builder";
import { ApiClient } from "./api-client";
import { ErrorHandler } from "./error-handler";
import { ResponseParser } from "./response-parser";
import { JsonParser } from "./json-parser";
import { Validator } from "./validator";

export class AiService {
  /**
   * Generates a high-quality educational assessment from Grok AI.
   * Wires prompt builders, clients, parsers, and validators.
   */
  static async generateAssessment(
    apiKey: string,
    params: GeneratorInput
  ): Promise<Assessment> {
    
    // 1. Build prompts
    const systemPrompt = PromptBuilder.buildSystemPrompt(params.language, params.bloomTaxonomy);
    const userPrompt = PromptBuilder.buildUserPrompt(params);

    // 2. Call API Client
    const response = await ApiClient.postChatCompletion(apiKey, {
      model: "grok-2-1212",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    // 3. Handle HTTP errors
    if (!response.ok) {
      await ErrorHandler.handleApiError(response);
    }

    // 4. Extract completion content string
    const rawContent = await ResponseParser.extractContent(response);

    // 5. Parse cleaned JSON content
    const parsedData = JsonParser.parseCleanedJson(rawContent);

    // 6. Validate and normalize schemas
    const validatedAssessment = Validator.validateAndNormalize(parsedData, params);

    return validatedAssessment;
  }
}
export { PromptBuilder, ApiClient, ResponseParser, ErrorHandler, Validator, JsonParser };
