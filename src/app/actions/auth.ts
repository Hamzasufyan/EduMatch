"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as "student" | "parent" | "tutor";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { role },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Insert into public.users table
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email,
      role,
    });

    if (profileError) {
      return { error: profileError.message };
    }
  }

  return { success: true };
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

const VALID_ROLES = ["student", "parent", "tutor"] as const;
type Role = (typeof VALID_ROLES)[number];

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

  // If a row already exists, don't overwrite it — just move on.
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
    });

    if (insertError) {
      return { error: insertError.message };
    }
  }

  revalidatePath("/", "layout");
  return { success: true };
}
