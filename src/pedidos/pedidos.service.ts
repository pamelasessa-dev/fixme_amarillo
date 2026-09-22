import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePedidoDto } from './dto/create-pedido.dto.js';
import { UpdatePedidoDto } from './dto/update-pedido.dto.js';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.pedido.findMany({
      include: {
        producto: true,
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  findMine(userId: number) {
    return this.prisma.pedido.findMany({
      where: { userId },
      include: { producto: true },
    });
  }

  async findOne(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id },
      include: { producto: true },
    });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return pedido;
  }

  create(userId: number, createPedidoDto: CreatePedidoDto) {
    return this.prisma.pedido.create({
      data: {
        userId,
        productoId: createPedidoDto.productoId,
        cantidad: createPedidoDto.cantidad,
      },
    });
  }

  async update(id: number, updatePedidoDto: UpdatePedidoDto) {
    const pedido = await this.findOne(id);

    if (updatePedidoDto.estado === 'CONFIRMADO') {
      await this.prisma.producto.update({
        where: { id: pedido.productoId },
        data: { stock: { decrement: pedido.cantidad } },
      });
    }

    return this.prisma.pedido.update({
      where: { id },
      data: { estado: updatePedidoDto.estado },
    });
  }
}
