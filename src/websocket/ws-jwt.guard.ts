import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const client = context.switchToWs().getClient();
      
      console.log('WebSocket connection attempt:', {
        headers: client.handshake.headers,
        auth: client.handshake.auth,
        query: client.handshake.query
      });

      const token = this.extractToken(client);
      
      if (!token) {
        console.error('No token found in WebSocket connection request');
        return false;
      }

      console.log('Token found:', token.substring(0, 20) + '...');

      try {
        const payload = this.jwtService.verify(token);
        console.log('Token verified successfully:', payload);
        client['user'] = payload;
        return true;
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError.message);
        return false;
      }

    } catch (error) {
      console.error('WebSocket guard error:', error.message);
      return false;
    }
  }

  private extractToken(client: any): string | null {
    // 1. Cek Authorization header (case-insensitive)
    const authHeader = client.handshake.headers.authorization || 
                      client.handshake.headers.Authorization;
    if (authHeader) {
      console.log('Found Authorization header:', authHeader);
      const [type, token] = authHeader.split(' ');
      if (type.toLowerCase() === 'bearer' && token) {
        return token;
      }
    }

    // 2. Cek auth object
    if (client.handshake.auth?.token) {
      console.log('Found token in auth object');
      return client.handshake.auth.token;
    }

    // 3. Cek query parameter
    if (client.handshake.query?.token) {
      console.log('Found token in query');
      return client.handshake.query.token;
    }

    // 4. Cek custom header
    const customAuthHeader = client.handshake.headers['x-auth-token'];
    if (customAuthHeader) {
      console.log('Found custom auth header');
      return customAuthHeader;
    }

    console.log('No token found in any location');
    return null;
  }
}