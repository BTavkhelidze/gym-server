import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/users/schema/user.schema';
import { SignUpDto } from './dto/sign-up.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(SignUpDto: SignUpDto) {
    const existUser = await this.userModel.findOne({ email: SignUpDto.email });
    if (existUser) throw new BadRequestException('user already exists');

    const hashedPassword = await bcrypt.hash(SignUpDto.password, 10);
    const newUser = {
      email: SignUpDto.email,
      password: hashedPassword,
      firstName: SignUpDto.firstName,
      lastName: SignUpDto.lastName,
    };
    await this.userModel.create(newUser);
    return 'user created successfully';
  }

  async signIn({ email, password }: SignInDto, response) {
    const existUser = await this.userModel.findOne({ email });
    if (!existUser)
      throw new BadRequestException('Email or Password inccorect');

    const isPasswordEqual = await bcrypt.compare(password, existUser.password);
    if (!isPasswordEqual)
      throw new BadRequestException('Email or Password inccorect');

    const payLoad = {
      userId: existUser._id,
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    response.cookie('accesstoken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 2 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    response.json({ accessToken });
  }

  async signiINWithGoogle(user, response) {
    let existUser = await this.userModel.findOne({ email: user.email });
    if (!existUser) existUser = await this.userModel.create(user);
    const payLoad = {
      userId: existUser._id,
    };

    const accessToken = await this.jwtService.sign(payLoad, {
      expiresIn: '1h',
    });

    response.cookie('accesstoken', accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 2 * 1000,
      sameSite: 'lax',
      path: '/',
    });

    response.redirect(`${process.env.FRONT_URI}/dashboard/home`);
  }

  async getCurrentUser(userId) {
    const user = await this.userModel
      .findById(userId)
      .select('-password')
      .populate('membershipId');

    if (!user) throw new UnauthorizedException('Invalid User');

    return user;
  }
}
