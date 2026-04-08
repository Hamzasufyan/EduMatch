import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, LogOut } from "lucide-react";

export default async function ParentDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">EduMatch</h1>
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <Card className="border-gray-200">
          <CardContent className="pt-6 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-blue-600" />
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome, Parent!
            </h2>
            <p className="mt-2 text-gray-600">
              Your dashboard is being built. Check back soon to manage tutors
              and track your child&apos;s learning progress.
            </p>
            <p className="mt-4 text-sm text-gray-400">{user.email}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
