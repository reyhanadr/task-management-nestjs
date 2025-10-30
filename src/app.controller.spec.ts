import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  const mockAppService = {
    getAppInfo: jest.fn(),
    getHealth: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
    jest.clearAllMocks();
  });

  describe('getAppInfo', () => {
    it('should return application information', async () => {
      const mockAppInfo = {
        name: 'Task Management API',
        version: '1.0.0',
        status: 'running',
      };
      
      mockAppService.getAppInfo.mockReturnValue(mockAppInfo);
      
      const result = appController.getAppInfo();
      expect(result).toEqual(mockAppInfo);
      expect(appService.getAppInfo).toHaveBeenCalled();
    });
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const mockHealth = {
        status: 'ok',
        database: 'connected',
      };
      
      mockAppService.getHealth.mockReturnValue(mockHealth);
      
      const result = appController.getHealth();
      expect(result).toEqual(mockHealth);
      expect(appService.getHealth).toHaveBeenCalled();
    });
  });
});
