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
      <div className="px-3 sm:px-4 md:px-5 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/shift.png"
                alt="Shift Buddy Logo"
                width={32}
                height={32}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg md:text-xl font-semibold leading-tight">
                  <span className="hidden sm:inline">Shift Buddy</span>
                  <span className="sm:hidden">Shift Buddy</span>
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-tight">
                  your mutual shift guide
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {isAdmin && (
              <Link
                href="/dashboard"
                className="text-xs sm:text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-3 sm:px-4 py-2 rounded-md shadow-sm cursor-pointer"
              >
                Dashboard
              </Link>
            )}
            <span className="text-xs sm:text-sm text-muted-foreground font-semibold hidden md:inline">
              Welcome, {userName || "User"}
            </span>
            <span className="text-xs text-muted-foreground font-semibold md:hidden">
              {userName?.split(" ")[0] || "User"}
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
