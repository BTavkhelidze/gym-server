import { IsNotEmpty, IsString } from 'class-validator';

export class createUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
