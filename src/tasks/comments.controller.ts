import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WebsocketGateway } from '../websocket/websocket.gateway';

@Controller('tasks/:taskId/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private prisma: PrismaService, private websocketGateway: WebsocketGateway) {}

  @Post()
  async create(
    @Param('taskId') taskId: string,
    @Body('comment') commentText: string,
    @Request() req: any,
  ) {
    const comment = await this.prisma.taskComment.create({
      data: {
        comment: commentText,
        task: { connect: { id: taskId } },
        user: { connect: { id: req.user.userId } },
      },
      include: { user: { select: { id: true, name: true } } },
    });

    this.websocketGateway.emitCommentAdded(comment);

    return comment;
  }

  @Get()
  async findAll(@Param('taskId') taskId: string) {
    return this.prisma.taskComment.findMany({
      where: { taskId },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }
}