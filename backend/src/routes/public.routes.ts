import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import type { AppVariables } from './routes.js';
import { chatRepository } from './../repositories/chat.repository.js';
import { HTTPException } from 'hono/http-exception';

const publicRouter = new OpenAPIHono<{ Variables: AppVariables }>();

const getPublicChatRoute = createRoute({
  method: 'get',
  path: '/chats/{sharePath}',
  tags: ['Public'],
  request: { params: z.object({ sharePath: z.string() }) },
  responses: {
    200: { description: 'Get public chat', content: { 'application/json': { schema: z.any() } } },
    404: { description: 'Not found' },
  },
});

publicRouter.openapi(getPublicChatRoute, async (c) => {
  const { sharePath } = c.req.param();
  const chat = await chatRepository.findPublicBySharePath(sharePath);
  if (!chat || !chat.isPublic) throw new HTTPException(404, { message: 'Public chat not found' });
  return c.json({ success: true, data: chat }, 200);
});

export default publicRouter;
