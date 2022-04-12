import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ParseHashPipe } from '../pipes/parse-hash.pipe';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new ParseHashPipe()) createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.users({});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.user({ id });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ParseHashPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser({
      where: { id },
      data: updateUserDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser({ id });
  }
}
