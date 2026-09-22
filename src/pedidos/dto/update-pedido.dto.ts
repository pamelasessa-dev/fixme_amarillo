import { EstadoPedido } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdatePedidoDto {
  @IsEnum(EstadoPedido)
  estado: EstadoPedido;
}
