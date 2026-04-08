"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/app/actions/auth";
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
        disabled={loading}
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
    </form>
  );
}
