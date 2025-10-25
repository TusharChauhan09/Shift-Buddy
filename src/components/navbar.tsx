import { ProfileDropdown } from "@/components/profile-dropdown";

interface NavbarProps {
  userName?: string | null;
  userImage?: string | null;
  userEmail?: string | null;
  registrationNumber?: string | null;
}

export function Navbar({
  userName,
  userImage,
  userEmail,
  registrationNumber,
}: NavbarProps) {
  return (
    <header className="bg-card text-card-foreground shadow-sm mt-2 mx-2 sm:mx-4 lg:mx-auto lg:max-w-7xl border rounded-lg">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex-shrink-0">
            <h1 className="text-base sm:text-lg md:text-xl font-semibold">
              <span className="hidden sm:inline">Hostel Management System</span>
              <span className="sm:hidden">HMS</span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            <span className="text-xs sm:text-sm text-muted-foreground hidden md:inline">
              Welcome, {userName || "User"}
            </span>
            <span className="text-xs text-muted-foreground md:hidden">
              {userName?.split(" ")[0] || "User"}
            </span>
            <ProfileDropdown
              user={{ name: userName, image: userImage, email: userEmail }}
              registrationNumber={registrationNumber}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
