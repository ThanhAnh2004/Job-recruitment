import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './users.interface';
import { Public, ResponseMessage, User } from 'src/decorator/customize';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage('Create a new user')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    let newUser = await this.usersService.create(createUserDto, user);

    return {
      _id: newUser?.id,
      createdAt: newUser?.createdAt
    }
  }

  @Get()
  @ResponseMessage('Fetch user with paginate')
  async findAll(
    @Query('page') currentPage: string,
    @Query('limit') limit: string,
    @Query() qs: string
  ) {
    return await this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('Fetch user by id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }

  @Patch()
  @ResponseMessage('Update a user')
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return await this.usersService.update(updateUserDto, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete a user')
  delete(@Param('id') id: string, @User() user: IUser) {
    return this.usersService.delete(id, user);
  }
}
