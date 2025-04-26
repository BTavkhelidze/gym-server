import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(createUserDto: createUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException('user already exist');
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    const users = this.userModel.find();
    return users;
  }

  async findOne(id) {
    if (!isValidObjectId(id)) throw new BadRequestException('not valid id ');
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('user not found');
    return user;
  }

  async delete(id) {
    if (!isValidObjectId(id)) throw new BadRequestException('not valid id ');
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('user not found');
    console.log('deleted successfully');
    return user;
  }

  async updateUser(id, updateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('not valid id ');
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    if (!user) throw new NotFoundException('user not found');
    return user;
  }
}
