import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { FindNotesDto } from './dto/find-notes.dto';
import { 
  ApiBearerAuth, 
  ApiOperation, 
  ApiResponse, 
  ApiTags,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { Note } from './models/note.model';
import { PaginatedNotes } from './models/pagination.model';

// Define the Request type
interface RequestWithUser extends Request {
  user: {
    sub: string;
    [key: string]: any;
  };
}

@ApiTags('notes')
@ApiBearerAuth()
@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @ApiResponse({ 
    status: HttpStatus.CREATED, 
    description: 'The note has been successfully created.',
    type: Note
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
  })
  create(@Request() req: RequestWithUser, @Body() createNoteDto: CreateNoteDto) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.notesService.create(userId, createNoteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes with pagination and search' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns paginated notes with search results.',
    type: PaginatedNotes
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
  })
  findAll(@Request() req: RequestWithUser, @Query() query: FindNotesDto) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.notesService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by ID' })
  @ApiParam({ name: 'id', description: 'The ID of the note to retrieve' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'Returns the note.',
    type: Note
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Note not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
  })
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.notesService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a note' })
  @ApiParam({ name: 'id', description: 'The ID of the note to update' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The note has been successfully updated.',
    type: Note
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Note not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
  })
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.notesService.update(userId, id, updateNoteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({ name: 'id', description: 'The ID of the note to delete' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: 'The note has been successfully deleted.',
    type: Note
  })
  @ApiResponse({ 
    status: HttpStatus.NOT_FOUND, 
    description: 'Note not found.' 
  })
  @ApiResponse({ 
    status: HttpStatus.UNAUTHORIZED, 
    description: 'Unauthorized.' 
  })
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.notesService.remove(userId, id);
  }
} 