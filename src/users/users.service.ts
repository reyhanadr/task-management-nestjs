import {
    Injectable,
    NotFoundException,
    ForbiddenException,
  } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private websocketGateway: WebsocketGateway) {}
  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}