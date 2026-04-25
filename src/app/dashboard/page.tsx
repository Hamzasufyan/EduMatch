import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Make sure the profile row exists (handles email-confirmation flows
  // where the row couldn't be written at signUp time).
  const profileReady = await ensureUserProfile(supabase, user);
  if (!profileReady) {
    redirect("/auth/choose-role");
  }

  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const role = profile?.role ?? (user.user_metadata?.role as string | undefined);

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  }
  if (role === "parent") {
    redirect("/dashboard/parent");
  }
  redirect("/dashboard/student");
}
