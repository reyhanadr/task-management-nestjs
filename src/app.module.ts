import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from '../prisma/prisma.service';
import { WebsocketGateway } from './websocket/websocket.gateway';
import { WsJwtGuard } from './websocket/ws-jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secretKey', // Pastikan sama dengan yang digunakan saat generate token
      signOptions: { expiresIn: '24h' },
      verifyOptions: { 
        ignoreExpiration: false // Set true jika ingin mengabaikan expired token untuk testing
      }
    }),
    AuthModule,
    TasksModule,
    UsersModule,
  ],
  providers: [
    PrismaService,
    WebsocketGateway,
    WsJwtGuard,
  ],
})
export class AppModule {}