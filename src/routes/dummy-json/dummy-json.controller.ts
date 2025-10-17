import { Controller, Get, Param, Patch } from '@nestjs/common';
import { DummyJsonService } from '@libs/services/dummy-json/dummy-json.service';
import { DummyObject } from '@libs/services/dummy-json/dummy.object';
import { ValidateParams } from '@api/decorators/validate.decorator';
import { GetByIDDto, GetByIDSchema } from '@libs/common';

@Controller('dummy-json')
export class DummyJsonController {
  constructor(private readonly dummyJsonService: DummyJsonService) {}

  @Get()
  public async getDummyObject(): Promise<DummyObject> {
    return this.dummyJsonService.getRandomDummyJson();
  }

  @ValidateParams(GetByIDSchema)
  @Patch('/:id')
  public async likeQuote(@Param() { id }: GetByIDDto) {
    return this.dummyJsonService.like(id);
  }
}
