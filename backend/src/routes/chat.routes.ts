import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { handleChatRequestFromApi } from './../services/chat.service.js';
import { authMiddleware } from './../middlewares/auth.middleware.js';
import type { AppVariables } from './routes.js';

const chatRouter = new OpenAPIHono<{ Variables: AppVariables }>();

chatRouter.use('*', authMiddleware);

const chatPostRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Chat'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.any(),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Chat stream response',
    },
    401: {
      description: 'Unauthorized',
    },
  },
});

chatRouter.openapi(chatPostRoute, async (c) => {
  return handleChatRequestFromApi(c);
});

export default chatRouter;
