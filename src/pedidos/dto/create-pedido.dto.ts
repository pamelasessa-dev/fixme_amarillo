import { IsInt, Min } from 'class-validator';

export class CreatePedidoDto {
  @IsInt()
  productoId: number;

  @IsInt()
  @Min(1)
  cantidad: number;
}
