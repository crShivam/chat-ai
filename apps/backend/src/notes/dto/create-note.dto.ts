import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNoteDto {
  @ApiProperty({
    description: 'The title of the note',
    example: 'Meeting Notes'
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description: 'The content of the note',
    example: 'Discussed project timeline and assigned tasks'
  })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty({
    description: 'Tags associated with the note',
    example: ['meeting', 'project', 'tasks'],
    required: false,
    type: [String]
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 