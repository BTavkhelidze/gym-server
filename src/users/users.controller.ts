import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: createUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.usersService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    this.usersService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto) {
    this.usersService.updateUser(id, updateUserDto);
  }
}
