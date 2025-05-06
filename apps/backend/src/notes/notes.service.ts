import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FindNotesDto } from './dto/find-notes.dto';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class NotesService {
  constructor(
    private prisma: PrismaService,
    private geminiService: GeminiService
  ) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    // Only generate summary if content is long enough (more than 200 characters)
    let summary = '';
    if (createNoteDto.content.length > 200) {
      summary = await this.geminiService.generateSummary(createNoteDto.content);
    }

    // Create the note with the generated summary (if any)
    return this.prisma.note.create({
      data: {
        userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
        tags: createNoteDto.tags || [],
        summary, // Add the generated summary (empty if content was short)
      },
    });
  }

  async findAll(userId: string, query: FindNotesDto) {
    const { page = 1, limit = 5, search, tags } = query;
    const skip = (page - 1) * limit;

    // Build the where conditions based on search parameters
    const where: any = { userId };

    // Search by title or content
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filter by tags if provided
    if (tags && tags.length > 0) {
      where.tags = { hasSome: tags };
    }

    // Get total count for pagination
    const total = await this.prisma.note.count({ where });

    // Get paginated results
    const notes = await this.prisma.note.findMany({
      where,
      skip,
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: notes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(userId: string, id: string) {
    const note = await this.prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) {
      throw new NotFoundException(`Note with ID ${id} not found`);
    }

    return note;
  }

  async update(userId: string, id: string, updateNoteDto: UpdateNoteDto) {
    // First check if the note exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto,
    });
  }

  async remove(userId: string, id: string) {
    // First check if the note exists and belongs to the user
    await this.findOne(userId, id);

    return this.prisma.note.delete({
      where: { id },
    });
  }
} 