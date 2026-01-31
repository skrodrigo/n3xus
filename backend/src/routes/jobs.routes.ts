import { Hono } from 'hono';
import { env } from './../common/env.js';
import { prisma } from './../common/prisma.js';
import { emailService } from './../services/email.service.js';

const jobsRouter = new Hono();

function requireJobSecret(c: any) {
  const secret = c.req.header('x-job-secret');
  return secret && secret === env.JOB_SECRET;
}

jobsRouter.post('/email-drip', async (c) => {
  if (!requireJobSecret(c)) return c.json({ error: 'Unauthorized' }, 401);

  const now = new Date();
  const dayMs = 24 * 60 * 60 * 1000;
  const minCreatedAt = new Date(now.getTime() - 8 * dayMs);
  const maxCreatedAt = new Date(now.getTime() - 2 * dayMs);

  const candidates = await prisma.user.findMany({
    where: {
      emailVerified: true,
      createdAt: { gte: minCreatedAt, lte: maxCreatedAt },
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  const byDay = new Map<2 | 5 | 7, typeof candidates>();
  for (const u of candidates) {
    const days = Math.floor((now.getTime() - u.createdAt.getTime()) / (24 * 60 * 60 * 1000));
    const day: 2 | 5 | 7 | null = days === 2 ? 2 : days === 5 ? 5 : days === 7 ? 7 : null;
    if (!day) continue;
    const list = byDay.get(day) ?? [];
    list.push(u);
    byDay.set(day, list);
  }

  const allCandidateIds = candidates.map((u) => u.id);
  const activeSubs = await prisma.subscription.findMany({
    where: { referenceId: { in: allCandidateIds }, status: 'active' },
    select: { referenceId: true },
  });
  const activeIds = new Set(activeSubs.map((s) => s.referenceId));

  for (const [day, users] of byDay.entries()) {
    const campaignKey = `drip_day_${day}`;
    const userIds = users.map((u) => u.id).filter((id) => !activeIds.has(id));
    if (userIds.length === 0) continue;

    const sentLogs = await prisma.emailCampaignLog.findMany({
      where: { userId: { in: userIds }, campaignKey },
      select: { userId: true },
    });
    const sentIds = new Set(sentLogs.map((l) => l.userId));

    for (const u of users) {
      if (activeIds.has(u.id) || sentIds.has(u.id)) continue;
      await emailService.sendDrip({ to: u.email, name: u.name, day });
      await prisma.emailCampaignLog.create({
        data: { userId: u.id, campaignKey },
      });
    }
  }

  return c.json({ ok: true }, 200);
});

export default jobsRouter;
