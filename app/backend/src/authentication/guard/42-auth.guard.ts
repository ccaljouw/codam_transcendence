import {
  Injectable,
  CanActivate,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthGuard42 extends AuthGuard('42') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error in 42guard:', error);
      throw new InternalServerErrorException({
        message: `${error.code}:${error}`,
      });
    }
  }
}
