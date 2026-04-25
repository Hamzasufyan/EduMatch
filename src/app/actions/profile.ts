"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ProfileUpdate = {
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

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to update your profile." };
  }

  const { data: existing, error: fetchError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return { error: "Could not load your profile." };
  }

  const role = existing.role as "student" | "parent" | "tutor";

  const subjectsRaw = getString(formData, "subjects");
  const subjects = subjectsRaw
    ? subjectsRaw.split(",").map((s) => s.trim()).filter(Boolean)
    : null;

  const update: ProfileUpdate = {
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

  const { error: updateError } = await supabase
    .from("users")
    .update(update)
    .eq("id", user.id);

  if (updateError) {
    console.error("updateProfile failed:", updateError);
    return { error: updateError.message };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard", "layout");
  return { success: true };
}
