import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users } from "lucide-react";
import { UserMenu } from "@/components/user-menu";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const ready = await ensureUserProfile(supabase, user);
  if (!ready) {
    redirect("/auth/choose-role");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .maybeSingle();

  const displayName = profile?.full_name || user.email?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-background font-sans relative">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/katara.jpg')" }}
      />

      <nav className="bg-card border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#8A1538]" />
          <span className="text-2xl font-bold text-[#8A1538]">EduMatch</span>
        </div>
        <UserMenu displayName={displayName} email={user.email ?? null} />
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-12 relative z-10">
        <Card className="border-border">
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-[#8A1538]" />
            <h2 className="text-2xl font-semibold text-foreground">
              Welcome, {displayName}!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your dashboard is being built. Check back soon to manage tutors
              and track your child&apos;s learning progress.
            </p>
            <p className="mt-4 text-sm text-muted-foreground/70">{user.email}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
