import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(email: string, password: string, name: string) {
    try {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) throw new BadRequestException('Email already exists');

      const hashed = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: { email, password: hashed, name },
      });

      return this.generateToken(user.id, user.email);
    } catch (error) {
      console.error('Registration error:', error);
      throw new BadRequestException('Registration failed');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user.id, user.email);
  }

  private generateToken(userId: string, email: string) {
    const payload = { sub: userId, email };
    return { access_token: this.jwtService.sign(payload) };
  }
}