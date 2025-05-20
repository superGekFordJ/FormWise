import { FileText, MoreVertical, Trash2 } from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';

interface FormListSidebarProps {
  uniqueFormTitles: string[];
  selectedFormTitle: string | null;
  onSelectFormTitle: (title: string) => void;
  onDeleteFormTitleData: (title: string) => void;
  isSidebarOpen: boolean; // Added to control responsive behavior
  setIsSidebarOpen: (isOpen: boolean) => void; // Added to control responsive behavior
}

export function FormListSidebar({
  uniqueFormTitles,
  selectedFormTitle,
  onSelectFormTitle,
  onDeleteFormTitleData,
  isSidebarOpen,      // Destructure
  setIsSidebarOpen    // Destructure
}: FormListSidebarProps) {
  if (uniqueFormTitles.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4 group-data-[collapsible=icon]:hidden">
        <p className="text-sm">No forms uploaded yet.</p>
        <p className="text-xs mt-1">Upload JSON data files to begin.</p>
      </div>
    );
  }

  return (
    <SidebarMenu>
      {uniqueFormTitles.map(title => (
        <SidebarMenuItem key={title} className="flex items-center justify-between w-full group/menu-item">
          <div className="flex-grow min-w-0">
            <SidebarMenuButton
              onClick={() => {
                onSelectFormTitle(title);
                if (window.innerWidth < 768 && isSidebarOpen) setIsSidebarOpen(false); // Use prop
              }}
              isActive={selectedFormTitle === title}
              className="w-full"
              tooltip={{ children: title, side: "right", align: "start", className: "ml-2" }}
            >
              <span className="truncate flex items-center gap-2"><FileText size={16} /> {title}</span>
            </SidebarMenuButton>
          </div>
          <div className="flex-shrink-0 ml-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-70 hover:opacity-100 group-data-[collapsible=icon]:hidden">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start">
                <DropdownMenuItem onClick={() => onDeleteFormTitleData(title)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
} 