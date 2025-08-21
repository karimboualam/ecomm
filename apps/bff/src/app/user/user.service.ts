import { Injectable } from '@nestjs/common';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthPayload } from './dto/auth.payload';

@Injectable()
export class UserService {
  async login(input: LoginInput): Promise<AuthPayload> {
    // Mock implementation - In real app, this would call the Auth microservice
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        email: input.email,
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    };
  }

  async register(input: RegisterInput): Promise<AuthPayload> {
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return {
      token: 'mock-jwt-token',
      user: {
        id: '2',
        email: input.email,
        firstName: input.firstName,
        lastName: input.lastName,
        role: 'CUSTOMER',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    };
  }
}