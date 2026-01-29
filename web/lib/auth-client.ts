import { stripeClient } from "@better-auth/stripe/client";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
	plugins: [
		stripeClient({ subscription: true }),
	],
	baseURL: process.env.BETTER_AUTH_URL,
});

export const { signIn, signUp, useSession } = createAuthClient();