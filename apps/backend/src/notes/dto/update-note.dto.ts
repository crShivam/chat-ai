import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Updated Meeting Notes',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Updated content with additional details',
    required: false
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Tags associated with the note',
    example: ['meeting', 'updated', 'priority'],
    required: false,
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'AI-generated summary of the note',
    example: 'This note contains meeting details and task assignments',
    required: false
  })
  @IsString()
  @IsOptional()
  summary?: string;
} 