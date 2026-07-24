export class JsonParser {
  /**
   * Cleanses raw text response from Grok and parses it into a JSON object.
   * If parsing fails, attempts automatic JSON recovery.
   */
  static parseCleanedJson<T = any>(rawText: string): T {
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    try {
      return JSON.parse(cleaned) as T;
    } catch (e: any) {
      console.warn("[JsonParser] Standard parsing failed. Attempting automatic recovery...", e.message);
      
      try {
        const recoveredText = this.attemptRecovery(cleaned);
        return JSON.parse(recoveredText) as T;
      } catch (recoveryError: any) {
        throw new Error(
          `Malformed JSON Error: The response returned by Grok was malformed and could not be recovered automatically. Details: ${recoveryError.message || ""}`
        );
      }
    }
  }

  /**
   * Attempts to repair common JSON syntax errors.
   */
  private static attemptRecovery(text: string): string {
    let repaired = text;

    // 1. Isolate the main JSON block if there is extra conversational text
    const firstBrace = repaired.indexOf('{');
    const lastBrace = repaired.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      repaired = repaired.substring(firstBrace, lastBrace + 1);
    }

    // 2. Remove trailing commas in objects and arrays before closures
    repaired = repaired.replace(/,\s*}/g, '}');
    repaired = repaired.replace(/,\s*\]/g, ']');

    // 3. Fix unescaped double quotes inside values (often causes JSON parse failures)
    // We target common double quote patterns but avoid standard JSON keys
    repaired = repaired.replace(/(?<=:\s*")[^"]*"(?=\s*[,}])/g, (match) => {
      // Escape nested quotes inside value blocks
      return match.replace(/(?<!\\)"/g, '\\"');
    });

    // 4. Ensure balanced braces/brackets by counting and appending closures
    let openBraces = 0;
    let openBrackets = 0;
    let inString = false;

    for (let i = 0; i < repaired.length; i++) {
      const char = repaired[i];
      if (char === '"' && repaired[i - 1] !== '\\') {
        inString = !inString;
      }
      if (!inString) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (char === '[') openBrackets++;
        if (char === ']') openBrackets--;
      }
    }

    // Append missing closures
    if (openBrackets > 0) {
      repaired += ']'.repeat(openBrackets);
    }
    if (openBraces > 0) {
      repaired += '}'.repeat(openBraces);
    }

    return repaired;
  }
}
