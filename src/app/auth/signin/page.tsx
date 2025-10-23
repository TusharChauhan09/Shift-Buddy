"use client";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function SignInPage() {
  const [registrationNumber, setReg] = useState("");
  const [password, setPw] = useState("");

  return (
    <div className="min-h-[60vh] max-w-md mx-auto flex flex-col gap-4 py-10">
      <h1 className="text-2xl font-bold">Sign in</h1>

      <div className="flex gap-2">
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
        <Button variant="outline" onClick={() => signIn("azure-ad")}>Microsoft</Button>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          signIn("credentials", { registrationNumber, password, callbackUrl: "/" });
        }}
     >
        <label className="text-sm">Registration Number</label>
        <input className="border rounded px-3 py-2" value={registrationNumber} onChange={(e) => setReg(e.target.value)} />
        <label className="text-sm">Password</label>
        <input type="password" className="border rounded px-3 py-2" value={password} onChange={(e) => setPw(e.target.value)} />
        <Button type="submit">Sign in with Credentials</Button>
      </form>
    </div>
  );
}
