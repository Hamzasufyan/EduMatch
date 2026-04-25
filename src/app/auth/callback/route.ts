import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!code) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?message=no_code_in_callback`
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("callback exchangeCodeForSession failed:", error);
    const params = new URLSearchParams({ message: error.message });
    return NextResponse.redirect(`${origin}/auth/auth-code-error?${params}`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/auth-code-error?message=no_user_after_exchange`
    );
  }

  // Try to materialize the public.users row from user_metadata (set during
  // email signUp). If the user hasn't picked a role yet (typical for OAuth
  // first-time sign-ins), send them to the role-selection step.
  const profileReady = await ensureUserProfile(supabase, user);

  if (!profileReady) {
    return NextResponse.redirect(`${origin}/auth/choose-role`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
