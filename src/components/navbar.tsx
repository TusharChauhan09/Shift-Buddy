import { ProfileDropdown } from "@/components/profile-dropdown";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationBell } from "@/components/notification-bell";

interface NavbarProps {
  userName?: string | null;
  userImage?: string | null;
  userEmail?: string | null;
  registrationNumber?: string | null;
  phoneNumber?: string | null;
  isAdmin?: boolean;
}

export function Navbar({
  userName,
  userImage,
  userEmail,
  registrationNumber,
  phoneNumber,
  isAdmin,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-card text-card-foreground shadow-sm mt-2 mx-2 sm:mx-4 lg:mx-auto lg:max-w-6xl border rounded-lg backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="px-2 sm:px-4 md:px-5 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16 gap-1 sm:gap-2">
          <div className="flex-shrink-0 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Image
                src="/shift.png"
                alt="Shift Buddy Logo"
                width={32}
                height={32}
                className="w-7 h-7 sm:w-10 sm:h-10 object-contain flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-semibold leading-tight truncate">
                  Shift Buddy
                </h1>
                <p className="text-[9px] sm:text-xs text-muted-foreground leading-tight hidden xs:block">
                  your mutual shift guide
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
            {isAdmin && (
              <Link
                href="/dashboard"
                className="text-[10px] sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-2 sm:px-4 py-1.5 sm:py-2 rounded-md shadow-sm cursor-pointer whitespace-nowrap"
              >
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </Link>
            )}
            <span className="text-[10px] sm:text-xs text-muted-foreground font-semibold hidden lg:inline max-w-[100px] truncate">
              Welcome, {userName || "User"}
            </span>
            <NotificationBell />
            <ThemeToggle />
            <ProfileDropdown
              user={{ name: userName, image: userImage, email: userEmail }}
              registrationNumber={registrationNumber}
              phoneNumber={phoneNumber}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
