import { LayoutDashboard } from 'lucide-react';
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-3">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex items-center gap-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Investigator Dashboard</h1>
      </div>
    </header>
  );
} 