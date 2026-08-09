"use client";

import { useSession, signOut } from "next-auth/react";
import { User, LogOut, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const { data: session } = useSession();

  const handleExport = async () => {
    try {
      const res = await fetch('/api/export');
      if (!res.ok) throw new Error('Failed to export data');
      const data = await res.json();
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "workout-data.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to export data");
    }
  };

  return (
    <div className="container max-w-2xl py-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <User className="w-6 h-6" />
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-muted-foreground text-xs">Name</Label>
            <p className="font-medium">{session?.user?.name || "Anonymous User"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground text-xs">Email</Label>
            <p className="font-medium">{session?.user?.email || "No email"}</p>
          </div>
        </CardContent>
      </Card>



      <Card>
        <CardHeader>
          <CardTitle>Data</CardTitle>
          <CardDescription>Manage your workout data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-start" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export Data to JSON
          </Button>
        </CardContent>
      </Card>

      <Button variant="destructive" className="w-full mt-8" onClick={() => signOut({ callbackUrl: "/login" })}>
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
