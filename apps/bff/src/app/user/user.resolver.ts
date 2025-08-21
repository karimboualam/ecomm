import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.entity';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthPayload } from './dto/auth.payload';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { name: 'me', nullable: true })
  async getCurrentUser(@Context() context: any) {
    // Extract user from JWT token in real implementation
    return null;
  }

  @Mutation(() => AuthPayload)
  async login(@Args('input') input: LoginInput) {
    return this.userService.login(input);
  }

  @Mutation(() => AuthPayload)
  async register(@Args('input') input: RegisterInput) {
    return this.userService.register(input);
  }
}