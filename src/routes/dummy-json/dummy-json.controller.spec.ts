import { Test, TestingModule } from '@nestjs/testing';
import { DummyJsonController } from '@api/routes/dummy-json/dummy-json.controller';

describe('DummyJsonController', () => {
  let controller: DummyJsonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DummyJsonController],
    }).compile();

    controller = module.get<DummyJsonController>(DummyJsonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
