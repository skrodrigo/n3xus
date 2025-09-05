"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { getSubscription } from '@/server/stripe/get-subscription'
import { Skeleton } from "@/components/ui/skeleton"
import { getUserUsage } from "@/server/user/get-usage"
import {
  ChevronsUpDown,
  LogOut,
  Settings,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Subscription } from "@/app/generated/prisma"

export function NavUser({
  user,
  planName,
  userId,
  subscription,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  planName?: string | null
  userId?: string
  subscription?: Subscription | null
}) {
  const [usageData, setUsageData] = useState<{
    dayCount: number
    weekCount: number
    monthCount: number

    limits: {
      promptsDay: number
      promptsWeek: number
      promptsMonth: number
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  async function createPortalBilling() {
    const session = await authClient.getSession()

    await authClient.subscription.billingPortal({
      referenceId: session.data?.user.id,
      returnUrl: process.env.BETTER_AUTH_URL,
    });

  }

  const createSubscription = async () => {
    const session = await authClient.getSession();

    const userId = session.data?.user.id;

    const subscription = await getSubscription();

    await authClient.subscription.upgrade({
      plan: "Pro",
      annual: false,
      referenceId: userId,
      subscriptionId: subscription?.stripeSubscriptionId ?? undefined,
      successUrl: process.env.BETTER_AUTH_URL,
      cancelUrl: process.env.BETTER_AUTH_URL,
      disableRedirect: false,
    })
  }

  const logout = async () => {
    await authClient.signOut()
    router.push('/')
  }

  const { isMobile } = useSidebar()
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    async function loadUsageData() {
      if (!userId) return
      setIsLoading(true)
      try {
        const data = await getUserUsage(userId)
        if (data) {
          setUsageData(data)
        }
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    if (settingsOpen) {
      loadUsageData()
    }
  }, [settingsOpen, userId])

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-2xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-2xl">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-foreground/80">{user.name}</span>
                  <span className="truncate text-xs text-foreground/40">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-2xl"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-2xl">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-2xl">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-foreground/80">{user.name}</span>
                    <span className="truncate text-xs text-foreground/40">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="focus:bg-destructive/20" onClick={logout}>
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações da Conta</DialogTitle>
            <DialogDescription>Veja suas informações e opções de suporte.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground/70">Usuário</h3>
              <div className="mt-2 flex items-center gap-3">
                <Avatar className="h-9 w-9 rounded-2xl">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-2xl">CN</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-foreground/60">{user.email}</div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-foreground/90">Plano</h3>
              {isLoading ? (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ) : (
                <div className="mt-2 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-foreground/60">
                      {planName
                        ? planName.charAt(0).toUpperCase() + planName.slice(1)
                        : "Sem plano"}
                    </div>
                  </div>
                  {subscription && subscription.status === "active" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={createPortalBilling}
                    >
                      Gerenciar
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={createSubscription}
                    >
                      Assine agora
                    </Button>
                  )}
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-foreground/90">Uso do Plano</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/12" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/12" />
                  </div>
                </div>
              </div>
            ) : subscription && subscription.status === "active" && usageData && usageData.limits && usageData.limits.promptsDay > 0 && (
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-foreground/90">Uso do Plano</h3>
                <div className="mt-2 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Hoje</span>
                    <span className="font-medium">
                      {usageData.dayCount}/<span className="text-foreground/60">{usageData.limits.promptsDay}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Esta semana</span>
                    <span className="font-medium">
                      {usageData.weekCount}/<span className="text-foreground/60">{usageData.limits.promptsWeek}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Este mês</span>
                    <span className="font-medium">
                      {usageData.monthCount}/<span className="text-foreground/60">{usageData.limits.promptsMonth}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-foreground/70">Suporte</h3>
              <div className="mt-2 text-sm text-foreground/70">
                Precisa de ajuda? Entre em contato com o suporte.
              </div>
              <div className="mt-3 flex gap-2">
                <Button asChild size="sm" variant="secondary">
                  <a href="#">Email</a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <a href="#">Centro de ajuda</a>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
