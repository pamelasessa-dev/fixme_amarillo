import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }
//no se valida el token ni si ha expirado
    request.user = jwt.decode(token);
    return true;
    /*ejemplo: tendria que ser algo asi: 
    request.user = jwt.verify(
    header.split(' ')[1],
    process.env.JWT_SECRET as string,
);;
con verify()  se comprueb si el token es valido si ha expirado
y la contraseña se matiene resguardada en .env

*/
  }

  private extractToken(request: {
    headers: Record<string, string | undefined>;
  }): string | undefined {
    const authHeader = request.headers.authorization;
    const [type, token] = authHeader?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
