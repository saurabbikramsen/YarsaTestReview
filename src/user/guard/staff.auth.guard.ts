import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StaffAuthGuard implements CanActivate {
  constructor(
    private config: ConfigService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const authorization = request?.headers.authorization;
      if (authorization) {
        const token = authorization.slice(7, authorization.length);

        const token_data = this.jwtService.verify(token, {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
        });
        const user = await this.prisma.user.findUnique({
          where: { id: token_data.id },
        });
        if (!user) throw new NotFoundException('unable to perform the task');

        if (token_data.role == 'staff' || token_data.role == 'admin') {
          return true;
        } else {
          throw new UnauthorizedException(
            'you are not eligible to perform this task',
          );
        }
      } else {
        throw new NotFoundException('no token found');
      }
      return false;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token is expired');
      }
      throw error;
    }
  }
}
