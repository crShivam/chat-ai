import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function Navbar() {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Add subtle fade-in animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <nav
      className="border-b flex items-center px-4 h-14 transition-all duration-500 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(-10px)',
      }}
    >
      <div className="mx-auto flex-1 flex max-w-5xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 transition-transform duration-300 hover:scale-105"
        >
          <span className="text-xl font-bold">Notes AI</span>
        </Link>

        <div className="flex items-center space-x-4">

          <Link to="/new" className="transition-colors duration-200 hover:bg-muted">
            <Button size="sm">New Note</Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full transition-transform duration-200 hover:scale-105"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url || ''}
                      alt={user.user_metadata?.name || 'User'}
                    />
                    <AvatarFallback>
                      {user.user_metadata?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.user_metadata?.name || 'User'}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild disabled>
                  <Link to="/profile" className="transition-colors duration-200 hover:bg-muted">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild disabled>
                  <Link to="/settings" className="transition-colors duration-200 hover:bg-muted">
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await signOut();
                  }}
                  className="transition-colors duration-200 hover:bg-muted"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                asChild
                className="transition-transform duration-200 hover:scale-105"
              >
                <Link to="/signin">Sign in</Link>
              </Button>
              <Button asChild className="transition-transform duration-200 hover:scale-105">
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium transition-colors duration-200 hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;