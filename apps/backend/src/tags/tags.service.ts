import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class TagsService {
  private readonly logger = new Logger(TagsService.name);

  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService,
  ) {}

  /**
   * Get all unique tags from the database
   */
  async getAllTags() {
    try {
      const notes = await this.prisma.note.findMany({
        select: {
          tags: true,
        },
      });
      
      // Get all tags from all notes and make them unique
      const allTags = notes.flatMap(note => note.tags);
      const uniqueTags = [...new Set(allTags)];
      
      return uniqueTags;
    } catch (error) {
      this.logger.error('Error fetching tags:', error);
      throw error;
    }
  }

  /**
   * Generate two tags for the given content using Gemini AI
   */
  async generateTags(content: string) {
    if (content.length < 50) {
      throw new Error('Content must be at least 50 characters long for tag generation');
    }

    try {
      const tags = await this.geminiService.generateTags(content);
      return tags;
    } catch (error) {
      this.logger.error('Error generating tags:', error);
      throw error;
    }
  }
} 