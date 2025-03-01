import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Library, LogOut } from 'lucide-react';
import { signOut } from '@/lib/firebase';

export function SideNav() {
  const [location] = useLocation();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/playlists', icon: Library, label: 'Your Library' },
  ];

  return (
    <div className="h-screen w-[240px] border-r bg-sidebar">
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold">
              Music Stream
            </h2>
            <div className="space-y-1">
              {navItems.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href}>
                  <Button
                    variant={location === href ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      location === href && 'bg-sidebar-accent'
                    )}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-0 right-0 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
