import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  age: number;
}

@InputType()
export class GetByUUIDInput {
  @Field()
  id: string;
}
