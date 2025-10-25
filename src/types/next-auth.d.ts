declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    registrationNumber?: string | null;
    phoneNumber?: string | null;
    isAdmin?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    registrationNumber?: string | null;
    phoneNumber?: string | null;
    isAdmin?: boolean;
  }
}
