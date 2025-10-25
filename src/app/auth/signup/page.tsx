"use client";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OAuthDebug } from "@/components/oauth-debug";
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

  const [availableProviders, setAvailableProviders] = useState<Record<string, unknown> | null>(null);
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

    if (!signUpData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpData.email.trim())) {
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
          registrationNumber: signUpData.registrationNumber.trim().toUpperCase(),
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
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-green-600">Account Created Successfully!</CardTitle>
          <CardDescription>
            Your account has been created. You can now sign in with your credentials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              setSuccess(false);
              setIsSignUp(false);
            }}
            className="w-full"
          >
            Sign In Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-base mt-2">
            {isSignUp
              ? "Join the hostel management system to get started"
              : "Sign in to access your dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OAuth Providers */}
          <div className="space-y-2 mb-6">
            <Button
              variant="outline"
              className="w-full"
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
              disabled={loading || !availableProviders || !("github" in availableProviders)}
            >
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={async () => {
                try {
                  if (!availableProviders || !("azure-ad" in availableProviders)) {
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
              disabled={loading || !availableProviders || !("azure-ad" in availableProviders)}
            >
              Continue with Microsoft
            </Button>
          </div>
          
          {/* Debug info for development */}
          {process.env.NODE_ENV === "development" && (
            <div className="mt-4">
              <OAuthDebug />
              <div className="mt-2 text-xs text-muted-foreground">
                <a href="/test-oauth" className="underline">Test OAuth separately</a>
              </div>
            </div>
          )}

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Sign Up Form */}
          {isSignUp ? (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={signUpData.name}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={signUpData.email}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  type="text"
                  placeholder="e.g. 21XX1234"
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={signUpData.password}
                  onChange={(e) =>
                    setSignUpData({ ...signUpData, password: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          ) : (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signInRegistration">Registration Number</Label>
                <Input
                  id="signInRegistration"
                  type="text"
                  placeholder="Enter your registration number"
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
              <div className="space-y-2">
                <Label htmlFor="signInPassword">Password</Label>
                <Input
                  id="signInPassword"
                  type="password"
                  placeholder="Enter your password"
                  value={signInData.password}
                  onChange={(e) =>
                    setSignInData({ ...signInData, password: e.target.value })
                  }
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          )}

          {/* Toggle between Sign Up and Sign In */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
  );
}