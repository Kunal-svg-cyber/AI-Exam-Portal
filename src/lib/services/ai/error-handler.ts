export class ErrorHandler {
  static async handleApiError(response: Response): Promise<never> {
    let detailMessage = "";
    let rawText = "";

    try {
      rawText = await response.text();
    } catch (_) {
      rawText = "";
    }

    if (rawText) {
      try {
        const errObj = JSON.parse(rawText);
        // Try the common shapes providers use for error payloads
        detailMessage =
          errObj?.error?.message ||
          (typeof errObj?.error === "string" ? errObj.error : "") ||
          errObj?.message ||
          errObj?.msg ||
          errObj?.detail ||
          "";
      } catch (_) {
        // Body wasn't JSON (e.g. plain text or HTML) — fall through to raw text below
      }

      // If we still don't have a message, surface the raw body itself (truncated)
      // so the actual cause from Groq is visible instead of a generic status text.
      if (!detailMessage) {
        detailMessage = rawText.slice(0, 300);
      }
    }

    if (!detailMessage) {
      detailMessage = response.statusText || "";
    }

    const prefix = `Groq API Error (HTTP ${response.status})`;

    switch (response.status) {
      case 401:
        throw new Error(`${prefix}: Unauthorized. Please check that your Groq API key is correct and valid.`);
      case 402:
        throw new Error(`${prefix}: Payment Required. Please review billing status on your Groq console (console.groq.com).`);
      case 404:
        throw new Error(`${prefix}: Not Found. ${detailMessage || "The requested model or endpoint may not exist."}`);
      case 429:
        throw new Error(`${prefix}: Rate Limit Exceeded. You have made too many requests. Please wait before retrying.`);
      case 500:
      case 502:
      case 503:
        throw new Error(`${prefix}: Groq Server Error. The service is currently experiencing issues. Please try again later.`);
      default:
        throw new Error(`${prefix}: ${detailMessage || "An unexpected error occurred."}`);
    }
  }
}
