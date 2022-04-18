import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Metadata } from '../models/metadata';
import { MetadataController } from './metadata.controller';

describe('MetadataController', () => {
  let metadataController: MetadataController;
  const mockedData = {
    APP_NAME: 'DummyTestAppName',
    APP_DESCRIPTION: 'DummyTestAppDescription',
    APP_VERSION: '0.0.0',
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
      ],
    }).compile();
    jest.spyOn(process, 'uptime').mockReturnValue(0);

    metadataController = app.get<MetadataController>(MetadataController);
  });

  describe('MetadataController', () => {
    it('should return app metadata', () => {
      const result: Metadata = metadataController.getInfo();
      expect(result.appName).toBe(mockedData.APP_NAME);
      expect(result.description).toBe(mockedData.APP_DESCRIPTION);
      expect(result.version).toBe(mockedData.APP_VERSION);
      expect(result.uptime).toBe('0 Years, 0 Days, 00h00:00');
    });
  });
});
