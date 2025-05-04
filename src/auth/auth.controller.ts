import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { IsAuthGuard } from './guards/auth.guard';
import { GoogleGuard } from './guards/google.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async signInWithGoogle() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleCallback(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(req.user);
    return this.authService.signiINWithGoogle(req.user, response);
  }

  @Post('sign-in')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signIn(signInDto, response);
  }

  @Get('current-user')
  @UseGuards(IsAuthGuard)
  getCurrentUser(@Req() req) {
    return this.authService.getCurrentUser(req.userId);
  }
}
