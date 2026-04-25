"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "student" | "parent" | "tutor";

export function ProfileFields({ role }: { role: Role }) {
  return (
    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" placeholder="Jane Doe" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Contact number</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+974 5000 0000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" placeholder="Doha" required />
      </div>

      {role === "student" && (
        <div className="space-y-2">
          <Label htmlFor="gradeLevel">Grade / year</Label>
          <Input
            id="gradeLevel"
            name="gradeLevel"
            placeholder="e.g. Grade 10, University Year 1"
          />
        </div>
      )}

      {role === "tutor" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects you teach</Label>
            <Input
              id="subjects"
              name="subjects"
              placeholder="Mathematics, Physics, IELTS"
              required
            />
            <p className="text-xs text-muted-foreground">
              Separate multiple subjects with commas.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Hourly rate (QAR)</Label>
              <Input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                min="0"
                step="5"
                placeholder="150"
                required
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
                placeholder="5"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short bio</Label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              required
              placeholder="Tell students a bit about your teaching style and background."
              className="flex w-full rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </>
      )}
    </div>
  );
}
