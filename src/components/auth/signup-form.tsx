"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, BookOpen, Loader2 } from "lucide-react";

type RoleCategory = "learner" | "tutor" | null;
type Role = "student" | "parent" | "tutor";

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [roleCategory, setRoleCategory] = useState<RoleCategory>(null);
  const [subRole, setSubRole] = useState<"student" | "parent">("student");

  async function handleSubmit(formData: FormData) {
    setError(null);

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (!roleCategory) {
      setError("Please select a role.");
      return;
    }

    const role: Role = roleCategory === "tutor" ? "tutor" : subRole;
    formData.set("role", role);

    setLoading(true);
    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setError(null);
    setGoogleLoading(true);

    const supabase = createClient();
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setGoogleLoading(false);
    }
    // On success, the browser is redirected to Google. New users will land on
    // /auth/choose-role after the callback to pick their role.
  }

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <GraduationCap className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We&apos;ve sent you a confirmation link. Please check your inbox to activate your account.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {/* Role Selection Cards */}
      <div className="space-y-2">
        <Label>I am a...</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRoleCategory("learner")}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
              roleCategory === "learner"
                ? "border-[#8A1538] bg-[#8A1538]/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <GraduationCap
              className={`h-8 w-8 ${
                roleCategory === "learner" ? "text-[#8A1538]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                roleCategory === "learner" ? "text-[#8A1538]" : "text-gray-700"
              }`}
            >
              Student / Parent
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRoleCategory("tutor")}
            className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
              roleCategory === "tutor"
                ? "border-[#8A1538] bg-[#8A1538]/10"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <BookOpen
              className={`h-8 w-8 ${
                roleCategory === "tutor" ? "text-[#8A1538]" : "text-gray-400"
              }`}
            />
            <span
              className={`text-sm font-medium ${
                roleCategory === "tutor" ? "text-[#8A1538]" : "text-gray-700"
              }`}
            >
              Tutor
            </span>
          </button>
        </div>
      </div>

      {/* Sub-role selection for Student/Parent */}
      {roleCategory === "learner" && (
        <div className="space-y-2">
          <Label>Specifically, I am a...</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="subRole"
                value="student"
                checked={subRole === "student"}
                onChange={() => setSubRole("student")}
                className="h-4 w-4 text-[#8A1538] focus:ring-[#8A1538]"
              />
              <span className="text-sm text-gray-700">Student</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="subRole"
                value="parent"
                checked={subRole === "parent"}
                onChange={() => setSubRole("parent")}
                className="h-4 w-4 text-[#8A1538] focus:ring-[#8A1538]"
              />
              <span className="text-sm text-gray-700">Parent</span>
            </label>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirm Password</Label>
        <Input
          id="signup-confirm"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <Button
        type="submit"
        className="w-full bg-[#8A1538] hover:bg-[#6B102C] text-white"
        disabled={loading || googleLoading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-gray-400">Or</span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignUp}
        disabled={loading || googleLoading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>
    </form>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
