import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Home, Search, Library, LogOut, Menu } from 'lucide-react';
import { signOut } from '@/lib/firebase';
import { useState } from 'react';

export function SideNav() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '/playlists', icon: Library, label: 'Your Library' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 md:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:static h-screen w-[240px] border-r bg-sidebar transition-transform duration-200 ease-in-out z-40",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
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
                      onClick={() => setIsOpen(false)}
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

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}