import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppInfo() {
    return {
      name: 'Task Management API',
      version: '1.0.0',
      description: 'Task Management System with Authentication and Team Collaboration',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected', // You might want to add actual database health check
    };
  }
}
