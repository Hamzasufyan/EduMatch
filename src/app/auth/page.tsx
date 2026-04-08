"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { GraduationCap } from "lucide-react";

export default function AuthPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative">
      {/* Katara Cultural Village background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/katara.jpg')" }}
      />
      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8A1538]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#8A1538]">EduMatch</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Find the perfect tutor for your learning journey
          </p>
        </div>

        {/* Auth Card */}
        <Card className="border-gray-200 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-4">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Log In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <LoginForm />
              </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <SignupForm />
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent />
        </Card>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          By continuing, you agree to EduMatch&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
