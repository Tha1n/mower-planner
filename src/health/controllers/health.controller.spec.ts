import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigHealthIndicator } from '../services/config.health.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;
  let mockedData = {
    WEATHER_API_TOKEN: 'TestingData',
    WEATHER_API_LAT: 'TestingData',
    WEATHER_API_LNG: 'TestingData',
    HUSQ_APP_KEY: 'TestingData',
    HUSQ_APP_SECRET: 'TestingData',
    HUSQ_USER: 'TestingData',
    HUSQ_PWD: 'TestingData',
    HUSQ_MOWER_ID: 'TestingData',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      imports: [TerminusModule],
      providers: [
        ConfigHealthIndicator,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return mockedData[key];
            }),
          },
        },
      ],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('HealthController', () => {
    it('should return a valid healthCheck', async () => {
      const result = await healthController.check();
      expect(result.status).toBe('ok');
      expect(result.info.ConfigHealthIndicator.status).toBe('up');
    });

    it('should return a down healthCheck', async () => {
      // Remove key from mockedData
      delete mockedData.HUSQ_APP_KEY;

      const result = healthController.check();
      await expect(result).rejects.toThrow('Service Unavailable Exception');
    });
  });
});
