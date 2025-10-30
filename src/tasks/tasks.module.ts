import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WebsocketGateway } from '../websocket/websocket.gateway';
import { AuthModule } from '../auth/auth.module';
import { CommentsController } from './comments.controller';
  
@Module({
  imports: [AuthModule],
  controllers: [TasksController, CommentsController],
  providers: [TasksService, PrismaService, WebsocketGateway],
})
export class TasksModule {}