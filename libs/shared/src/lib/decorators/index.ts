import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

// Get current user from request context
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.user;
    }
    
    // GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.user;
  },
);

// Get request IP address
export const IpAddress = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.ip || request.connection.remoteAddress;
    }
    
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.ip || request.connection.remoteAddress;
  },
);

// Get user agent from request
export const UserAgent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      return request.headers['user-agent'];
    }
    
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    return request.headers['user-agent'];
  },
);

// Get pagination parameters
export const Pagination = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      const { page = 1, limit = 20, sortBy, sortOrder = 'DESC' } = request.query;
      
      return {
        page: parseInt(page, 10),
        limit: Math.min(parseInt(limit, 10), 100),
        sortBy,
        sortOrder,
        offset: (parseInt(page, 10) - 1) * parseInt(limit, 10),
      };
    }
    
    // For GraphQL, this would be handled in the resolver
    return { page: 1, limit: 20, sortOrder: 'DESC', offset: 0 };
  },
);