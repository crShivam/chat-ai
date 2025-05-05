import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FindNotesDto } from './dto/find-notes.dto';

@Injectable()
export class NotesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: {
        userId,
        title: createNoteDto.title,
        content: createNoteDto.content,
        tags: createNoteDto.tags || [],
        embedding: [], // Empty by default, would be filled by a vector embedding service
      },
    });
  }

  async findAll(userId: string, query: FindNotesDto) {
    const { page = 1, limit = 10, search, tags } = query;
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
      take: limit,
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