import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApplyUser extends AuthGuard('jwt') {
  handleRequest<User>(err: any, user: User) {
    return user;
  }
}
