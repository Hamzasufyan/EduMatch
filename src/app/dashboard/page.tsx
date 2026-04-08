import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  // Get role from user metadata
  const role = user.user_metadata?.role as string;

  if (role === "tutor") {
    redirect("/dashboard/tutor");
  } else if (role === "parent") {
    redirect("/dashboard/parent");
  } else {
    redirect("/dashboard/student");
  }
}
