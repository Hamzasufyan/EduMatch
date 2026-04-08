"use client";

import React, { useState } from "react";
import {
  UserCircle,
  Lock,
  Unlock,
  GraduationCap,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { signOut } from "@/app/actions/auth";

// Mock data for student requests
const MOCK_REQUESTS = [
  {
    id: 1,
    studentName: "Ahmed Al-Thani",
    grade: "Grade 10",
    subject: "Mathematics",
    location: "Doha, West Bay",
    message: "Looking for help with Algebra and preparation for mid-terms.",
    email: "ahmed.parent@example.com",
    phone: "+974 5555 1234",
    postedAt: "2 hours ago"
  },
  {
    id: 2,
    studentName: "Sarah Khalid",
    grade: "University (Year 1)",
    subject: "Computer Science",
    location: "Online",
    message: "Need assistance understanding Python and basic data structures.",
    email: "sarah.k@example.edu",
    phone: "+974 3333 5678",
    postedAt: "5 hours ago"
  },
  {
    id: 3,
    studentName: "Mohammed Y.",
    grade: "Grade 6",
    subject: "English Language",
    location: "Al Rayyan",
    message: "We need a native speaker to help with conversational English.",
    email: "mohammed.family@example.com",
    phone: "+974 6666 9012",
    postedAt: "1 day ago"
  }
];

export default function TutorRequestsPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans relative" dir="ltr">
      {/* Katara Cultural Village background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 dark:opacity-20 pointer-events-none"
        style={{ backgroundImage: "url('/katara.jpg')" }}
      />

      {/* Navigation / Top Bar */}
      <nav className="bg-card border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#8A1538]" />
          <span className="text-2xl font-bold text-[#8A1538]">EduMatch</span>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden md:block">Welcome, Tutor</span>
          <form action={signOut}>
            <button type="submit" className="text-muted-foreground hover:text-[#8A1538] transition-colors">
              <UserCircle className="h-8 w-8" />
            </button>
          </form>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">

        {/* Marketing Strategy Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg bg-[#8A1538]">
          <img
            src="https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=2000"
            alt="Students in a classroom"
            className="w-full h-64 object-cover opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Connect with Hundreds of Students in Qatar
            </h1>
            {!isSubscribed && (
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                <p className="text-white mb-4 text-lg">
                  Upgrade to <span className="font-bold text-amber-400">EduMatch Premium</span> to unlock direct contact details and grow your tutoring business today.
                </p>
                <button
                  onClick={() => setIsSubscribed(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all flex items-center space-x-2 mx-auto"
                >
                  <Unlock className="w-5 h-5" />
                  <span>Unlock Full Access</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page Header */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Recent Student Requests</h2>
            <p className="text-muted-foreground mt-1">Students actively looking for tutors in your subjects.</p>
          </div>
          {isSubscribed && (
            <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Premium Active
            </span>
          )}
        </div>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_REQUESTS.map((request) => (
            <div key={request.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow">

              {/* Card Header */}
              <div className="p-5 border-b border-border bg-[#8A1538]/5 dark:bg-[#8A1538]/10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-foreground">{request.subject}</h3>
                  <span className="text-xs font-medium text-muted-foreground bg-background px-2 py-1 rounded-md border border-border">
                    {request.postedAt}
                  </span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <span className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-1 text-emerald-500" />
                    {request.grade}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                    {request.location}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  &ldquo;{request.message}&rdquo;
                </p>
              </div>

              {/* Card Footer (The Paywall) */}
              <div className="p-5 bg-muted/50 border-t border-border">
                {isSubscribed ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-foreground">Contact Details:</p>
                    <div className="flex items-center text-sm text-foreground">
                      <Mail className="w-4 h-4 mr-2 text-[#8A1538]" />
                      <a href={`mailto:${request.email}`} className="hover:text-[#8A1538] hover:underline">{request.email}</a>
                    </div>
                    <div className="flex items-center text-sm text-foreground">
                      <Phone className="w-4 h-4 mr-2 text-emerald-600" />
                      <a href={`tel:${request.phone}`} className="hover:text-emerald-600 hover:underline">{request.phone}</a>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Blurred Data */}
                    <div className="space-y-3 blur-[4px] select-none opacity-60">
                      <p className="text-sm font-medium text-foreground">Contact Details:</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="w-4 h-4 mr-2" />
                        hidden.email@example.com
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Phone className="w-4 h-4 mr-2" />
                        +974 0000 0000
                      </div>
                    </div>

                    {/* Lock Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <Lock className="w-6 h-6 text-foreground mb-2" />
                      <button
                        onClick={() => setIsSubscribed(true)}
                        className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white text-xs font-semibold py-2 px-4 rounded-full transition-colors"
                      >
                        Subscribe to View
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
