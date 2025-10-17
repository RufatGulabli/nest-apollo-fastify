import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserObject {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  age?: number;
}
