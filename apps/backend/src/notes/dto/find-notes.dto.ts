import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindNotesDto {
  @ApiProperty({
    description: 'Page number (pagination)',
    example: 1,
    default: 1,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10,
    default: 10,
    required: false
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Search term for title and content',
    example: 'project',
    required: false
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter notes by tags',
    example: ['meeting', 'project'],
    required: false,
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
} 