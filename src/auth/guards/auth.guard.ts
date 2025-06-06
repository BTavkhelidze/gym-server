import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class IsAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      // const token = this.getTokenFromHeader(request.headers);
      const [, token] = request.headers['cookie']
        .split(' ')
        .filter((el) => el.includes('accesstoken'))[0]
        .split('=');

      if (!token) throw new BadRequestException('token is not provided ');

      const payLoad = await this.jwtService.verify(token);

      request.userId = payLoad.userId;

      return true;
    } catch (e) {
      throw new UnauthorizedException('permission dined');
    }
  }
}
