"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ensureUserProfile } from "@/lib/supabase/ensure-profile";

const VALID_ROLES = ["student", "parent", "tutor"] as const;
type Role = (typeof VALID_ROLES)[number];

type ProfileFields = {
  full_name: string | null;
  phone: string | null;
  city: string | null;
  grade_level: string | null;
  subjects: string[] | null;
  hourly_rate: number | null;
  years_experience: number | null;
  bio: string | null;
};

function getString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function getNumber(formData: FormData, key: string): number | null {
  const raw = getString(formData, key);
  if (raw === null) return null;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractProfileFields(formData: FormData, role: Role): ProfileFields {
  const subjectsRaw = getString(formData, "subjects");
  const subjects = subjectsRaw
    ? subjectsRaw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : null;

  return {
    full_name: getString(formData, "fullName"),
    phone: getString(formData, "phone"),
    city: getString(formData, "city"),
    grade_level: role === "student" ? getString(formData, "gradeLevel") : null,
    subjects: role === "tutor" ? subjects : null,
    hourly_rate: role === "tutor" ? getNumber(formData, "hourlyRate") : null,
    years_experience:
      role === "tutor" ? getNumber(formData, "yearsExperience") : null,
    bio: role === "tutor" ? getString(formData, "bio") : null,
  };
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role");

  if (typeof role !== "string" || !VALID_ROLES.includes(role as Role)) {
    return { error: "Please choose a valid role." };
  }

  const profile = extractProfileFields(formData, role as Role);

  // Store role + profile in user_metadata so /auth/callback (or any later
  // server action) can materialize the public.users row once a session
  // actually exists. Doing the insert here fails under RLS when Supabase
  // email confirmation is enabled, because signUp returns no session.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        ...profile,
      },
    },
  });

  if (error) {
    console.error("signUp auth error:", error);
    return { error: error.message };
  }

  // If email confirmation is disabled, a session is created immediately
  // and we can insert the profile row straight away.
  if (data.session && data.user) {
    const created = await ensureUserProfile(supabase, data.user);
    if (!created) {
      console.error("signUp: failed to create public.users row");
    }
  }

  return {
    success: true,
    needsEmailConfirmation: !data.session,
  };
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth");
}

export async function setRole(formData: FormData) {
  const role = formData.get("role");

  if (typeof role !== "string" || !VALID_ROLES.includes(role as Role)) {
    return { error: "Please choose a valid role." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to choose a role." };
  }

  const profile = extractProfileFields(formData, role as Role);

  // If a row already exists, don't overwrite it.
  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    const { error: insertError } = await supabase.from("users").insert({
      id: user.id,
      email: user.email,
      role,
      ...profile,
    });

    if (insertError) {
      console.error("setRole insert failed:", insertError);
      return { error: insertError.message };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}
