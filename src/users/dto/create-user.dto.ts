import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
//se acepta cualquier valor valido del enum role, incluido ADMIN.

/*@IsOptional()
  @IsEnum(Role)
  role?: Role;
*/
  }
