import { ApiProperty } from '@nestjs/swagger';
import { Note } from './note.model';

export class PaginatedNotes {
  @ApiProperty({
    description: 'Array of note objects',
    type: [Note]
  })
  data!: Note[];

  @ApiProperty({
    description: 'Pagination metadata',
    example: {
      total: 50,
      page: 1,
      limit: 5,
      totalPages: 5
    }
  })
  meta!: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
} 