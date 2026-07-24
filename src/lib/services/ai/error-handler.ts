export class ErrorHandler {
  static async handleApiError(response: Response): Promise<never> {
    let detailMessage = "";
    try {
      const errObj = await response.json();
      detailMessage = errObj.error?.message || response.statusText || "";
    } catch (_) {
      detailMessage = response.statusText || "";
    }

    const prefix = `Grok API Error (HTTP ${response.status})`;

    switch (response.status) {
      case 401:
        throw new Error(`${prefix}: Unauthorized. Please check that your Grok API key is correct and valid.`);
      case 402:
        throw new Error(`${prefix}: Payment Required. Please review billing status on your xAI developer console.`);
      case 429:
        throw new Error(`${prefix}: Rate Limit Exceeded. You have made too many requests. Please wait before retrying.`);
      case 500:
      case 502:
      case 503:
        throw new Error(`${prefix}: xAI Server Error. The service is currently experiencing issues. Please try again later.`);
      default:
        throw new Error(`${prefix}: ${detailMessage || "An unexpected error occurred."}`);
    }
  }
}
