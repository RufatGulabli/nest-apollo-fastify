import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DummyJsonService } from '@libs/services/dummy-json/dummy-json.service';
import { DummyObject } from '@libs/services/dummy-json/dummy.object';

@Resolver()
export class DummyJsonResolver {
  constructor(private readonly dummyJsonService: DummyJsonService) {}

  @Query(() => DummyObject)
  public async getDummyObject(): Promise<DummyObject> {
    return this.dummyJsonService.getRandomDummyJson();
  }

  @Mutation(() => DummyObject)
  public async likeQuote(@Args('id') id: number): Promise<DummyObject> {
    return this.dummyJsonService.like(id);
  }
}
