import type { SupabaseClient, User } from "@supabase/supabase-js";

const VALID_ROLES = ["student", "parent", "tutor"] as const;
type Role = (typeof VALID_ROLES)[number];

function isRole(value: unknown): value is Role {
  return typeof value === "string" && (VALID_ROLES as readonly string[]).includes(value);
}

/**
 * Makes sure there's a `public.users` row for the given authenticated user.
 * Returns `true` if the row now exists, `false` if we couldn't create it
 * (typically because the user hasn't picked a role yet — caller should
 * redirect to /auth/choose-role in that case).
 */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<boolean> {
  const { data: existing, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (selectError) {
    console.error("ensureUserProfile select failed:", selectError);
    return false;
  }

  if (existing) return true;

  const metadata = (user.user_metadata ?? {}) as Record<string, unknown>;
  const role = metadata.role;

  if (!isRole(role)) return false;

  const subjectsRaw = metadata.subjects;
  const subjects = Array.isArray(subjectsRaw)
    ? (subjectsRaw.filter((s): s is string => typeof s === "string"))
    : null;

  const { error: insertError } = await supabase.from("users").insert({
    id: user.id,
    email: user.email,
    role,
    full_name: (metadata.full_name as string | null) ?? null,
    phone: (metadata.phone as string | null) ?? null,
    city: (metadata.city as string | null) ?? null,
    grade_level: (metadata.grade_level as string | null) ?? null,
    subjects: role === "tutor" ? subjects : null,
    hourly_rate:
      role === "tutor" && typeof metadata.hourly_rate === "number"
        ? metadata.hourly_rate
        : null,
    years_experience:
      role === "tutor" && typeof metadata.years_experience === "number"
        ? metadata.years_experience
        : null,
    bio: role === "tutor" ? ((metadata.bio as string | null) ?? null) : null,
  });

  if (insertError) {
    console.error("ensureUserProfile insert failed:", insertError);
    return false;
  }

  return true;
}
