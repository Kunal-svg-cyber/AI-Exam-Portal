export interface ChatCompletionRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  response_format?: { type: 'json_object' };
  temperature?: number;
}

export class ApiClient {
  /**
   * Posts chat completion request to Groq API with connection timeout and retry logic.
   * Leverages AbortController and exponential backoff.
   */
  static async postChatCompletion(
    apiKey: string,
    requestBody: ChatCompletionRequest,
    maxRetries = 3,
    initialDelayMs = 1000
  ): Promise<Response> {
    let lastError: any = null;
    let delay = initialDelayMs;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const controller = new AbortController();
      // Abort after 30 seconds to handle connection timeouts
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Check if transient error (500 Internal Server, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout)
        const isTransient = response.status >= 500 && response.status <= 504;
        
        if (isTransient && attempt < maxRetries) {
          console.warn(`[Groq API Client] Transient status ${response.status} detected on attempt ${attempt}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }

        return response;
      } catch (e: any) {
        clearTimeout(timeoutId);
        lastError = e;

        const isAbortError = e.name === 'AbortError';
        const isNetworkError = !isAbortError && (e.message?.includes('fetch') || e.message?.includes('Network'));

        if ((isAbortError || isNetworkError) && attempt < maxRetries) {
          const reason = isAbortError ? "Timeout of 30s exceeded" : "Network error";
          console.warn(`[Groq API Client] ${reason} on attempt ${attempt}. Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Exponential backoff
          continue;
        }

        // Break loop and throw for non-retryable errors
        break;
      }
    }

    // If we exhausted all retries or hit a non-retryable error, handle here
    if (lastError) {
      const isAbort = lastError.name === 'AbortError';
      const msg = isAbort 
        ? "Connection Timeout: The request to Groq took longer than 30 seconds to complete." 
        : `Network Error: ${lastError.message || "Failed to communicate with Groq server."}`;
      
      // Ensure the error message NEVER contains the raw API Key
      throw new Error(msg.replace(apiKey, "REDACTED_API_KEY"));
    }

    throw new Error("Groq API Client: Failed to generate response after maximum retries.");
  }
}
