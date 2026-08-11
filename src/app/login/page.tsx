import { signIn } from "@/auth";
import { Dumbbell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-sm border-none shadow-xl bg-card">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-12 h-12 bg-primary/10 text-primary flex items-center justify-center rounded-full mb-4">
            <Dumbbell className="w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome to Tracker</CardTitle>
          <CardDescription>
            Log in or create an account to start tracking your workouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              await signIn("credentials", formData);
            }}
            className="space-y-4 mb-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="mock@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In with Email
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <Button type="submit" variant="outline" className="w-full flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.81 15.69 17.6V20.35H19.26C21.36 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                <path d="M12 23C14.97 23 17.46 22.02 19.26 20.35L15.69 17.6C14.71 18.25 13.46 18.66 12 18.66C9.17 18.66 6.78 16.75 5.9 14.18H2.23V17.03C4.03 20.61 7.72 23 12 23Z" fill="#34A853"/>
                <path d="M5.9 14.18C5.67 13.51 5.54 12.78 5.54 12C5.54 11.22 5.67 10.49 5.9 9.82V6.97H2.23C1.49 8.44 1.05 10.16 1.05 12C1.05 13.84 1.49 15.56 2.23 17.03L5.9 14.18Z" fill="#FBBC05"/>
                <path d="M12 5.34C13.62 5.34 15.06 5.89 16.2 6.98L19.34 3.84C17.45 2.08 14.97 1 12 1C7.72 1 4.03 3.39 2.23 6.97L5.9 9.82C6.78 7.25 9.17 5.34 12 5.34Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
