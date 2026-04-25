"use client";

import React, { useState } from "react";
import {
  MapPin,
  Star,
  Search,
  BookOpen,
  Clock,
  MessageSquare,
  Filter,
} from "lucide-react";
import { GraduationCap } from "lucide-react";
import { UserMenu } from "@/components/user-menu";

type Tutor = {
  id: number;
  name: string;
  subject: string;
  specialties: string[];
  location: string;
  stars: number;
  hourlyRate: string;
  experience: string;
  availability: string;
  bio: string;
  avatar: string;
};

const MOCK_TUTORS: Tutor[] = [];

const SUBJECTS = ["All Subjects", "Mathematics", "Computer Science", "English Language", "Physics", "Chemistry", "Biology"];

type StudentViewProps = {
  displayName: string;
  email: string | null;
};

export default function StudentView({ displayName, email }: StudentViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [starredTutors, setStarredTutors] = useState<Set<number>>(new Set());
  const [starCounts, setStarCounts] = useState<Record<number, number>>(
    () => Object.fromEntries(MOCK_TUTORS.map((t) => [t.id, t.stars]))
  );

  function toggleStar(tutorId: number) {
    setStarredTutors((prev) => {
      const next = new Set(prev);
      if (next.has(tutorId)) {
        next.delete(tutorId);
        setStarCounts((c) => ({ ...c, [tutorId]: c[tutorId] - 1 }));
      } else {
        next.add(tutorId);
        setStarCounts((c) => ({ ...c, [tutorId]: c[tutorId] + 1 }));
      }
      return next;
    });
  }

  const filteredTutors = MOCK_TUTORS.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSubject = selectedSubject === "All Subjects" || tutor.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="min-h-screen bg-background font-sans relative">
      {/* Katara Cultural Village background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center opacity-30 pointer-events-none"
        style={{ backgroundImage: "url('/katara.jpg')" }}
      />
      {/* Navigation */}
      <nav className="bg-card border-b border-border px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-[#8A1538]" />
          <span className="text-2xl font-bold text-[#8A1538]">EduMatch</span>
        </div>
        <UserMenu displayName={displayName} email={email} />
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-10 shadow-lg bg-gradient-to-r from-[#8A1538] to-[#5C0E26]">
          <div className="px-8 py-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Find Your Perfect Tutor
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Browse top-rated tutors in Qatar. Filter by subject, read reviews, and send a request today.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, subject, or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-full text-gray-900 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#8A1538] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedSubject === subject
                  ? "bg-[#8A1538] text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-4">
          {filteredTutors.length} tutor{filteredTutors.length !== 1 ? "s" : ""} found
        </p>

        {/* Tutor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Tutor Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-14 w-14 rounded-full bg-[#8A1538]/10 flex items-center justify-center text-[#8A1538] font-bold text-lg flex-shrink-0">
                    {tutor.avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-lg text-foreground">{tutor.name}</h3>
                    <p className="text-[#8A1538] font-medium text-sm">{tutor.subject}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <button
                        onClick={() => toggleStar(tutor.id)}
                        className="flex items-center gap-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            starredTutors.has(tutor.id)
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">{starCounts[tutor.id]}</span>
                      </button>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {tutor.location}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-foreground">{tutor.hourlyRate}</p>
                    <p className="text-xs text-muted-foreground">per hour</p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-[#8A1538]/10 text-[#8A1538] text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1" />
                    {tutor.experience}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {tutor.availability}
                  </span>
                </div>

                {/* Action Button */}
                <button className="w-full bg-[#8A1538] hover:bg-[#6B102C] text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Send Request
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-16">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">No tutors found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
}
