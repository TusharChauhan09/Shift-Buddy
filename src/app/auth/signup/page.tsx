"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function SignUpPage() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/");
  const router = useRouter();

  useEffect(() => {
    // Get callbackUrl from URL params safely on client side
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setCallbackUrl(params.get("callbackUrl") || "/");
    }
  }, []);

  const [availableProviders, setAvailableProviders] = useState<Record<
    string,
    unknown
  > | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { getProviders } = await import("next-auth/react");
        const p = await getProviders();
        setAvailableProviders(p);
      } catch {
        setAvailableProviders(null);
      }
    })();
  }, []);

  // Sign up form state
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    registrationNumber: "",
    password: "",
    confirmPassword: "",
  });

  // Sign in form state
  const [signInData, setSignInData] = useState({
    registrationNumber: "",
    password: "",
  });

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!signUpData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    // Email is optional, but if provided, validate format
    if (
      signUpData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email.trim())
    ) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!signUpData.registrationNumber.trim()) {
      setError("Registration number is required");
      setLoading(false);
      return;
    }

    if (signUpData.registrationNumber.trim().length < 3) {
      setError("Registration number must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (signUpData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (!/(?=.*[A-Za-z])(?=.*\d)/.test(signUpData.password)) {
      setError("Password must contain at least one letter and one number");
      setLoading(false);
      return;
    }

    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          registrationNumber: signUpData.registrationNumber,
          password: signUpData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account");
      }

      // After successful signup, automatically sign the user in
      try {
        const signInResult = await signIn("credentials", {
          registrationNumber: signUpData.registrationNumber
            .trim()
            .toUpperCase(),
          password: signUpData.password,
          callbackUrl,
          redirect: false,
        });

        if (signInResult?.ok) {
          // Small delay to ensure session is established
          setTimeout(() => {
            router.push(callbackUrl);
          }, 100);
        } else {
          setSuccess(true); // Show success message and let them sign in manually
        }
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Auto-signin after signup failed:", error);
        }
        setSuccess(true); // Show success message and let them sign in manually
      }

      setSignUpData({
        name: "",
        email: "",
        registrationNumber: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!signInData.registrationNumber.trim()) {
      setError("Registration number is required");
      setLoading(false);
      return;
    }

    if (signInData.registrationNumber.trim().length < 3) {
      setError("Registration number must be at least 3 characters");
      setLoading(false);
      return;
    }

    if (!signInData.password) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    if (signInData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        registrationNumber: signInData.registrationNumber.trim(),
        password: signInData.password,
        callbackUrl: "/",
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid registration number or password");
      } else if (result?.ok) {
        // Redirect to home page after successful signin
        setTimeout(() => {
          router.push(callbackUrl);
        }, 100);
      } else {
        setError("Sign in failed. Please try again.");
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("Sign in error:", err);
      }
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-sm mx-auto bg-card rounded-xl shadow-lg border border-border p-6">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Account Created!
          </h2>
          <p className="text-xs text-muted-foreground">
            Your account has been created successfully. You can now sign in.
          </p>
          <Button
            onClick={() => {
              setSuccess(false);
              setIsSignUp(false);
            }}
            className="w-full mt-3"
          >
            Continue →
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Header with Icon */}
      <div className="p-5 pb-4 text-center border-b border-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h1 className="text-lg font-bold text-foreground">
          {isSignUp ? "Create your account" : "Sign in to Hostel System"}
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          {isSignUp
            ? "Welcome! Please fill in the details to get started."
            : "Welcome back! Please sign in to continue"}
        </p>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* OAuth Providers */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant="outline"
            className="w-full h-9 font-medium text-xs"
            onClick={async () => {
              try {
                if (!availableProviders || !("google" in availableProviders)) {
                  setError("Google provider is not configured.");
                  return;
                }
                await signIn("google", { callbackUrl, redirect: true });
              } catch (error) {
                if (process.env.NODE_ENV === "development") {
                  console.error("Google signin error:", error);
                }
                setError("Google signin failed. Please try again.");
              }
            }}
            disabled={
              loading ||
              !availableProviders ||
              !("google" in availableProviders)
            }
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="ml-1.5 text-xs hidden sm:inline">Google</span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-9 font-medium text-xs"
            onClick={async () => {
              try {
                if (!availableProviders || !("github" in availableProviders)) {
                  setError("GitHub provider is not configured.");
                  return;
                }
                await signIn("github", { callbackUrl, redirect: true });
              } catch (error) {
                if (process.env.NODE_ENV === "development") {
                  console.error("GitHub signin error:", error);
                }
                setError("GitHub signin failed. Please try again.");
              }
            }}
            disabled={
              loading ||
              !availableProviders ||
              !("github" in availableProviders)
            }
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="ml-1.5 text-xs hidden sm:inline">GitHub</span>
          </Button>
          <Button
            variant="outline"
            className="w-full h-9 font-medium text-xs"
            onClick={async () => {
              try {
                if (
                  !availableProviders ||
                  !("azure-ad" in availableProviders)
                ) {
                  setError("Microsoft provider is not configured.");
                  return;
                }
                await signIn("azure-ad", { callbackUrl, redirect: true });
              } catch (error) {
                if (process.env.NODE_ENV === "development") {
                  console.error("Microsoft signin error:", error);
                }
                setError("Microsoft signin failed. Please try again.");
              }
            }}
            disabled={
              loading ||
              !availableProviders ||
              !("azure-ad" in availableProviders)
            }
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zm12.6 0H12.6V0H24v11.4z" />
            </svg>
            <span className="ml-1.5 text-xs hidden sm:inline">Microsoft</span>
          </Button>
        </div>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground font-medium">
              or
            </span>
          </div>
        </div>

        {/* Sign Up Form */}
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="name" className="text-xs font-medium">
                  First name{" "}
                  <span className="text-muted-foreground font-normal text-[10px] ml-1">
                    Optional
                  </span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder=""
                  className="h-8 text-sm"
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lastname" className="text-xs font-medium">
                  Last name{" "}
                  <span className="text-muted-foreground font-normal text-[10px] ml-1">
                    Optional
                  </span>
                </Label>
                <Input
                  id="lastname"
                  type="text"
                  placeholder=""
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="registration" className="text-xs font-medium">
                Registration Number
              </Label>
              <Input
                id="registration"
                type="text"
                placeholder=""
                className="h-8 text-sm"
                value={signUpData.registrationNumber}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    registrationNumber: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-xs font-medium">
                Email{" "}
                <span className="text-muted-foreground font-normal text-[10px] ml-1">
                  Optional
                </span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder=""
                className="h-8 text-sm"
                value={signUpData.email}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder=""
                className="h-8 text-sm"
                value={signUpData.password}
                onChange={(e) =>
                  setSignUpData({ ...signUpData, password: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-xs font-medium">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder=""
                className="h-8 text-sm"
                value={signUpData.confirmPassword}
                onChange={(e) =>
                  setSignUpData({
                    ...signUpData,
                    confirmPassword: e.target.value,
                  })
                }
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-9 font-medium text-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-3 h-3 mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  Continue <span className="ml-1">→</span>
                </>
              )}
            </Button>
          </form>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSignIn} className="space-y-3">
            <div className="space-y-1">
              <Label
                htmlFor="signInRegistration"
                className="text-xs font-medium"
              >
                Registration Number
              </Label>
              <Input
                id="signInRegistration"
                type="text"
                placeholder=""
                className="h-8 text-sm"
                value={signInData.registrationNumber}
                onChange={(e) =>
                  setSignInData({
                    ...signInData,
                    registrationNumber: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="signInPassword" className="text-xs font-medium">
                Password
              </Label>
              <Input
                id="signInPassword"
                type="password"
                placeholder=""
                className="h-8 text-sm"
                value={signInData.password}
                onChange={(e) =>
                  setSignInData({ ...signInData, password: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2">
                <p className="text-xs text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-9 font-medium text-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner className="w-3 h-3 mr-2" />
                  Signing in...
                </>
              ) : (
                <>
                  Continue <span className="ml-1">→</span>
                </>
              )}
            </Button>
          </form>
        )}

        {/* Toggle between Sign Up and Sign In */}
        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError(null);
              }}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        {/* Secured by footer */}
        <div className="mt-5 pt-4 border-t border-border text-center">
          <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
            Secured by
            <span className="font-semibold text-foreground">NextAuth</span>
          </p>
        </div>
      </div>
    </div>
  );
}
