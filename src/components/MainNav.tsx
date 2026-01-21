
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Book,
  Mic,
  Headphones,
  SpellCheck,
  BookText,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <Book className="h-5 w-5" />
  },
  {
    name: "Text to Speech",
    href: "/text-to-speech",
    icon: <Headphones className="h-5 w-5" />
  },
  {
    name: "Speech to Text",
    href: "/speech-to-text",
    icon: <Mic className="h-5 w-5" />
  },
  {
    name: "Phonetic Helper",
    href: "/phonetic-helper",
    icon: <SpellCheck className="h-5 w-5" />
  },
  {
    name: "Dictionary",
    href: "/dictionary",
    icon: <BookText className="h-5 w-5" />
  }
];

export function MainNav() {
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="px-4 md:px-6 py-3 max-w-7xl mx-auto flex items-center">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center space-x-2 mr-8">
          <span className="text-2xl font-bold text-readease-brightBlue">ReadEase</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-readease-brightBlue"
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User dropdown / Logout */}
        <div className="hidden md:flex items-center ml-auto space-x-4">
          <div className="text-sm font-medium">
            Hi, {user?.name?.split(' ')[0]}
          </div>
          <Button 
            variant="outline"
            size="sm" 
            onClick={logout}
          >
            Log out
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          className="md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden p-4 pt-0 pb-6 border-b space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md p-2",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={logout}
            >
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
