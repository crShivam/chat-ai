import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { TagsService } from './tags.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async getAllTags() {
    try {
      return await this.tagsService.getAllTags();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('generate')
  async generateTags(@Body('content') content: string) {
    if (!content) {
      throw new HttpException(
        'Content is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.tagsService.generateTags(content);
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Content must be at least 50 characters')) {
        throw new HttpException(
          error.message,
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Failed to generate tags',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 