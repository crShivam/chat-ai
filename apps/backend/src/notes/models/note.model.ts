import { ApiProperty } from '@nestjs/swagger';

export class Note {
  @ApiProperty({
    description: 'The unique identifier of the note',
    example: '6446e2e28a866048e1b6c601'
  })
  id!: string;

  @ApiProperty({
    description: 'The user ID that owns this note',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  userId!: string;

  @ApiProperty({
    description: 'The title of the note',
    example: 'Meeting Notes'
  })
  title!: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Discussed project timeline and assigned tasks'
  })
  content!: string;

  @ApiProperty({
    description: 'AI-generated summary of the note',
    example: 'This note contains meeting details and task assignments',
    required: false
  })
  summary?: string;

  @ApiProperty({
    description: 'Tags associated with the note',
    example: ['meeting', 'project', 'tasks'],
    type: [String]
  })
  tags!: string[];

  @ApiProperty({
    description: 'The date when the note was created',
    example: '2023-07-10T15:30:45.123Z'
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'The date when the note was last updated',
    example: '2023-07-15T09:12:34.567Z'
  })
  updatedAt!: Date;
} 