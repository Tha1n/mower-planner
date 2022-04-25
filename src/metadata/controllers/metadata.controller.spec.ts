import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Metadata } from '../models/dto/metadata.dto';
import { RuntimeService } from '../services/runtime.service';
import { MetadataController } from './metadata.controller';

describe('MetadataController', () => {
  let metadataController: MetadataController;
  const mockedData = {
    APP_NAME: 'DummyTestAppName',
    APP_DESCRIPTION: 'DummyTestAppDescription',
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MetadataController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              return mockedData[key];
            }),
          },
        },
        {
          provide: RuntimeService,
          useValue: {
            appVersion: '0.0.0',
            uptime: 0,
          },
        },
      ],
    }).compile();

    metadataController = app.get<MetadataController>(MetadataController);
  });

  describe('MetadataController', () => {
    it('should return app metadata', () => {
      const result: Metadata = metadataController.getInfo();
      expect(result.appName).toBe(mockedData.APP_NAME);
      expect(result.description).toBe(mockedData.APP_DESCRIPTION);
      expect(result.version).toBe('0.0.0');
      expect(result.uptime).toBe('0 Years, 0 Days, 00h00:00');
    });
  });
});
