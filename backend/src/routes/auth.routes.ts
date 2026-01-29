import { authService } from './../services/auth.service.js';
import { RegisterSchema, LoginSchema, TokenSchema } from './../dtos/auth.dto.js';
import { UserSchema } from './../dtos/users.dto.js';
import { authMiddleware } from './../middlewares/auth.middleware.js';
import type { AppVariables } from './routes.js';
import { createRoute, OpenAPIHono } from '@hono/zod-openapi';

const authRouter = new OpenAPIHono<{ Variables: AppVariables }>();

const registerRoute = createRoute({
  method: 'post',
  path: '/register',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': { schema: RegisterSchema },
      },
    },
  },
  responses: {
    201: {
      description: 'User created successfully',
      content: { 'application/json': { schema: UserSchema } },
    },
    409: { description: 'User already exists' },
  },
});

const loginRoute = createRoute({
  method: 'post',
  path: '/login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': { schema: LoginSchema },
      },
    },
  },
  responses: {
    200: {
      description: 'Login successful',
      content: { 'application/json': { schema: TokenSchema } },
    },
    401: { description: 'Invalid credentials' },
  },
});

const meRoute = createRoute({
  method: 'get',
  path: '/me',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Current user',
      content: { 'application/json': { schema: UserSchema } },
    },
    401: { description: 'Unauthorized' },
  },
});

authRouter.openapi(registerRoute, async (c) => {
  const data = c.req.valid('json');
  const user = await authService.register(data);
  return c.json(user, 201);
});

authRouter.openapi(loginRoute, async (c) => {
  const data = c.req.valid('json');
  const { token } = await authService.login(data);
  return c.json({ token }, 200);
});

authRouter.use('/me', authMiddleware);
authRouter.openapi(meRoute, (c) => {
  const user = c.get('user');
  return c.json(user, 200);
});

export default authRouter;
