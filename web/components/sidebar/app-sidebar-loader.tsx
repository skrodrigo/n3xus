import AppSidebar from "@/components/sidebar/app-sidebar";

export async function AppSidebarLoader() {
  return <AppSidebar chats={[]} />;
}
