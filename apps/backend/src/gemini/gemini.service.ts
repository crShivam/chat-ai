import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  ModelParams,
  GenerateContentResult,
} from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string | undefined;
  private genAI: GoogleGenerativeAI | undefined;
  private readonly modelName: string = 'gemini-1.5-flash-latest';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!this.apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY is not defined in the environment variables. GeminiService will not be able to generate content.',
      );
    } else {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
    }
  }

  /**
   * Generates a concise summary of note content using Gemini AI.
   * Note: This service is only called for notes with content longer than 200 characters.
   * 
   * @param noteContent - The content of the note to summarize
   * @returns A string containing the generated summary, or empty string if generation fails
   */
  async generateSummary(noteContent: string): Promise<string> {
    if (!this.genAI) {
      this.logger.warn(
        'Skipping summary generation: GeminiService is not initialized due to missing API key.',
      );
      return '';
    }

    try {
      const modelParams: ModelParams = { model: this.modelName };
      const model = this.genAI.getGenerativeModel(modelParams);

      const prompt = `Please generate a concise summary (maximum 2 sentences) of the following note:\n\n${noteContent}`;

      const result: GenerateContentResult = await model.generateContent(prompt);
      const response = result.response;
      const summary = response.text();

      return summary.trim();
    } catch (error: unknown) {
      let errorMessage = 'Unknown error';
      let stack;

      if (error instanceof Error) {
        errorMessage = error.message;
        stack = error.stack;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      this.logger.error(
        `Error generating summary with Gemini: ${errorMessage}`,
        stack,
      );
      return '';
    }
  }
}