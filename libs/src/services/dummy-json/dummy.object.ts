import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DummyObject {
  @Field()
  id: number;

  @Field()
  quote: string;

  @Field()
  author: string;

  @Field()
  likes: number;
}
