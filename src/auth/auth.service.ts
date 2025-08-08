import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const validUser = await this.validateUser(user.email, user.password);
    if (!validUser) throw new UnauthorizedException();

    const payload = {
      email: validUser.email,
      sub: validUser.id,
      role: validUser.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.usersService.create({ ...data, password: hashedPassword });
  }
}
