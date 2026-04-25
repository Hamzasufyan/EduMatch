import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { UserMenu } from "@/components/user-menu";

export default async function AccountSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
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
        <Link href="/dashboard" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#8A1538]" />
          <span className="text-2xl font-bold text-[#8A1538]">EduMatch</span>
        </Link>
        <UserMenu displayName={displayName} email={user.email ?? null} />
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-10 relative z-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-[#8A1538] transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your login, notifications, and privacy preferences.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#8A1538]/10">
            <Settings className="h-7 w-7 text-[#8A1538]" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Coming soon</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            Password changes, email preferences, and privacy controls will live
            here. For now, head to{" "}
            <Link href="/profile" className="text-[#8A1538] font-medium hover:underline">
              My Profile
            </Link>{" "}
            to update your personal details.
          </p>
        </div>
      </main>
    </div>
  );
}
