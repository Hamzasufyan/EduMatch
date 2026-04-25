import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { RolePicker } from "./role-picker";

export default async function ChooseRolePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // If they already have a role, skip this step.
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/katara.jpg')" }}
      />
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#8A1538]">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#8A1538]">Welcome to EduMatch</h1>
          <p className="mt-1 text-sm text-gray-500">
            Tell us how you&apos;ll be using EduMatch so we can personalize your experience.
          </p>
        </div>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4">
            <RolePicker />
          </CardHeader>
          <CardContent />
        </Card>
      </div>
    </div>
  );
}
