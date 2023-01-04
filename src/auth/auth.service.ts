import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

interface TokenResponse {
  token: string;
  user: Partial<User>;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  rejectCredentials() {
    throw new BadRequestException({ error: 'No matching credentials' });
  }

  async validateUser({ email, password }: LoginUserDto) {
    const user = await this.userService.findOne({ email });
    if (!user) return null;

    const match = await compare(password, user.password);
    if (!match) return null;

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, name: user.name };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
