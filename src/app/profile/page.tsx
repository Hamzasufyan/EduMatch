import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import { UserMenu } from "@/components/user-menu";
import { ProfileEditForm } from "./profile-edit-form";

type Role = "student" | "parent" | "tutor";

export default async function ProfilePage() {
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
    .select(
      "role, full_name, phone, city, grade_level, subjects, hourly_rate, years_experience, bio"
    )
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/auth/choose-role");
  }

  const displayName = profile.full_name || user.email?.split("@")[0] || "there";

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
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground mt-1">
            Update your details so students and tutors can find you.
          </p>
        </div>

        <ProfileEditForm
          role={profile.role as Role}
          email={user.email ?? ""}
          initial={{
            fullName: profile.full_name ?? "",
            phone: profile.phone ?? "",
            city: profile.city ?? "",
            gradeLevel: profile.grade_level ?? "",
            subjects: profile.subjects ?? [],
            hourlyRate: profile.hourly_rate ?? null,
            yearsExperience: profile.years_experience ?? null,
            bio: profile.bio ?? "",
          }}
        />
      </main>
    </div>
  );
}
