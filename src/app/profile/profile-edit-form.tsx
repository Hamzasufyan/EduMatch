"use client";

import { useState } from "react";
import {
  BookOpen,
  Briefcase,
  DollarSign,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Save,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "@/app/actions/profile";

type Role = "student" | "parent" | "tutor";

type InitialValues = {
  fullName: string;
  phone: string;
  city: string;
  gradeLevel: string;
  subjects: string[];
  hourlyRate: number | null;
  yearsExperience: number | null;
  bio: string;
};

type ProfileEditFormProps = {
  role: Role;
  email: string;
  initial: InitialValues;
};

export function ProfileEditForm({ role, email, initial }: ProfileEditFormProps) {
  const [status, setStatus] = useState<
    { kind: "idle" } | { kind: "saving" } | { kind: "saved" } | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function handleSubmit(formData: FormData) {
    setStatus({ kind: "saving" });
    const result = await updateProfile(formData);
    if (result?.error) {
      setStatus({ kind: "error", message: result.error });
      return;
    }
    setStatus({ kind: "saved" });
  }

  return (
    <form
      action={handleSubmit}
      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
    >
      <div className="p-6 border-b border-border bg-gradient-to-r from-[#8A1538]/5 to-transparent">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#8A1538]">
          <Briefcase className="h-3.5 w-3.5" />
          {role === "tutor" ? "Tutor Profile" : role === "parent" ? "Parent Profile" : "Student Profile"}
        </div>
        <h2 className="text-lg font-semibold text-foreground mt-1">Personal details</h2>
      </div>

      <div className="p-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email
          </Label>
          <Input id="email" value={email} disabled readOnly />
          <p className="text-xs text-muted-foreground">
            Email is tied to your login and can&apos;t be changed here.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName" className="flex items-center gap-1.5">
            <UserIcon className="h-3.5 w-3.5 text-muted-foreground" />
            Full name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={initial.fullName}
            placeholder="Jane Doe"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              Contact number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={initial.phone}
              placeholder="+974 5000 0000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              City
            </Label>
            <Input
              id="city"
              name="city"
              defaultValue={initial.city}
              placeholder="Doha"
            />
          </div>
        </div>

        {role === "student" && (
          <div className="space-y-2">
            <Label htmlFor="gradeLevel" className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
              Grade / year
            </Label>
            <Input
              id="gradeLevel"
              name="gradeLevel"
              defaultValue={initial.gradeLevel}
              placeholder="e.g. Grade 10"
            />
          </div>
        )}

        {role === "tutor" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="subjects" className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
                Subjects you teach
              </Label>
              <Input
                id="subjects"
                name="subjects"
                defaultValue={initial.subjects.join(", ")}
                placeholder="Mathematics, Physics, IELTS"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple subjects with commas.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hourlyRate" className="flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  Hourly rate (QAR)
                </Label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  min="0"
                  step="5"
                  defaultValue={initial.hourlyRate ?? ""}
                  placeholder="150"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">Years of experience</Label>
                <Input
                  id="yearsExperience"
                  name="yearsExperience"
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={initial.yearsExperience ?? ""}
                  placeholder="5"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Short bio</Label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                defaultValue={initial.bio}
                placeholder="Tell students a bit about your teaching style and background."
                className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </>
        )}
      </div>

      <div className="px-6 py-4 bg-muted/30 border-t border-border flex items-center justify-between gap-4">
        <div className="text-sm min-h-[20px]">
          {status.kind === "saved" && (
            <span className="text-emerald-600 font-medium">
              Saved successfully.
            </span>
          )}
          {status.kind === "error" && (
            <span className="text-destructive font-medium">{status.message}</span>
          )}
        </div>
        <Button
          type="submit"
          disabled={status.kind === "saving"}
          className="bg-[#8A1538] hover:bg-[#6B102C] text-white"
        >
          {status.kind === "saving" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save changes
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
