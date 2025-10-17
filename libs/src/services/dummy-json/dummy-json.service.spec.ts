import { Test, TestingModule } from '@nestjs/testing';
import { DummyJsonService } from '@libs/services/dummy-json/dummy-json.service';

describe('DummyJsonService', () => {
  let service: DummyJsonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DummyJsonService],
    }).compile();

    service = module.get<DummyJsonService>(DummyJsonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
