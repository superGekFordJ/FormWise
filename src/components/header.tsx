import Link from 'next/link';
import { FileText, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard

export default function Header() {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <FileText className="h-8 w-8" />
          <span>FormWise</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Create Form
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          {/* Add more navigation links here if needed */}
        </nav>
      </div>
    </header>
  );
}
