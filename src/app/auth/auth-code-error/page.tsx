import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default async function AuthCodeError({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-gray-200 shadow-sm">
        <CardContent className="pt-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Something went wrong while confirming your account. The link may have expired or already been used.
          </p>
          {message && (
            <p className="mt-2 text-xs text-red-400 font-mono break-all">
              {message}
            </p>
          )}
          <Link href="/auth">
            <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white">
              Back to Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
