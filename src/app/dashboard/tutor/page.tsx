import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";
import TutorRequestsPage from "./tutor-requests";

export default async function TutorDashboard() {
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

  return <TutorRequestsPage displayName={displayName} email={user.email ?? null} />;
}
