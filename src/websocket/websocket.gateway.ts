import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { UseGuards } from "@nestjs/common";
import { WsJwtGuard } from "./ws-jwt.guard";

@UseGuards(WsJwtGuard)
@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization', 'authorization']
  },
  namespace: "events",
  transports: ['websocket'],
  allowEIO3: true,
  path: '/socket.io/'
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private jwtService: JwtService) {
    console.log('WebSocket Gateway initialized'); 
  }

  // Map untuk menyimpan koneksi aktif: socket.id → userId
  private clients = new Map<string, string>();

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      console.log('New client connecting:', client.id);
      
      // Log connection details untuk debugging
      console.log('Connection details:', {
        id: client.id,
        auth: client.handshake.auth,
        headers: client.handshake.headers,
        query: client.handshake.query
      });

      const user = client['user'];
      if (!user) {
        console.log(`Client ${client.id}: No valid user found - disconnecting`);
        client.disconnect();
        return;
      }

      // Simpan koneksi client
      this.clients.set(client.id, user.sub);
      console.log(`User ${user.sub} connected successfully via WebSocket`);
      
      // Kirim welcome message ke client
      client.emit('connected', { 
        message: 'Successfully connected to WebSocket',
        userId: user.sub 
      });
      
    } catch (error) {
      console.error('Error handling connection:', error);
      client.disconnect();
    }
  }
  // websocket.gateway.ts
  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    console.log('Ping from client:', client.id);
    return 'pong';
  }
  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.clients.delete(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }


  // Task Created
  emitTaskCreated(task: any) {
    this.server.emit("task.created", task);
  }

  // Task Updated
  emitTaskUpdated(task: any) {
    this.server.emit("task.updated", task);
  }

  // Task Deleted
  emitTaskDeleted(taskId: string) {
    this.server.emit("task.deleted", { id: taskId });
  }

  // Comment Added
  emitCommentAdded(comment: any) {
    // Kirim ke semua client yang terkait task ini
    this.server.emit("comment.added", comment);
  }
}
