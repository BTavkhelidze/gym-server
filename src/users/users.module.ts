import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { ConfigModule } from '@nestjs/config';
import { MemberShipSchema } from 'src/membership/schema/membership.schema';

@Module({
  imports: [
    ConfigModule.forRoot(),

    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Membership', schema: MemberShipSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
