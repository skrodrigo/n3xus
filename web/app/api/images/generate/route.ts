import { getApiBaseUrl, proxyJson, requireAuthToken } from '@/data/bff'
import { revalidateTag } from 'next/cache'

export async function POST(req: Request) {
	const auth = await requireAuthToken()
	if (!auth.ok) return auth.res

	const body = await req.json().catch(() => null)
	if (!body) {
		return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
	}

	const upstream = await fetch(`${getApiBaseUrl()}/api/images/generate`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${auth.token}`,
			'Content-Type': 'application/json',
		},
		cache: 'no-store',
		body: JSON.stringify(body),
	})

	const res = await proxyJson(upstream)
	const payload = await res.clone().json().catch(() => null)
	const chatId = payload?.data?.chatId
	if (typeof chatId === 'string' && chatId.length > 0) {
		revalidateTag(`chat:${chatId}`, {})
	}
	revalidateTag('chats:list', {})
	return res
}
