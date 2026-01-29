import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "@/lib/prisma";
import { stripeClient } from "@/lib/stripe";

export const subscriptionPlans = [
	{
		name: "Pro",
		priceId: "price_1Ryyph4bKEHHUeu8PhJ5qW8L",
		limits: {
			promptsDay: 50,
			promptsWeek: 250,
			promptsMonth: 1000,
		}
	},
];

export const auth = betterAuth({
	plugins: [
		nextCookies(),
		stripe({
			stripeClient,
			stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
			subscription: {
				enabled: true,
				plans: subscriptionPlans,
				authorizeReference: async ({ user, referenceId }) => {
					return user.id === referenceId;
				},
				getCheckoutSessionParams: () => {
					return {
						params: {
							allow_promotion_codes: true,
						},
					};
				},
				onSubscriptionDeleted: async ({ subscription }) => {
					await prisma.$transaction(async (prisma) => {
						await prisma.userUsage.deleteMany({
							where: {
								userId: subscription.referenceId,
							},
						});
						await prisma.subscription.delete({
							where: {
								id: subscription.id,
							},
						});
					});
				},
			},
		}),
	],

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
	},

	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},

	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
});