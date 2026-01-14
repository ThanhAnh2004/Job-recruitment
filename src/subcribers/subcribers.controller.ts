import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubcribersService } from './subcribers.service';
import { CreateSubcriberDto } from './dto/create-subcriber.dto';
import { UpdateSubcriberDto } from './dto/update-subcriber.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subcribers')
export class SubcribersController {
  constructor(private readonly subcribersService: SubcribersService) { }

  @Post()
  @ResponseMessage('Create a subcriber')
  create(@Body() createSubcriberDto: CreateSubcriberDto, @User() user: IUser) {
    return this.subcribersService.create(createSubcriberDto, user);
  }

  @Get()
  findAll() {
    return this.subcribersService.findAll();
  }

  @Get(':id')
  @ResponseMessage('Find a subcriber by id')
  findOne(@Param('id') id: string) {
    return this.subcribersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a subcriber')
  update(@Param('id') id: string, @Body() updateSubcriberDto: UpdateSubcriberDto, @User() user: IUser) {
    return this.subcribersService.update(id, updateSubcriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a subcriber')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subcribersService.remove(id, user);
  }
}
