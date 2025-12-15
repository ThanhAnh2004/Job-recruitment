import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, CreateUserCvDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create a new resume')
  create(@Body() createUserCvDto: CreateUserCvDto, @User() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update status resume')
  updateStatus(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.updateStatus(id, status, user);
  }

  @Get()
  @ResponseMessage('Fetch all resumes with paginate')
  findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }


  @Get(':id')
  @ResponseMessage('Find a resume by Id')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete resume by id')
  delete(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.delete(id, user);
  }

  @Post('by-user')
  @ResponseMessage('Get resumes by user')
  getResumesByUser(@User() user: IUser) {
    return this.resumesService.findByUser(user)
  }
}
