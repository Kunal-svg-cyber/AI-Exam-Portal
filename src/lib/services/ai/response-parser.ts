export class ResponseParser {
  static async extractContent(response: Response): Promise<string> {
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("Grok API returned an empty completion response.");
    }
    
    return content;
  }
}
