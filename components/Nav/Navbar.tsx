"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, LogOut, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "@/lib/auth-client";

const NavbarItem = ({ item, href }: { item: string; href: string }) => {
  const pathName = usePathname();

  return (
    <motion.a
      href={href}
      className={cn(
        "cursor-pointer font-medium text-black hover:opacity-[0.9] dark:text-white px-2 py-2 transition-opacity duration-300 rounded-lg",
        pathName === href ? "dark:text-primary text-primary" : ""
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {item}
    </motion.a>
  );
};

const MobileNavItem = ({ item, href }: { item: string; href: string }) => {
  return (
    <SheetClose asChild>
      <Link
        href={href}
        className="block px-4 py-3 text-lg font-medium text-foreground hover:text-primary hover:bg-accent rounded-lg transition-colors"
      >
        {item}
      </Link>
    </SheetClose>
  );
};

const UserProfileDropdown = ({
  user,
  onSignOut,
}: {
  user: { name?: string; email?: string; image?: string | null };
  onSignOut: () => void;
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.name || "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:text-red-600"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const MobileUserSection = ({
  user,
  onSignOut,
}: {
  user: { name?: string; email?: string; image?: string | null };
  onSignOut: () => void;
}) => {
  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="mt-8 space-y-4">
      <div className="mx-2 flex items-center gap-3 px-4 py-3 bg-accent rounded">
        <Avatar className="h-12 w-12">
          <AvatarImage
            src={user.image || undefined}
            alt={user.name || "User"}
          />
          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user.name || "User"}</p>
          <p className="text-xs text-muted-foreground truncate">
            {user.email || ""}
          </p>
        </div>
      </div>
      <SheetClose asChild>
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </SheetClose>
      <SheetClose asChild>
        <Button
          variant="destructive"
          className="w-full justify-start"
          onClick={onSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </SheetClose>
    </div>
  );
};

export default function Navbar({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  const publicNavItems = [
    { item: "Home", href: "/" },
    { item: "Examples", href: "/examples" },
    { item: "Pricing", href: "/pricing" },
  ];

  const authenticatedNavItems = [
    { item: "Home", href: "/" },
    { item: "Dashboard", href: "/dashboard" },
    { item: "Pricing", href: "/pricing" },
  ];

  const navItems = session?.user ? authenticatedNavItems : publicNavItems;

  return (
    <div
      className={cn(
        "fixed top-10 inset-x-0 max-w-2xl mx-auto z-50  px-4",
        className
      )}
    >
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-full border bg-background border-white/[0.2] shadow-lg flex items-center justify-between px-5 py-2.5"
      >
        <motion.div className="flex items-center" whileHover={{ scale: 1.05 }}>
          <Link href="/">
            <h1 className="md:text-xl font-bold text-black dark:text-white">
              LessonMap
            </h1>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            {navItems.map((nav, index) => (
              <NavbarItem key={index} item={nav.item} href={nav.href} />
            ))}
          </div>

          {!isPending && (
            <>
              {session?.user ? (
                <UserProfileDropdown
                  user={session.user}
                  onSignOut={handleSignOut}
                />
              ) : (
                <Button className="ml-2" size="sm" asChild>
                  <Link href="/sign-in">Get Started</Link>
                </Button>
              )}
            </>
          )}
        </div>
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] px-3 py-4 sm:w-[400px] flex flex-col h-full"
            >
              <SheetHeader className="mb-6">
                <SheetTitle className="text-2xl font-bold text-left">
                  LessonMap
                </SheetTitle>
              </SheetHeader>

              <nav className="flex-1 flex flex-col space-y-2">
                {navItems.map((nav, index) => (
                  <MobileNavItem key={index} item={nav.item} href={nav.href} />
                ))}
              </nav>

              {!isPending && (
                <div className="mt-auto pt-6 border-t">
                  {session?.user ? (
                    <MobileUserSection
                      user={session.user}
                      onSignOut={handleSignOut}
                    />
                  ) : (
                    <SheetClose asChild>
                      <Button className="w-full" asChild>
                        <Link href="/sign-in">Get Started</Link>
                      </Button>
                    </SheetClose>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </div>
  );
}
