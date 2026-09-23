import { ConflictException, Injectable } from '@nestjs/common';
import  bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existing = await this.findByEmail(createUserDto.email);
    if (existing) {
      throw new ConflictException('El correo ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        //role: createUserDto.role ?? 'USER',
      },
    });

    return this.sanitize(user);
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
//en findbyIs se estaa devolviendo tambien password
  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  private sanitize(user: { password: string; [key: string]: unknown }) {
    const { password: _password, ...rest } = user;
    return rest;
  }
}
